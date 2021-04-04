const getUserRecordByEmailAddress = require('../../model/users/getUserRecordByEmailAddress');
const getGameScoreRecordsForUser = require('../../model/scores/getGameScoreRecordsForUser');

const getUserScoresByEmailAddress = async (req, res) => {
  const { emailAddress } = req.params;

  if (!emailAddress) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'emailAddress',
        in: 'route'
      }
    });
  }

  if (!emailAddress.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g)) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'emailAddress',
        expected: { type: 'email' },
        in: 'route'
      }
    });
  }

  try {
    const { userId } = await getUserRecordByEmailAddress(req.log, emailAddress);

    if (!userId) {
      throw { errorCode: 'ResourceNotFound', statusCode: 404 };
    }

    const scores = await getGameScoreRecordsForUser(req.log, userId);
    res.json(scores);
  } catch (error) {
    req.log.error({ emailAddress, error, source: 'users.getUserScoresByEmailAddress' }, 'Error getting user scores');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getUserScoresByEmailAddress;