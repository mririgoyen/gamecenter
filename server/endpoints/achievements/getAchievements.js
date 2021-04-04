const getAchievementRecords = require('../../model/achievements/getAchievementRecords');

const getAchievements = async (req, res) => {
  try {
    const users = await getAchievementRecords(req.log);
    res.json(users);
  } catch (error) {
    req.log.error({ error, source: 'achievements.getAchievements' }, 'Error getting achievements list');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getAchievements;