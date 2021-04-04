const db = require('../../lib/mysql')();

const getUserRecordByEmailAddress = async (log, emailAddress) => {
  log.info({ emailAddress, source: 'users.getUserRecordByEmailAddress' }, 'Retrieving user record');
  const { results } = await db.query('SELECT * FROM user WHERE emailAddress = ?', [ emailAddress ]);
  return results[0];
};

module.exports = getUserRecordByEmailAddress;
