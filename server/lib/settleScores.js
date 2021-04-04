const getHungGameScoreRecords = require('../model/scores/getHungGameScoreRecords');
const updateGameScoreStatusRecord = require('../model/scores/updateGameScoreStatusRecord');

module.exports = async (log) =>{
  const settleScores = async () => {
    try {
      const hungScores = await getHungGameScoreRecords(log) || [];
      if (!hungScores.length) {
        return;
      }

      const recordsToResolve = hungScores.map(async ({ lastModified, scoreId }) => await updateGameScoreStatusRecord(log, scoreId, lastModified));
      await Promise.all(recordsToResolve);
      log.info({ affectedRecordCount: hungScores.length, source: 'lib.settleScores' }, 'Settled hung scores');
    } catch (error) {
      log.error({ error, source: 'lib.settleScores' }, 'Unable to settle hung scores');
    }
  };

  setInterval(async () => {
    await settleScores();
  }, 60000);
};