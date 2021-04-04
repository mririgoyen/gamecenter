const dayjs = require('dayjs');

const getGameScoreRecords = require('../../model/scores/getGameScoreRecords');
const addScoresMetadata = require('../../lib/addScoresMetadata');

const getGameScores = async (req, res) => {
  const { gameId } = req.params;
  const {
    endDateTime,
    limit = 5,
    startDateTime
  } = req.query;

  if (!gameId) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'gameId',
        in: 'route'
      }
    });
  }

  if (limit && isNaN(limit)) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'limit',
        expected: { type: 'integer' },
        in: 'query'
      }
    });
  }

  if (startDateTime && !dayjs(startDateTime).isValid()) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'startDateTime',
        expected: {
          format: 'YYYY-MM-DD HH:mm:ss',
          type: 'datetime'
        },
        in: 'query'
      }
    });
  }

  if (endDateTime && !dayjs(endDateTime).isValid()) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'endDateTime',
        expected: {
          format: 'YYYY-MM-DD HH:mm:ss',
          type: 'datetime'
        },
        in: 'query'
      }
    });
  }

  try {
    const scores = await getGameScoreRecords(req.log, gameId, limit, startDateTime, endDateTime);
    const output = await addScoresMetadata(req.log, scores);
    res.json(output);
  } catch (error) {
    req.log.error({ gameId, error, source: 'scores.getGameScores' }, 'Error getting game scores');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getGameScores;