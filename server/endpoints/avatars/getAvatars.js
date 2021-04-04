const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');

const Avatar = require('../../../modules/avataaars').default;

const getUserRecordByEmailAddress = require('../../model/users/getUserRecordByEmailAddress');

const getAvatars = async (req, res) => {
  const {
    params: {
      emailAddress
    },
    query: {
      format = 'svg'
    }
  } = req;

  if (!emailAddress) {
    return res.json(480, {
      errorCode: 'MissingInput',
      errorDetails: {
        at: 'emailAddress',
        in: 'route'
      }
    });
  }

  if (!['png', 'svg'].includes(format)) {
    return res.json(480, {
      errorCode: 'InvalidInput',
      errorDetails: {
        at: 'format',
        in: 'query'
      }
    });
  }

  try {
    const userInfo = await getUserRecordByEmailAddress(req.log, emailAddress);

    if (!userInfo) {
      throw {
        errorCode: 'NotFound',
        statusCode: 404
      };
    }

    try {
      const avatarConfig = JSON.parse(userInfo?.avatarConfig);

      if (!Object.keys(avatarConfig).length) {
        throw new Error('Avatar not configured');
      }

      const renderedAvatar = RDS.renderToStaticMarkup(React.createElement(Avatar, { avatarStyle: 'Circle', ...avatarConfig }));

      if (format === 'svg') {
        return res.send(200, renderedAvatar, {
          'Content-Disposition': `attachment; filename="${emailAddress.split('@')[0]}.svg"`,
          'Content-Type': 'image/svg+xml'
        });
      }

      try {
        const convertedPng = await sharp(Buffer.from(renderedAvatar)).png().toBuffer();
        return res.send(200, convertedPng, {
          'Content-Disposition': `attachment; filename="${emailAddress.split('@')[0]}.png"`,
          'Content-Type': 'image/png'
        });
      } catch (error) {
        req.log.error({ error, source: 'avatars.getAvatars' }, 'Unable to convert avatar to PNG');
        return res.json(580, { errorCode: 'ConversionError' });
      }
    } catch (error) {
      req.log.error({ error, source: 'avatars.getAvatars' }, 'Unable to generate avatar');
      return res.json(404, {
        errorCode: 'NotFound',
        errorDetails: 404
      });
    }
  } catch (error) {
    req.log.error({ error, source: 'avatars.getAvatars' }, 'Error retrieving avatar');
    return res.json(error.statusCode || 580, {
      errorCode: error.errorCode || 'InternalError',
      errorDetails: error.errorDetails || {}
    });
  }
};

module.exports = getAvatars;