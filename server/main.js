const restify = require('restify');
const bunyan = require('bunyan');
const httpProxy = require('http-proxy');

const ws = require('./ws');
const settleScores = require('./lib/settleScores');

const adminMiddleware = require('./middleware/admin');
const verifyTokenMiddleware = require('./middleware/verifyToken');

const getAchievements = require('./endpoints/achievements/getAchievements');
const awardAchievement = require('./endpoints/achievements/awardAchievement');
const grantAchievement = require('./endpoints/achievements/grantAchievement');
const getAvatars = require('./endpoints/avatars/getAvatars');
const getGameScores = require('./endpoints/scores/getGameScores');
const getUsers = require('./endpoints/users/getUsers');
const getUserByEmailAddress = require('./endpoints/users/getUserByEmailAddress');
const createUser = require('./endpoints/users/createUser');
const updateUser = require('./endpoints/users/updateUser');
const getUserScoresByEmailAddress = require('./endpoints/users/getUserScoresByEmailAddress');

const logger = bunyan.createLogger({ name: 'gamecenter' });
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use((req, _, next) => {
  req.log = logger;
  next();
});

// Health Check
server.get('/api/v1/health', (_, res) => res.json({ status: 'OK' }));

// Achievement Endpoints
server.get('/api/v1/achievements', getAchievements);
server.post('/api/v1/achievements', [ verifyTokenMiddleware ], awardAchievement);
server.post('/api/v1/achievements/grant', [ adminMiddleware ], grantAchievement);

// Avatar Endpoints
server.get('/api/v1/avatars/:emailAddress', getAvatars);

// Scores Endpoints
server.get('/api/v1/scores/:gameId', getGameScores);

// User Endpoints
server.get('/api/v1/users', getUsers);
server.post('/api/v1/users', createUser);
server.put('/api/v1/users/:emailAddress', [ verifyTokenMiddleware ], updateUser);
server.get('/api/v1/users/:emailAddress', getUserByEmailAddress);
server.get('/api/v1/users/:emailAddress/scores', getUserScoresByEmailAddress);

// Client UI
server.get('*', (req, res, next) => {
  if (process.env.GAME_ENV === 'development') {
    const proxy = httpProxy.createProxyServer();
    proxy.web(req, res, { target: 'http://gamecenter-webpack:3000' }, () => {
      req.log.error({ source: 'main' }, 'Unable to communicate with the webpack-dev-server');
      res.json(503, { errorCode: 'ServiceUnavailable', statusCode: 503 });
    });
  } else {
    if (['/', '/index.html'].includes(req.url)) {
      res.header('Expires', new Date(0));
      res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
      restify.plugins.serveStatic({
        directory: '/var/www',
        file: 'index.html',
        maxAge: 0,
        gzip: true
      })(req, res, next);
    } else {
      restify.plugins.serveStatic({
        directory: '/var/www',
        gzip: true
      })(req, res, next);
    }
  }
});

server.listen(1100, () => {
  logger.info({ port: 1100, source: 'server.main' }, 'GameCenter server started');
});

ws(server.server, logger);
settleScores(logger);

process.on('SIGINT', () => {
  server.close();
  process.exit(1);
});

