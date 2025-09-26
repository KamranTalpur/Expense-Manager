// backend/routes/users.js
const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current logged-in user's profile (excluding password)
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update user settings (limits, salary, savings, notifications, etc.)
 * @access  Private
 */
router.put("/me", auth, async (req, res) => {
  try {
    const {
      dailyLimit,
      monthlyLimit,
      monthlySalary,
      monthlyBills,
      savingAllocation,
      monthlySavingGoal,
      notificationTimes,
    } = req.body;

    // Build update object only with provided fields (prevent overwriting with undefined)
    const updates = {};
    if (dailyLimit !== undefined) updates.dailyLimit = dailyLimit;
    if (monthlyLimit !== undefined) updates.monthlyLimit = monthlyLimit;
    if (monthlySalary !== undefined) updates.monthlySalary = monthlySalary;
    if (monthlyBills !== undefined) updates.monthlyBills = monthlyBills;
    if (savingAllocation !== undefined)
      updates.savingAllocation = savingAllocation;
    if (monthlySavingGoal !== undefined)
      updates.monthlySavingGoal = monthlySavingGoal;
    if (notificationTimes !== undefined)
      updates.notificationTimes = notificationTimes;

    // Update the user with safe fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
