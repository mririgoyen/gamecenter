const db = require('../../lib/mysql')();

const createGameScoreRecord = async (log, { game, score = 0, scoreId, status = 'playing', userId }) => {
  log.info({ game, score, scoreId, source: 'scores.createGameScoreRecord', status, userId }, 'Creating score record for game');
  const { results } = await db.query(`
    INSERT INTO scores (scoreId, userId, gameId, score, status)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      score = VALUES(score),
      status = VALUES(status)
  `,
  [ scoreId, userId, game, score, status ]);

  if (results.affectedRows > 2) {
    log.info({ affectedRows: results.affectedRows, source: 'scores.createGameScoreRecord' }, 'Unable to create score record');
    throw new Error('UnexpectedResult');
  }

  return results;
};

module.exports = createGameScoreRecord;
