const getUserRecordByEmailAddress = require('../../model/users/getUserRecordByEmailAddress');

const getUserByEmailAddress = async (req, res) => {
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
    const user = await getUserRecordByEmailAddress(req.log, emailAddress);

    if (!user) {
      throw { errorCode: 'ResourceNotFound', statusCode: 404 };
    }

    res.json(user);
  } catch (error) {
    req.log.error({ emailAddress, error, source: 'users.getUserByEmailAddress' }, 'Error getting user');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getUserByEmailAddress;