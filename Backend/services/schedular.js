// backend/services/scheduler.js
const cron = require('node-cron');
const { checkLimitsAndNotify } = require('./emailService');

// Run every day at 9 AM
cron.schedule('0 9 * * *', () => {
  console.log('Running daily limit check...');
  checkLimitsAndNotify();
});

module.exports = cron;