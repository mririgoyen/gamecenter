const uuid = require('uuid');
const db = require('../../lib/mysql')();

const createUserRecord = async (log, { avatarConfig, displayName, emailAddress }) => {
  log.info({ emailAddress, source: 'users.createUserRecord' }, 'Creating user record');
  const userId = uuid.v4();
  const { results } = await db.query(
    'INSERT INTO user (userId, emailAddress, displayName, avatarConfig) VALUES (?, ?, ?, ?)',
    [ userId, emailAddress, displayName, JSON.stringify(avatarConfig) ]
  );

  if (results.affectedRows !== 1) {
    log.info({ affectedRows: results.affectedRows, source: 'users.createUserRecord' }, 'Unable to create user record');
    throw new Error('UnexpectedResult');
  }

  return userId;
};

module.exports = createUserRecord;
