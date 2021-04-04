const db = require('../../lib/mysql')();

const updateGameScoreStatusRecord = async (log, scoreId, lastModified) => {
  log.info({ scoreId, source: 'scores.updateGameScoreStatusRecord' }, 'Resolving hung score record');

  const { results } = await db.query(
    'UPDATE scores SET status = ?, lastModified = ? WHERE scoreId = ?',
    [ 'assumed', lastModified, scoreId ]
  );

  if (results.affectedRows !== 1) {
    log.info({ affectedRows: results.affectedRows, source: 'scores.updateGameScoreStatusRecord' }, 'Unable to resolve score record');
    throw new Error('UnexpectedResult');
  }

  return results;
};

module.exports = updateGameScoreStatusRecord;
