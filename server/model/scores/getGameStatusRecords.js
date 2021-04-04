const db = require('../../lib/mysql')();

const getGameStatusRecords = async (log, gameId, status) => {
  log.info({ gameId, source: 'scores.getGameStatusRecords', status }, 'Retrieving game status records');
  const { results } = await db.query(`
    SELECT COUNT(*) AS count FROM scores WHERE gameId = ? AND status = ?
  `, [ gameId, status ]);

  return results[0].count;
};

module.exports = getGameStatusRecords;
