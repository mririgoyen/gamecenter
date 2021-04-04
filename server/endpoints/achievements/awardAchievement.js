const CryptoJS = require('crypto-js');

const updateUserAchievementRecord = require('../../model/users/updateUserAchievementRecord');

const awardAchievement = async (req, res) => {
  const {
    auth, body
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
    !decryptedBody.achievementId || typeof decryptedBody.achievementId !== 'string'
  ) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        in: 'body'
      }
    });
  }

  try {
    await updateUserAchievementRecord(req.log, decryptedBody.emailAddress, decryptedBody.achievementId);
    res.send(204);
  } catch (error) {
    req.log.error({ error, source: 'achievements.awardAchievement' }, 'Error awarding achievement');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = awardAchievement;