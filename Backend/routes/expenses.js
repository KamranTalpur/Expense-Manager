/**
 * backend/routes/expenses.js
 *
 * This route handles all expense-related operations for authenticated users.
 * It ensures that users can only access their own expenses and also enforces
 * spending limits (daily, monthly, and salary-based) defined in their User settings.
 */

const express = require("express");
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for the authenticated user
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   POST /api/expenses
 * @desc    Add a new expense with daily/monthly/salary limit enforcement
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { date, name, reason, amount, splitDetails } = req.body;

    // Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Expense name is required." });
    }
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) {
      return res.status(400).json({ message: "Amount must be a number." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const expenseDate = date ? new Date(date) : new Date();
    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({ message: "Invalid date provided." });
    }

    /** ------------------ DAILY TOTAL CHECK ------------------ **/
    const dayStart = new Date(expenseDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(expenseDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dailyTotal = await Expense.aggregate([
      { $match: { userId: user._id, date: { $gte: dayStart, $lte: dayEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const currentDaily = dailyTotal[0]?.total || 0;

    if (user.dailyLimit && currentDaily + numericAmount > user.dailyLimit) {
      return res.status(400).json({
        message: "Daily limit exceeded! Cannot add this expense.",
      });
    }

    /** ------------------ MONTHLY TOTAL CHECK ------------------ **/
    const monthStart = new Date(
      expenseDate.getFullYear(),
      expenseDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      expenseDate.getFullYear(),
      expenseDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const monthlyTotal = await Expense.aggregate([
      {
        $match: {
          userId: user._id,
          date: { $gte: monthStart, $lte: monthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const currentMonthly = monthlyTotal[0]?.total || 0;

    if (
      user.monthlyLimit &&
      currentMonthly + numericAmount > user.monthlyLimit
    ) {
      return res.status(400).json({
        message: "Monthly limit exceeded! Cannot add this expense.",
      });
    }

    /** ------------------ SALARY & SAVING CHECK ------------------ **/
    if (user.userType === "working" && user.monthlySalary) {
      const salary = user.monthlySalary;
      const bills = user.monthlyBills || 0;
      const allocation = user.savingAllocation || 0;
      const savingGoal = user.monthlySavingGoal || 0;

      const totalExpensesThisMonth = currentMonthly + numericAmount;
      const availableForSpending = salary - bills;

      // Check saving allocation %
      const requiredSaving = (allocation / 100) * salary;
      if (
        allocation > 0 &&
        totalExpensesThisMonth > availableForSpending - requiredSaving
      ) {
        return res.status(400).json({
          message: `Saving allocation exceeded! You must keep at least Rs ${requiredSaving} aside.`,
        });
      }

      // Check fixed saving goal
      if (
        savingGoal > 0 &&
        totalExpensesThisMonth > availableForSpending - savingGoal
      ) {
        return res.status(400).json({
          message: `Monthly saving goal of Rs ${savingGoal} would be at risk.`,
        });
      }
    }

    /** ------------------ SAVE EXPENSE ------------------ **/
    const expense = new Expense({
      userId: req.user.id,
      date: expenseDate,
      name: name.trim(),
      reason: reason || "misc",
      amount: numericAmount,
      splitDetails,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense
 * @access  Private
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Accept only these editable fields
    const { name, reason, amount, date } = req.body;

    if (name !== undefined) {
      if (String(name).trim() === "") {
        return res
          .status(400)
          .json({ message: "Expense name cannot be empty." });
      }
      expense.name = String(name).trim();
    }

    if (reason !== undefined) {
      expense.reason = reason || expense.reason;
    }

    if (amount !== undefined) {
      const num = Number(amount);
      if (Number.isNaN(num)) {
        return res.status(400).json({ message: "Amount must be a number." });
      }
      expense.amount = num;
    }

    if (date !== undefined) {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "Invalid date provided." });
      }
      expense.date = parsed;
    }

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete a single expense
 * @access  Private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   DELETE /api/expenses/reset
 * @desc    Delete ALL expenses for the authenticated user
 * @access  Private
 */
router.delete("/reset", auth, async (req, res) => {
  try {
    await Expense.deleteMany({ userId: req.user.id });
    res.json({ message: "All your expenses have been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
