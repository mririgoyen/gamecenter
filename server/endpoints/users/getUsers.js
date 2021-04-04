const getUserRecords = require('../../model/users/getUserRecords');

const getUsers = async (req, res) => {
  try {
    const users = await getUserRecords(req.log);
    res.json(users);
  } catch (error) {
    req.log.error({ error, source: 'users.getUsers' }, 'Error getting user list');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getUsers;