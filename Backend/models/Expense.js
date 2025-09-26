// Backend/models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  reason: {
    type: String,
    enum: ['bills', 'leisure', 'eat_drink', 'travel', 'misc', 'bill_split'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  splitDetails: {
    totalBill: Number,
    numberOfPeople: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);