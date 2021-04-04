const WebSocket = require('ws');

const getLeaderboards = require('./lib/getLeaderboards');
const submitScore = require('./lib/submitScore');
const handleLeaderboardChanges = require('./lib/handleLeaderboardChanges');

let currentLeaderboards;

const websockets = async (server, log) => {
  const wss = new WebSocket.Server({ server });

  const broadcast = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Get leaderboards on server start and broadcast them
  currentLeaderboards = await getLeaderboards();
  broadcast(JSON.stringify(currentLeaderboards));

  // Update and broadcast leaderboards every 10 seconds
  setInterval(async () => {
    const newLeaderboards = await getLeaderboards();
    handleLeaderboardChanges(log, currentLeaderboards, newLeaderboards);
    currentLeaderboards = newLeaderboards;
    broadcast(JSON.stringify(currentLeaderboards));
  }, 10000);

  wss.on('connection', async (ws) => {
    log.info({ source: 'ws.websockets' }, 'WebSocket connection opened');

    // On a new WS connection, send the current leaderboards immediately
    ws.send(JSON.stringify(currentLeaderboards));

    ws.on('message', async (message) => {
      try {
        const { authorization, packet, status } = JSON.parse(message);
        await submitScore(log, { authorization, packet, status });
      } catch (error) {
        log.error({ source: 'ws.websockets' }, 'Unable to submit score');
      }
    });

    ws.on('close', () => {
      log.info({ source: 'ws.websockets' }, 'WebSocket connection closed');
    });
  });
};

module.exports = websockets;