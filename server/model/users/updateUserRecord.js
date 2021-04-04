const db = require('../../lib/mysql')();

const updateUserRecord = async (log, emailAddress, { avatarConfig }) => {
  log.info({ emailAddress, source: 'users.updateUserRecord' }, 'Updating user record');

  const { results } = await db.query(
    'UPDATE user SET avatarConfig = ? WHERE emailAddress = ?',
    [ JSON.stringify(avatarConfig), emailAddress ]
  );

  if (results.affectedRows !== 1) {
    log.info({ affectedRows: results.affectedRows, source: 'users.updateUserRecord' }, 'Unable to update user record');
    throw new Error('UnexpectedResult');
  }

  return results;
};

module.exports = updateUserRecord;
