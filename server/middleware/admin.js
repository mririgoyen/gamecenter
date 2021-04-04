const admin = (req, res, next) => {
  const { 'x-admin-key': providedKey } = req.headers;

  if (providedKey !== process.env.ADMIN_API_KEY) {
    req.log.error({ source: 'middleware.admin' }, 'Error verifying admin key');
    return res.json(401, {
      errorCode: 'Unauthorized'
    });
  }

  next();
};

module.exports = admin;