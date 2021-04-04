import { useEffect, useState } from 'react';
import cx from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import Icon from '@mdi/react';
import { mdiClose, mdiGamepadVariant, mdiPodium } from '@mdi/js';

import browserfs from '!!raw-loader!../../../node_modules/browserfs/dist/browserfs.min';
import emularity from '!!raw-loader!~/assets/emulators/emularity';

import { menuState } from '~/atoms/menuState';
import { gameLibrary } from '~/atoms/gameLibrary';

import useArcadeScoreManager from '~/hooks/useArcadeScoreManager';

import MenuPage from '../MenuPage/MenuPage';
import Game from './Game/Game';
import Scores from './Scores/Scores';

import classes from './Arcade.module.scss';

function Arcade({ className }) {
  const params = new URLSearchParams(window.location.search);
  const [ depsLoaded, setDepsLoaded ] = useState(false);
  const [ selectedGame, selectGame ] = useState(params.get('game') || '');
  const [ leaderboardsActive, setLeaderboardsActive ] = useState(false);
  const [ menu, setMenu ] = useRecoilState(menuState);
  const { arcade } = useRecoilValue(gameLibrary);
  const [ scores, sendScore ] = useArcadeScoreManager();

  useEffect(() => {
    const bfsScript = document.createElement('script');
    bfsScript.appendChild(document.createTextNode(browserfs));
    document.head.appendChild(bfsScript);

    const emuScript = document.createElement('script');
    emuScript.appendChild(document.createTextNode(emularity));
    document.head.appendChild(emuScript);

    setDepsLoaded(true);
  }, []);

  if (depsLoaded && selectedGame) {
    return (
      <div className={cx(classes.arcade, classes[`${selectedGame}-game`])}>
        <Game
          backToLobby={() => {
            setMenu({ ...menu, backgroundEnabled: true });
            selectGame();
          }}
          game={selectedGame}
          key={selectedGame}
          scores={{
            alltime: scores?.alltime?.[selectedGame],
            playing: scores?.playing?.[selectedGame],
            today: scores?.today?.[selectedGame]
          }}
          sendScore={sendScore}
        />
      </div>
    );
  }

  return (
    <MenuPage
      className={className}
      for='arcade'
      parentTitle='Lobby'
      showAvatar
      title='Arcade'
    >
      <div className={classes.root}>
        <div className={classes.heading}>
          <h2>
            <Icon path={mdiGamepadVariant} size={1} />
            Select a Game
          </h2>
          <button
            className={cx({
              [classes.hide]: leaderboardsActive
            })}
            onClick={() => {
              setLeaderboardsActive(!leaderboardsActive);
            }}
          >
            <Icon path={leaderboardsActive ? mdiClose : mdiPodium} size={1} />
            {leaderboardsActive ? 'Hide' : ''} Leaderboards
          </button>
        </div>
        <div
          className={cx(classes.games, {
            [classes['leaderboards-active']]: leaderboardsActive
          })}
        >
          {arcade.map((game) => (
            <div
              className={cx(classes.game, classes[game.id], {
                [classes.disabled]: !!game.disabled
              })}
              key={game.id}
              onClick={() => {
                if (leaderboardsActive || !!game.disabled) {
                  return;
                }

                setMenu({ ...menu, backgroundEnabled: false });
                selectGame(game.id);
              }}
            >
              <img alt={game.name} src={game.logo} />
              <div className={classes.front} />
              <div className={classes.back}>
                <div className={classes.overflow}>
                  <Scores
                    alltime={scores?.alltime?.[game.id]}
                    playing={scores?.playing?.[game.id]}
                    today={scores?.today?.[game.id]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MenuPage>
  );
};

export default Arcade;
