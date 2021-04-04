const db = require('../../lib/mysql')();

const getUserRecordByUserId = async (log, userId) => {
  log.info({ userId, source: 'users.getUserRecordByUserId' }, 'Retrieving user record');
  const { results } = await db.query('SELECT * FROM user WHERE userId = ?', [ userId ]);
  return results[0];
};

module.exports = getUserRecordByUserId;
