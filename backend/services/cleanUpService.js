const nodeCron = require("node-cron");const Email = require('../models/emailModel');

const deleteOldEmails = async () => {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const result = await Email.deleteMany({ date: { $lt: twoYearsAgo } });
    console.log(`[CRON JOB] Successfully deleted ${result.deletedCount} emails older than 2 years.`);
  } catch (error) {
    console.error('[CRON JOB] Error deleting old emails:', error);
  }
};

module.exports = { deleteOldEmails };

