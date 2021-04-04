const getAchievementRecord = require('../../model/achievements/getAchievementRecord');
const getUserRecordByEmailAddress = require('../../model/users/getUserRecordByEmailAddress');
const updateUserAchievementRecord = require('../../model/users/updateUserAchievementRecord');

const grantAchievement = async (req, res) => {
  const {
    body: {
      achievementId,
      users = []
    }
  } = req;

  if (!achievementId) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'achievementId',
        in: 'body'
      }
    });
  }

  if (typeof achievementId !== 'string') {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'achievementId',
        expected: { type: 'string' },
        in: 'body'
      }
    });
  }

  if (!Array.isArray(users)) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'users',
        expected: { type: 'array' },
        in: 'body'
      }
    });
  }

  if (!users.length) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'users',
        expected: {
          minLength: 1,
          type: 'array'
        },
        in: 'body'
      }
    });
  }

  users.forEach((emailAddress, i) => {
    if (!emailAddress.toString().match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g)) {
      return res.json(480, {
        errorCode: 'InvalidInput',
        errorDetails: {
          at: `users[${i}]`,
          expected: { type: 'email' },
          in: 'body'
        }
      });
    }
  });

  try {
    const achievementInfo = await getAchievementRecord(req.log, achievementId);
    if (!achievementInfo) {
      throw {
        errorCode: 'NotFound',
        errorDetails: {
          at: 'achievementId',
          in: 'body'
        },
        statusCode: 404
      };
    }

    if (!achievementInfo.obtainable) {
      throw {
        errorCode: 'NotAcceptable',
        errorDetails: {
          at: 'achievementId',
          in: 'body'
        },
        statusCode: 406
      };
    }

    const usersInfo = await Promise.all(users.map(async (emailAddress) => await getUserRecordByEmailAddress(req.log, emailAddress)));

    const invalidUsers = usersInfo.reduce((output, user, i) => {
      if (typeof user === 'undefined') {
        output.push(i);
      }
      return output;
    }, []);

    if (invalidUsers.length) {
      throw {
        errorCode: 'NotFound',
        errorDetails: {
          at: invalidUsers.map((p) => `users[${p}]`).join(', '),
          in: 'body'
        },
        statusCode: 406
      };
    }

    await Promise.all(
      usersInfo.map(async ({ achievements, emailAddress }) => {
        try {
          achievements = JSON.parse(achievements);
        } catch (error) {
          achievements = [];
        }

        if (achievements.find((a) => a.id === achievementId)) {
          return;
        }

        return await updateUserAchievementRecord(req.log, emailAddress, achievementId);
      })
    );

    res.send(204);
  } catch (error) {
    req.log.error({ error, source: 'achievements.grantAchievement' }, 'Error granting achievement');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = grantAchievement;