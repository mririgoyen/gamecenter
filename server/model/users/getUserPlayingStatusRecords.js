const db = require('../../lib/mysql')();

const getUserPlayingStatusRecords = async (log, userId, status = 'playing') => {
  log.info({ source: 'users.getUserPlayingStatusRecords', status, userId }, 'Retrieving user playing status');
  const { results } = await db.query('SELECT gameId FROM scores WHERE userId = ? AND status = ? GROUP BY gameId', [ userId, status ]);
  return results;
};

module.exports = getUserPlayingStatusRecords;
