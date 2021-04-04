const getUserRecordByUserId = require('../model/users/getUserRecordByUserId');

const addScoresMetadata = async (log, scores) => {
  const uniqueUsers = scores.reduce((output, score) => {
    if (!output.includes(score.userId)) {
      output.push(score.userId);
    }
    return output;
  }, []);

  const users = await Promise.all(uniqueUsers.map(async (userId) => await getUserRecordByUserId(log, userId)));
  return scores.map((score) => {
    const { avatarConfig, displayName, emailAddress } = users.find((user) => user?.userId === score.userId) || {};
    score = { ...score, avatarConfig, displayName, emailAddress };
    return score;
  });
};

module.exports = addScoresMetadata;