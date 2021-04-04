const createUserRecord = require('../../model/users/createUserRecord');
const { notifyChannel } = require('../../lib/slack');

const createUser = async (req, res) => {
  const {
    avatarConfig = {},
    displayName,
    emailAddress
  } = req.body;

  if (!emailAddress) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'emailAddress',
        in: 'body'
      }
    });
  }

  if (!emailAddress.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g)) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'emailAddress',
        expected: { type: 'email' },
        in: 'body'
      }
    });
  }

  if (!displayName) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'displayName',
        in: 'body'
      }
    });
  }

  if (typeof displayName !== 'string') {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'displayName',
        expected: { type: 'string' },
        in: 'body'
      }
    });
  }

  if (!avatarConfig) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'avatarConfig',
        in: 'body'
      }
    });
  }

  if (typeof avatarConfig !== 'object' || (typeof avatarConfig === 'object' && Array.isArray(avatarConfig))) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'avatarConfig',
        expected: { type: 'object' },
        in: 'body'
      }
    });
  }

  try {
    await createUserRecord(req.log, { avatarConfig, displayName, emailAddress });
    res.send(204);

    notifyChannel(req.log, {
      attachments: [{
        color: '#2d8e19',
        text: `*Player:* ${displayName} (${emailAddress})`
      }],
      text: '*New Player Registered*'
    });
  } catch (error) {
    req.log.error({ error, source: 'users.createUser' }, 'Error creating user');
    res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });

    notifyChannel(req.log, {
      attachments: [{
        color: '#ff0000',
        text: `Unable to register player: ${displayName} (${emailAddress})`
      }],
      text: ':ohno: *New Player Registration Error*'
    });
  }
};

module.exports = createUser;