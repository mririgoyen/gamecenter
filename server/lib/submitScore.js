const CryptoJS = require('crypto-js');
const { auth } = require('google-auth-library');

const getUserRecordByEmailAddress = require('../model/users/getUserRecordByEmailAddress');
const createGameScoreRecord = require('../model/scores/createGameScoreRecord');
const { notifyChannel } = require('./slack');

const submitScore = async (log, { authorization, packet, status = 'playing' }) => {
  try {
    const client = auth.fromAPIKey(process.env.GOOGLE_OAUTH_API_KEY);
    const { payload } = await client.verifyIdToken({ idToken: authorization });
    let decryptedPacket = CryptoJS.AES.decrypt(packet, payload.sub).toString(CryptoJS.enc.Utf8);

    try {
      decryptedPacket = JSON.parse(decryptedPacket);
    } catch (e) {
      decryptedPacket = {};
    }

    const { emailAddress, game, score, scoreId } = decryptedPacket;

    if (
      !emailAddress || !emailAddress.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g) || emailAddress !== payload.email ||
      !game || typeof game !== 'string' ||
      Number(score) === NaN || !Number.isInteger((score)) ||
      !scoreId
    ) {
      throw { emailAddress, game, message: 'Invalid request body', score, scoreId };
    }

    const userInfo = await getUserRecordByEmailAddress(log, emailAddress);
    if (!userInfo) {
      throw { emailAddress, game, message: 'Invalid user', score, scoreId };
    }

    await createGameScoreRecord(log, { userId: userInfo.userId, game, score, scoreId, status });

    if (status === 'final') {
      notifyChannel(log, {
        attachments: [{
          color: game === 'pacman' ? '#f3cb00' : game === 'galaga' ? '#0402f1' : '#ed2153',
          text: `*Game:* ${game === 'pacman' ? 'PAC-MAN' : game === 'galaga' ? 'Galaga' : 'Donkey Kong'}\n*Player:* ${userInfo.displayName} (${userInfo.emailAddress})\n*Score:* ${score}`
        }],
        text: `:${game}: *New Score*`
      });
    }
  } catch (error) {
    log.error({ error, source: 'lib.submitScore' }, 'Unable to submit score');

    if (typeof error === 'object' && Object.keys(error).length) {
      notifyChannel(log, {
        attachments: [{
          color: '#ff0000',
          text: `Unable to register new score:\n*Game:* ${error.game === 'pacman' ? 'PAC-MAN' : error.game === 'galaga' ? 'Galaga' : 'Donkey Kong'}\n*Player:* ${error.emailAddress}\n*Score:* ${error.score}`
        }],
        text: ':ohno: *New Score Error*'
      });
    }
  }
};

module.exports = submitScore;