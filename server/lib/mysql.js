const crypto = require('crypto');
const mysql = require('mysql');

const pools = {};

const connect = (options = {}) => {
  const params = {
    connectionLimit: options.connectionLimit || 5,
    database: options.database || process.env.GAMECENTER_DB_SCHEMA,
    host: options.host || process.env.GAMECENTER_DB_HOST,
    password: options.password || process.env.GAMECENTER_DB_PASSWORD,
    user: options.user || process.env.GAMECENTER_DB_USER
  };

  const key = crypto.createHash('md5').update(JSON.stringify(params)).digest('hex');

  if (!pools[key]) {
    pools[key] = mysql.createPool(params);
  }

  const db = pools[key];

  const query = (...args) => {
    return new Promise((resolve, reject) => {
      db.query.apply(db, [ ...args, (err, results, fields) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, results });
      }]);
    });
  };

  return { query };
};

module.exports = connect;
