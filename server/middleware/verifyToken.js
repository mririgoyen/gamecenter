const { auth } = require('google-auth-library');

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const client = auth.fromAPIKey(process.env.GOOGLE_OAUTH_API_KEY);

  try {
    const { payload } = await client.verifyIdToken({ idToken: authorization.split(' ')[1] });
    req.auth = {
      key: payload.sub,
      userEmail: payload.email
    };
    next();
  } catch (error) {
    req.log.error({ error, source: 'middleware.verifyToken' }, 'Error verifying user token');
    res.json(403, {
      errorCode: 'Forbidden'
    });
  }
};

module.exports = verifyToken;