const db = require('../../lib/mysql')();

const getUserRecords = async (log) => {
  log.info({ source: 'users.getUserRecords' }, 'Retrieving user records');
  const { results } = await db.query('SELECT * FROM user');
  return results;
};

module.exports = getUserRecords;
