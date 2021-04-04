const db = require('../../lib/mysql')();

const getAchievementRecord = async (log, achievementId) => {
  log.info({ achievementId, source: 'achievements.getAchievementRecord' }, 'Retrieving achievement record');
  const { results } = await db.query('SELECT * FROM achievements WHERE achievementId = ?', [ achievementId ]);
  return results[0];
};

module.exports = getAchievementRecord;
