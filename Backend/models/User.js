const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'working'],
    required: true
  },
  monthlyLimit: {
    type: Number,
    default: 0
  },
  dailyLimit: {
    type: Number,
    default: 0
  },
  notificationTimes: {
    type: [String],
    default: ['11:00', '15:00', '18:00']
  },
  monthlySalary: {
    type: Number,
    default: 0
  },
  monthlyBills: {
    type: Number,
    default: 0
  },
  savingAllocation: {
    type: Number,
    default: 0
  },
  monthlySavingGoal: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);