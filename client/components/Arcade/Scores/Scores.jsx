import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import cx from 'classnames';
import FlipMove from 'react-flip-move';
import Icon from '@mdi/react';
import { mdiGamepadVariant, mdiMenuSwap, mdiTrophy } from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

import Avataaar from '../../../../modules/avataaars';

import { userState } from '~/atoms/userState';
import { achievementState } from '~/atoms/achievementState';

import usePrevious from '~/hooks/usePrevious';

import PulseLoader from '~/assets/pulse-loader.svg';

import classes from './Scores.module.scss';

function Scores({
  gameId,
  gameSessionId,
  liveScore,
  ...leaderboards
}) {
  const isGameDay = dayjs().format('YYYY-MM-DD') === productConfig.extraLifeGameDay;
  const [ type, setType ] = useState(isGameDay ? 'today' : 'alltime');
  const [ currentBoard, setCurrentBoard ] = useState();
  const user = useRecoilValue(userState);
  const prevGameSessionId = usePrevious(gameSessionId);
  const prevLiveScore = usePrevious(liveScore);
  const awardAchievement = useSetRecoilState(achievementState);

  const thisBoard = leaderboards[type];

  useEffect(() => {
    const leaderboard = (thisBoard || []).map((tb) => ({ ...tb }));

    if (gameSessionId && liveScore) {
      const userOnLeaderboard = leaderboard.findIndex((s) => s.userId === user.id);
      if (userOnLeaderboard > -1) {
        // User is already on the leaderboard
        if (leaderboard[userOnLeaderboard].score >= liveScore) {
          // Their score is not better than their top score, noop
        } else {
          // Replace their previous top score with the live one
          leaderboard[userOnLeaderboard].scoreId = gameSessionId;
          leaderboard[userOnLeaderboard].score = liveScore;
          leaderboard[userOnLeaderboard].status = 'playing';
        }
      } else {
        // User is not already on the leaderboard
        const scoreObject = {
          avatarConfig: JSON.stringify(user.avatarConfig),
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          score: liveScore,
          scoreId: gameSessionId,
          status: 'playing',
          userId: user.id
        };

        // Less than 5 records or equal to last record, so just add it to the array
        if (leaderboard.length < 5 || leaderboard[leaderboard.length - 1].score === liveScore) {
          leaderboard.push(scoreObject);
        } else if (leaderboard[leaderboard.length - 1].score < liveScore) {
          leaderboard[leaderboard.length - 1] = scoreObject;
        }
      }

      // Sort the standings
      leaderboard.sort((a, b) => a.score < b.score ? 1 : -1);
    }

    // If a game just ended, use the last live score on the leaderboard
    // until the websocket tick catches up
    if (prevLiveScore && (prevGameSessionId && !gameSessionId)) {
      const userOnLeaderboard = leaderboard.findIndex((s) => s.userId === user.id);
      if (userOnLeaderboard > -1) {
        leaderboard[userOnLeaderboard].status = 'final';
        if (prevLiveScore > leaderboard[userOnLeaderboard].score) {
          leaderboard[userOnLeaderboard].scoreId = prevGameSessionId;
          leaderboard[userOnLeaderboard].score = prevLiveScore;
        }
      }
    }

    const rankedBoard = leaderboard.map((score, i) => {
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

    setCurrentBoard(rankedBoard);
  }, [ gameSessionId, liveScore, thisBoard ]);

  useEffect(() => {
    // Only fire when a game is set and a game has ended
    if (gameId && (prevGameSessionId && !gameSessionId)) {
      const inTopThree = currentBoard.reduce((output, score) => {
        if (score.rank < 4 && score.emailAddress === user.emailAddress) {
          return true;
        }
        return output;
      }, false);

      if (inTopThree) {
        awardAchievement(`${gameId}_top3`);
      }
    }
  }, [ gameId, gameSessionId ]);

  const renderAvatar = ({ avatarConfig, displayName }) => {
    let userAvatar;

    try {
      userAvatar = JSON.parse(avatarConfig);
    } catch (e) {}

    if (userAvatar) {
      return <p className={classes.avatar}><Avataaar avatarStyle='Circle' {...userAvatar} /></p>;
    }

    return <p className={classes.initials}><span>{displayName ? displayName.charAt(0) : '?'}</span></p>;
  };

  const renderScores = () => {
    if (!currentBoard) {
      return (
        <div className={classes.loading}>
          <PulseLoader />
          <p>Retrieving Leaderboard...</p>
        </div>
      );
    }

    if (!Object.keys(currentBoard).length) {
      return (
        <div className={classes.loading}>
          <Icon path={mdiTrophy} size={2} />
          <p>No scores yet. Get playing!</p>
        </div>
      );
    }

    const scoreCards = currentBoard.map((score) => {
      return (
        <div
          className={cx(classes.card, {
            [classes.first]: score.rank === 1,
            [classes.second]: score.rank === 2,
            [classes.third]: score.rank === 3,
            [classes.other]: score.rank > 3,
            [classes['your-best']]: score.scoreId === gameSessionId
          })}
          key={score.scoreId}
          title={dayjs(score.lastModified).format('MMMM DD, YYYY')}
        >
          <p className={classes.position}>#{score.rank}</p>
          {score.rank < 4 ? renderAvatar(score) : null}
          <div className={classes.player}>{score.displayName || 'Unknown'}</div>
          <p
            className={cx(classes.playing, {
              [classes.visible]: score.status === 'playing' && score.userId !== user.id
            })}
          >
            <Icon path={mdiGamepadVariant} size={.8} title='Currently Playing' />
          </p>
          <p>{score.scoreId === gameSessionId ? liveScore : score.score}</p>
        </div>
      );
    });
    return <FlipMove>{scoreCards}</FlipMove>;
  };

  const players = leaderboards.playing || 0;

  return (
    <div className={classes.root}>
      <h2>
        Leaderboard
        <span
          onClick={() => {
            setType(type === 'alltime' ? 'today' : 'alltime');
          }}
        >
          {type === 'alltime' ? 'All Time' : 'Today'}
          <Icon path={mdiMenuSwap} size={.8} />
        </span>
      </h2>
      {renderScores()}
      <div className={cx(classes.players, {
        [classes.visible]: !!players
      })}>
        <Icon path={mdiGamepadVariant} size={.8} /> {players} {players === 1 ? 'person' : 'people'} currently playing
      </div>
    </div>
  );
}

export default Scores;