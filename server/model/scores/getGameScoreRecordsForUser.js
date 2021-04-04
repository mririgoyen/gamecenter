const db = require('../../lib/mysql')();

const getGameScoreRecords = require('./getGameScoreRecords');

const getGameScoreRecordsForUser = async (log, userId) => {
  log.info({ userId, source: 'scores.getGameScoreRecordsForUser' }, 'Retrieving game score records for user');
  const { results = [] } = await db.query('SELECT gameId, MAX(score) AS highScore, MIN(score) AS lowScore, AVG(score) AS avgScore, COUNT(score) AS gamesPlayed FROM scores WHERE userId = ? AND score > 0 GROUP BY gameId', [ userId ]);
  return await results.reduce(async (prevPromise, result) => {
    const output = await prevPromise;
    const scores = await getGameScoreRecords(log, result.gameId, Number.MAX_SAFE_INTEGER) || [];
    const rank = scores.findIndex((s) => s.userId === userId) + 1;
    output[result.gameId] = { ...result, rank };
    delete output[result.gameId].gameId;
    return output;
  }, Promise.resolve({}));
};

module.exports = getGameScoreRecordsForUser;
