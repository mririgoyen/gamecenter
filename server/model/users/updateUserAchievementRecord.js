const db = require('../../lib/mysql')();

const getUserRecordByEmailAddress = require('./getUserRecordByEmailAddress');

const updateUserAchievementRecord = async (log, emailAddress, achievementId) => {
  log.info({ achievementId, emailAddress, source: 'users.updateUserAchievementRecord' }, 'Updating user achievement record');

  const { achievements } = await getUserRecordByEmailAddress(log, emailAddress);

  let currentAchievements;

  try {
    currentAchievements = JSON.parse(achievements) || [];
  } catch (e) {
    currentAchievements = [];
  }

  const userHas = Object.keys(currentAchievements).find((a) => currentAchievements[a].id === achievementId);
  if (userHas) {
    return;
  }

  currentAchievements.push({
    id: achievementId,
    on: Date.now()
  });

  const { results } = await db.query(
    'UPDATE user SET achievements = ? WHERE emailAddress = ?',
    [ JSON.stringify(currentAchievements), emailAddress ]
  );

  if (results.affectedRows !== 1) {
    log.info({ affectedRows: results.affectedRows, source: 'users.updateUserAchievementRecord' }, 'Unable to update user record');
    throw new Error('UnexpectedResult');
  }

  return results;
};

module.exports = updateUserAchievementRecord;
