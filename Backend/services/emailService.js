// backend/services/emailService.js
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Create transporter
const transporter = nodemailer.createTransporter({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to check limits and send emails
const checkLimitsAndNotify = async () => {
  try {
    const users = await User.find({});
    
    for (const user of users) {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Calculate monthly expenses
      const monthlyExpenses = await Expense.find({
        userId: user._id,
        date: { $gte: firstDayOfMonth }
      });
      
      const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const remaining = user.monthlyLimit - totalSpent;
      const percentage = (totalSpent / user.monthlyLimit) * 100;
      
      // Send notification if over 80% of limit
      if (percentage >= 80 && percentage < 100) {
        await sendEmail(
          user.email,
          'Budget Alert: You\'re approaching your monthly limit',
          `Hi ${user.name}, you've used ${percentage.toFixed(2)}% of your monthly budget. 
          You've spent ₹${totalSpent} of your ₹${user.monthlyLimit} budget, with ₹${remaining} remaining.`
        );
      }
      
      // Send notification if over limit
      if (percentage >= 100) {
        await sendEmail(
          user.email,
          'Budget Alert: You\'ve exceeded your monthly limit',
          `Hi ${user.name}, you've exceeded your monthly budget by ₹${-remaining}. 
          You've spent ₹${totalSpent} of your ₹${user.monthlyLimit} budget.`
        );
      }
    }
  } catch (error) {
    console.error('Error in limit checking:', error);
  }
};

// Send email function
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { checkLimitsAndNotify, sendEmail };