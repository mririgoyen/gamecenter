const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const getGameScoreRecords = require('../model/scores/getGameScoreRecords');
const getGameStatusRecords = require('../model/scores/getGameStatusRecords');
const addScoresMetadata = require('./addScoresMetadata');

const GAMES = [ 'dkong', 'galaga', 'pacman' ];
const logMock = { info: () => {} };

const getLeaderboards = async () => {
  const todayStart = dayjs.tz(dayjs().tz('America/New_York').startOf('day'), 'UTC').format('YYYY-MM-DD HH:mm:ss');
  const todayEnd = dayjs.tz(dayjs().tz('America/New_York').endOf('day'), 'UTC').format('YYYY-MM-DD HH:mm:ss');

  return await GAMES.reduce(async (prevPromise, game) => {
    const output = await prevPromise;

    const alltime = await getGameScoreRecords(logMock, game);
    output.alltime[game] = await addScoresMetadata(logMock, alltime);

    const today = await getGameScoreRecords(logMock, game, 5, todayStart, todayEnd);
    output.today[game] = await addScoresMetadata(logMock, today);

    const playing = await getGameStatusRecords(logMock, game, 'playing');
    output.playing[game] = playing;

    return output;
  }, Promise.resolve({ alltime: {}, today: {}, playing: {} }));
};

module.exports = getLeaderboards;
