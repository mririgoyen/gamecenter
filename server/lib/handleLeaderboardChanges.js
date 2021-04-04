const { WebClient } = require('@slack/web-api');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

const slack = new WebClient(process.env.SLACK_TOKEN);

const getUserPlayingStatusRecords = require('../model/users/getUserPlayingStatusRecords');

const typeToNotifyOn = dayjs().format('YYYY-MM-DD') === process.env.EXTRA_LIFE_GAME_DAY ? 'today' : 'alltime';

const rankLeaderboard = (leaderboard) => {
  const ranked = leaderboard.map((score, i) => {
    if (i === 0) {
      score.rank = 1;
    } else if (leaderboard[i - 1].score === score.score) {
      // Score is tied with previous, assume same rank
      score.rank = leaderboard[i - 1].rank;
    } else {
      score.rank = i + 1;
    }
    return score;
  });
  return ranked.filter((r) => r.rank < 4);
};

const determinePlayersToNotify = async (log, previousLeaderboard, nextLeaderboard) => {
  const allPlayersToNotify = await Object.keys(previousLeaderboard[typeToNotifyOn]).reduce(async (prevPromise, gameId) => {
    let output = await prevPromise;

    const prevBoard = rankLeaderboard(previousLeaderboard[typeToNotifyOn][gameId]);
    const nextBoard = rankLeaderboard(nextLeaderboard[typeToNotifyOn][gameId]);

    const playersToNotify = await prevBoard.reduce(async (prevPromise, prevPosition) => {
      const players = await prevPromise;

      // Find them in the new leaderboard
      const newPosition = nextBoard.find((n) => n.userId === prevPosition.userId);
      if (
        !newPosition || // Player is no longer on the leaderboard
        newPosition.rank > prevPosition.rank // Player's rank has decreased
      ) {
        if (!prevPosition.emailAddress) {
          log.warn({ source: 'handleLeaderboardChanges.playersToNotify', userId: prevPosition.userId }, 'Player missing email address; Unable to send leaderboard change notification');
          return players;
        }

        // If this user is actively playing this game right now, don't send the notification
        const userIsPlaying = await getUserPlayingStatusRecords(log, prevPosition.userId);
        if (!!userIsPlaying.find((u) => u.gameId === gameId)) {
          return players;
        }

        const replacedBy = nextBoard.find((r) => r.rank === prevPosition.rank);
        players.push({
          emailAddress: prevPosition.emailAddress,
          gameId,
          previousRank: prevPosition.rank,
          previousScore: prevPosition.score,
          replacedBy: replacedBy?.emailAddress,
          replacedByDisplayName: replacedBy?.displayName
        });
        return players;
      }
      return players;
    }, Promise.resolve([]));

    output = [ ...output, ...playersToNotify ];
    return output;
  }, Promise.resolve([]));

  return allPlayersToNotify;
};

const getSlackUserIds = async (log, playersToNotify) => {
  const uniqueEmails = playersToNotify.reduce((output, record) => {
    if (record.emailAddress && !output.includes(record.emailAddress)) {
      output.push(record.emailAddress);
    }
    if (record.replacedBy && !output.includes(record.replacedBy)) {
      output.push(record.replacedBy);
    }
    return output;
  }, []);


  const emailSlackUserIdMap = await uniqueEmails.reduce(async (prevPromise, email) => {
    const output = await prevPromise;

    try {
      const { user: { id: userId } } = await slack.users.lookupByEmail({ email });
      output[email] = userId;
    } catch (error) {
      log.warn({ email, source: 'handleLeaderboardChanges.emailSlackUserIdMap' }, 'Could not get a Slack user ID for player');
    }

    return output;
  }, Promise.resolve({}));

  return emailSlackUserIdMap;
};

const handleLeaderboardChanges = async (log, previousLeaderboard, nextLeaderboard) => {
  if (process.env.GAME_ENV !== 'production') {
    return;
  }

  const playersToNotify = await determinePlayersToNotify(log, previousLeaderboard, nextLeaderboard);
  const emailToSlackUserId = await getSlackUserIds(log, playersToNotify);

  const gameNames = {
    dkong: 'Donkey Kong',
    galaga: 'Galaga',
    pacman: 'PAC-MAN'
  };

  await playersToNotify.map(async (player) => {
    if (!emailToSlackUserId[player.emailAddress]) {
      return;
    }

    const replacedBy = emailToSlackUserId[player.replacedBy] ? `<@${emailToSlackUserId[player.replacedBy]}>` : player.replacedByDisplayName || 'Unknown';
    const rankOrdinal = player.previousRank === 1 ? 'st' : player.previousRank === 2 ? 'nd' : 'rd';

    const message = `:${player.gameId}: ${replacedBy} has beaten your *${gameNames[player.gameId]}* score of *${player.previousScore}* and knocked you out of ${player.previousRank}${rankOrdinal} place!\n`;

    const currentLeaderboard = nextLeaderboard[typeToNotifyOn][player.gameId].filter((r) => r.rank < 4).reduce((output, record) => {
      const playerName = emailToSlackUserId[record.emailAddress] ? `<@${emailToSlackUserId[record.emailAddress]}>` : record.displayName || 'Unknown';
      output.push({ type: 'mrkdwn', text: `#${record.rank} ${playerName}${record.status === 'playing' ? ' :gamepad:' : ''}` });
      output.push({ type: 'plain_text', text: record.score.toString() });
      return output;
    }, [{ type: 'mrkdwn', text: '*Current Leaderboard*' }, { type: 'plain_text', text: ' ' }]);

    return await slack.chat.postMessage({
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: 'You have been ousted!' }
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: message }
        },
        {
          type: 'divider'
        },
        {
          type: 'section',
          fields: currentLeaderboard
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: ':gamepad: _Indicates user is playing right now_' }
        },
        {
          type: 'divider'
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: ':gamecenter: Go to the GameCenter'
              },
              url: 'https://gamecenter.kapps.jpg.com/'
            }
          ]
        }
      ],
      channel: emailToSlackUserId[player.emailAddress],
      text: `*You have been ousted!*\n${message}`
    });
  });
};

module.exports = handleLeaderboardChanges;
