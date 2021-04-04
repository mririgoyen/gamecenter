const db = require('../../lib/mysql')();

const getGameScoreRecords = async (log, gameId, limit = 5, startDateTime, endDateTime) => {
  log.info({ endDateTime, gameId, limit, source: 'scores.getGameScoreRecords', startDateTime }, 'Retrieving game score records');
  const { results } = await db.query(`
    SELECT s1.scoreId, s2.userId, s2.score, s1.lastModified, s1.status FROM scores s1
    JOIN (SELECT MAX(score) as score, userId FROM scores WHERE gameId = ? ${startDateTime ? `AND lastModified >= '${startDateTime}' ` : ''}${endDateTime ? `AND lastModified <= '${endDateTime}' ` : ''}GROUP BY userId) s2
    ON s1.score = s2.score AND s1.userId = s2.userId
    WHERE s1.gameId = ? AND s2.score > 0 ${startDateTime ? `AND s1.lastModified >= '${startDateTime}' ` : ''}${endDateTime ? `AND s1.lastModified <= '${endDateTime}' ` : ''}
    GROUP BY userId
    ORDER BY s2.score DESC, s1.lastModified ASC
    LIMIT ?
  `, [ gameId, gameId, Number(limit) ]);

  return results;
};

module.exports = getGameScoreRecords;
