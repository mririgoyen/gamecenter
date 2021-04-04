const CryptoJS = require('crypto-js');

const updateUserRecord = require('../../model/users/updateUserRecord');

const updateUser = async (req, res) => {
  const {
    auth,
    body
  } = req;

  if (!body) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        in: 'body'
      }
    });
  }

  let decryptedBody = CryptoJS.AES.decrypt(body, auth.key).toString(CryptoJS.enc.Utf8);

  try {
    decryptedBody = JSON.parse(decryptedBody);
  } catch (e) {
    decryptedBody = {};
  }

  if (
    !decryptedBody.emailAddress || !decryptedBody.emailAddress.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g) ||
    decryptedBody.emailAddress !== auth.userEmail ||
    !decryptedBody.avatarConfig || typeof decryptedBody.avatarConfig !== 'object' || (typeof decryptedBody.avatarConfig === 'object' && Array.isArray(decryptedBody.avatarConfig))
  ) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        in: 'body'
      }
    });
  }

  try {
    await updateUserRecord(req.log, decryptedBody.emailAddress, { avatarConfig: decryptedBody.avatarConfig });
    res.send(204);
  } catch (error) {
    req.log.error({ error, source: 'users.updateUser' }, 'Error updating user');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = updateUser;