const db = require('../../lib/mysql')();

const getHungGameScoreRecords = async (log, ageInMinutes = 3) => {
  log.info({ source: 'scores.getHungGameScoreRecords' }, 'Searching for hung game scores');
  const { results } = await db.query(`
    SELECT scoreId, lastModified
    FROM scores
    WHERE status = 'playing' AND lastModified < DATE_SUB(NOW(), INTERVAL ? MINUTE)
  `, [ ageInMinutes ]);

  return results;
};

module.exports = getHungGameScoreRecords;
