import { Fragment, useEffect, useState } from 'react';
import cx from 'classnames';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { Tooltip } from 'react-tippy';
import Icon from '@mdi/react';
import { mdiPencil, mdiDownload } from '@mdi/js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

import Avataaar from '../../../modules/avataaars';

import { userState } from '~/atoms/userState';
import { achievementDictionary } from '~/atoms/achievementDictionary';
import { menuState } from '~/atoms/menuState';
import { modalState } from '~/atoms/modalState';

import useInterval from '~/hooks/useInterval';

import MenuPage from '../MenuPage/MenuPage';

import PulseLoader from '~/assets/pulse-loader.svg';
import defaultAchievementImage from '~/assets/achievements/_default.png';
import pacmanLogo from '~/assets/arcade/pacman-logo.png';
import galagaLogo from '~/assets/arcade/galaga-logo.png';
import dkongLogo from '~/assets/arcade/dkong-logo.png';

import classes from './Profile.module.scss';

function Profile({ className }) {
  const user = useRecoilValue(userState);
  const dictionary = useRecoilValue(achievementDictionary);
  const [ menu, setMenu ] = useRecoilState(menuState);
  const [ scores, setScores ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const openModal = useSetRecoilState(modalState);

  useEffect(() => {
    const getScores = async () => {
      try {
        const response = await fetch(`/api/v1/users/${user.emailAddress}/scores`);

        if (!response.ok) {
          throw response;
        }

        const results = await response.json();
        setScores(results);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getScores();
  }, [ loading, user ]);

  useInterval(() => setLoading(true), 60000);

  const renderGames = () => {
    const games = {
      pacman: {
        image: pacmanLogo,
        name: 'PAC-MAN'
      },
      galaga: {
        image: galagaLogo,
        name: 'Galaga'
      },
      dkong: {
        image: dkongLogo,
        name: 'Donkey Kong'
      }
    };

    const initialLoad = loading && !Object.keys(scores).length;

    return Object.keys(games).map((game) => (
      <div
        className={cx(classes.game, classes[game], {
          [classes.first]: scores?.[game]?.rank === 1,
          [classes.second]: scores?.[game]?.rank === 2,
          [classes.third]: scores?.[game]?.rank === 3,
          [classes['not-played']]: !scores?.[game]?.gamesPlayed
        })}
        key={game}
        onClick={() => {
          if (scores?.[game]?.gamesPlayed) {
            showGameModal({ ...games[game], ...scores?.[game] });
          }
        }}
      >
        <img alt={games[game].name} src={games[game].image} />
        <div className={cx({[classes.loading]: initialLoad })}>
          {initialLoad ? (
            <PulseLoader />
          ) : (
            <Fragment>
              <p className={classes.rank}>{scores?.[game]?.rank ? `#${scores?.[game]?.rank}` : ''}</p>
              <p>{scores?.[game]?.highScore || 'Not Played'}</p>
            </Fragment>
          )}
        </div>
      </div>
    ));
  };

  const renderAchievements = () => {
    return dictionary.reduce((output, d) => {
      const userHas = user.achievements.find((a) => a.id === d.achievementId);

      if (d.hidden && !userHas) {
        return output;
      }

      const achievementStillSecret = !userHas && !!d.secret;
      const achievementTitle = !achievementStillSecret ? d.name : 'Secret Achievement';
      const achievementDesc = !achievementStillSecret ? d.description : 'Keep playing and exploring to find this achievement!';
      const achievementImage = !achievementStillSecret ? d.image : defaultAchievementImage;

      output.push(
        <Tooltip
          key={d.achievementId}
          position='top'
          title={achievementTitle || 'Unknown Achievement'}
          unmountHTMLWhenHide
        >
          <div
            className={cx(classes.achievement, {
              [classes.obtained]: userHas,
              [classes.secret]: !userHas && !!d.secret
            })}
            onClick={() => showAchievementModal({
              description: achievementDesc || 'There is an air of mystery around this achievement.',
              image: achievementImage || defaultAchievementImage,
              locked: !userHas,
              on: userHas?.on,
              rewards: d.rewards,
              title: achievementTitle || 'Unknown Achievement'
            })}
            style={{
              backgroundImage: `url(${achievementImage || defaultAchievementImage})`
            }}
          />
        </Tooltip>
      );
      return output;
    }, []);
  };

  const downloadAvatar = async () => {
    try {
      const response = await fetch(`/api/v1/avatars/${user.emailAddress}?format=png`);
      if (!response.ok) {
        throw response;
      }

      const blob = await response.blob();
      const a = document.createElement('a');
      a.style.display = 'none';
      a.setAttribute('download', `${user.emailAddress.split('@')[0]}.png`);
      a.href = window.URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
    }
  };

  const showAchievementModal = (achievementInfo) => {
    openModal({
      contents: (
        <div className={classes['chievo-modal']}>
          <img
            alt={achievementInfo.title}
            className={cx({
              [classes.locked]: achievementInfo.locked
            })}
            src={achievementInfo.image}
          />
          <div>
            <p>{achievementInfo.description}</p>
            <p className={classes['obtained-at']}>{!achievementInfo.locked ? `Obtained ${dayjs(achievementInfo.on).format('MMMM DD, YYYY')}` : 'Locked'}</p>
            {achievementInfo.rewards && <p className={classes.reward}><strong>Reward:</strong> {achievementInfo.rewards}</p>}
          </div>
        </div>
      ),
      title: achievementInfo.title
    });
  };

  const showGameModal = (gameInfo) => {
    openModal({
      contents: (
        <div className={classes['game-modal']}>
          <img alt={gameInfo.name} src={gameInfo.image} />
          {!gameInfo.gamesPlayed ? (
            <p>Not Played</p>
          ) : (
            <table>
              <tbody>
                <tr>
                  <td>Overall Rank</td>
                  <td>#{gameInfo.rank}</td>
                </tr>
                <tr>
                  <td>Highest Score</td>
                  <td>{gameInfo.highScore}</td>
                </tr>
                <tr>
                  <td>Lowest Score</td>
                  <td>{gameInfo.lowScore}</td>
                </tr>
                <tr>
                  <td>Average Score</td>
                  <td>{Math.round(gameInfo.avgScore)}</td>
                </tr>
                <tr>
                  <td>Games Played</td>
                  <td>{gameInfo.gamesPlayed}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )
    });
  };

  return (
    <MenuPage
      className={className}
      secondaryAction={{
        action: () => setMenu({ ...menu, active: 'arcade' })
      }}
      title='Profile'
    >
      <div className={classes.root}>
        <div className={classes.user}>
          <Avataaar avatarStyle='Circle' {...user.avatarConfig} />
          <h1>{user.displayName}</h1>
          <button
            onClick={() => {
              setMenu({
                ...menu,
                active: 'avatar',
                returnTo: {
                  target: 'profile'
                }
              });
            }}
          >
            <Icon path={mdiPencil} size={1} />
            Edit Avatar
          </button>
          <button
            className={classes.download}
            onClick={downloadAvatar}
          >
            <Icon path={mdiDownload} size={1} />
            Download Avatar
          </button>
        </div>
        <div className={classes.info}>
          <div className={classes.scores}>
            <h2>Your Scores</h2>
            <div className={classes.games}>
              {renderGames()}
            </div>
          </div>
          <div className={classes.achievements}>
            <h2>Achievements</h2>
            <div className={classes.chievos}>
              {renderAchievements()}
            </div>
          </div>
        </div>
      </div>
    </MenuPage>
  );
}

export default Profile;