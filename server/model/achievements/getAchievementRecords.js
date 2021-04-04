const db = require('../../lib/mysql')();

const getAchievementRecords = async (log) => {
  log.info({ source: 'achievements.getAchievementRecords' }, 'Retrieving achievement records');
  const { results } = await db.query('SELECT * FROM achievements');
  return results;
};

module.exports = getAchievementRecords;
