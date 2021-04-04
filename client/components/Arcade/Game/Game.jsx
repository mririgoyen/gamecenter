import { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

import useWindowSize from '~/hooks/useWindowSize';
import useKeyboardSuppression from '~/hooks/useKeyboardSuppression';
import useInterval from '~/hooks/useInterval';

import { userState } from '~/atoms/userState';
import { gameLibrary } from '~/atoms/gameLibrary';
import { achievementState } from '~/atoms/achievementState';

import Actions from '../Actions/Actions';
import Scores from '../Scores/Scores';
import Controls from '../Controls/Controls';

import Loader from '~/assets/arcade/loader.svg';

import classes from './Game.module.scss';

function Game({ backToLobby, game, scores, sendScore }) {
  const emulatorRef = useRef();
  const ratioRef = useRef();
  const screenRef = useRef();
  const gameRef = useRef();
  const memoryRef = useRef();
  const windowSize = useWindowSize();
  const user = useRecoilValue(userState);
  const [ initialized, setInitialized ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ coinInserted, setCoinInserted ] = useState(false);
  const [ gameOver, setGameOver ] = useState(true);
  const [ gameSessionId, setGameSessionId ] = useState();
  const [ liveScore, setLiveScore ] = useState(0);
  const { arcade } = useRecoilValue(gameLibrary);
  const awardAchievement = useSetRecoilState(achievementState);

  const thisGame = arcade.find((a) => a.id === game);

  useKeyboardSuppression();

  useEffect(() => {
    emulatorRef.current = new Emulator(gameRef.current, null, new MAMELoader(
      MAMELoader.driver(thisGame.id),
      MAMELoader.extraArgs([ '-ctrlrpath', 'emulator', '-ctrlr', thisGame.id ]),
      MAMELoader.emulatorJS('assets/emulators/mame.js'),
      MAMELoader.mountFile(`${thisGame.id}.zip`, MAMELoader.fetchFile('Game File', `assets/roms/${thisGame.id}.zip`)),
      MAMELoader.mountFile(`${thisGame.id}.cfg`, MAMELoader.fetchFile('Config File', 'assets/emulators/mame.cfg'))
    ));
    emulatorRef.current.start();
    emulatorRef.current.setCallbacks(async () => {
      setInitialized(true);
      memoryRef.current = await thisGame.getMemoryOffsets();
      setLoading(false);
    });
    return () => {
      void emulatorRef.current;
      void memoryRef.current; // eslint-disable-line react-hooks/exhaustive-deps
    };
  }, [ arcade, getCurrentScore, thisGame ]);

  useEffect(() => {
    const ratio = 7 / 9;
    const width = Math.min(ratioRef.current.offsetWidth, ratioRef.current.offsetHeight * ratio) - 20;
    const height = Math.min(ratioRef.current.offsetHeight, ratioRef.current.offsetWidth / ratio) - 20;

    if (ratioRef.current.offsetWidth < 545) {
      screenRef.current.style.width = `${width}px`;
      screenRef.current.style.height = `${width / ratio}px`;
    } else {
      screenRef.current.style.width = `${height * ratio}px`;
      screenRef.current.style.height = `${height}px`;
    }
  }, [ windowSize ]);

  useInterval(async () => {
    if (checkForGameOver()) {
      setGameOver(true);

      const score = getCurrentScore();
      await submitScore(score, gameSessionId, 'final');

      const isGameDay = dayjs().format('YYYY-MM-DD') === productConfig.extraLifeGameDay;
      if (isGameDay) {
        awardAchievement(`extralife_${dayjs().format('YYYY')}`);
      }
      return;
    }

    const score = getCurrentScore();
    setLiveScore(score);
  }, !gameOver ? 100 : null);

  useInterval(async () => {
    const score = getCurrentScore();
    await submitScore(score, gameSessionId);
  }, !gameOver ? 5000 : null);

  useInterval(() => {
    if (game === 'dkong') {
      // Set to "1" when not playing, "2" when "1UP" is staged to start playing, "3" when "1UP" actively playing
      if (Module.HEAP8[memoryRef.current.playingOffset] === 1) {
        return setGameSessionId();
      }
      return;
    }

    if (game === 'galaga') {
      // Set to "0", when not playing, "1" when "1UP" actively playing
      if (Module.HEAP8[memoryRef.current.playingOffset] === 0) {
        return setGameSessionId();
      }
      return;
    }

    setGameSessionId();
  }, gameOver && gameSessionId ? 100 : null);

  const startGame = (sessionId) => {
    setGameSessionId(sessionId);
    setGameOver(false);
  };

  const checkForGameOver = () => {
    return memoryRef.current.gameOverSequence.reduce((r, v, i) => {
      return r && Module.HEAP8[memoryRef.current.gameOverOffset + (32 * i)] === v;
    }, true);
  };

  const getCurrentCredits = useCallback(() => {
    const heap = Module.HEAP8;
    let credits = '';

    if (game === 'pacman') {
      credits = heap[memoryRef.current.creditOffset].toString(16);
    }

    if (game === 'galaga') {
      for (let i = memoryRef.current.creditOffset; heap[i] !== 36; i--) {
        credits = `${credits}${heap[i]}`;
      }
    }

    if (game === 'dkong') {
      for (let j = 0; j < 2; j++) {
        const i = memoryRef.current.creditOffset + (32 * j);
        credits = `${heap[i]}${credits}`;
      }
    }

    return parseInt(credits) || 0;
  }, [ game ]);

  const getCurrentScore = useCallback(() => {
    const heap = Module.HEAP8;
    let score = '';

    if (game === 'pacman') {
      for (let i = memoryRef.current.scoreOffset; heap[i] !== 0x40; i++) {
        score = `${heap[i]}${score}`;
      }
    }

    if (game === 'galaga') {
      for (let i = memoryRef.current.scoreOffset; heap[i] !== 0x24; i++) {
        score = `${heap[i]}${score}`;
      }
    }

    if (game === 'dkong') {
      for (let j = 0; j < 6; j++) {
        const i = memoryRef.current.scoreOffset + (32 * j);
        score = `${heap[i]}${score}`;
      }
    }

    return parseInt(score) || 0;
  }, [ game ]);

  const submitScore = async (score, scoreId, status) => {
    await sendScore({
      authorization: user.token,
      packet: CryptoJS.AES.encrypt(JSON.stringify({
        emailAddress: user.emailAddress,
        game,
        scoreId,
        score
      }), user.key).toString(),
      status
    });
  };

  const returnToLobby = () => {
    const existingScript = document.getElementById('emulator-script');
    if (existingScript) {
      existingScript.remove();
    }

    try {
      // This hack causes the main process loop of the MAME
      // emulator to freeze and throw an error, effectively
      // killing the emulation so we can switch to another game.
      Module.abort();
    } catch (e) {
      JSEvents.removeAllHandlersOnTarget(document);
      JSEvents.removeAllHandlersOnTarget(gameRef.current);
      Module = null;
      JSEvents = null;
    }

    backToLobby();
  };

  return (
    <div
      className={cx(classes.root, {
        [classes.wait]: loading
      })}
      style={{ backgroundImage: `url(${thisGame.bgImage})` }}
    >
      <div className={classes.arcade}>
        <div className={classes.ratio} ref={ratioRef}>
          <div className={classes.screen} ref={screenRef}>
            {loading && (
              <div className={cx(classes.loading, {
                [classes.initialized]: initialized
              })}>
                <div>
                  <Loader />
                  <p>{!initialized ? 'Please Stand By...' : thisGame.loadingText || 'Game is Starting...'}</p>
                </div>
              </div>
            )}
            <canvas id='canvas' ref={gameRef} />
          </div>
        </div>
        <Actions
          accentColor={thisGame.accentColor}
          backToLobby={returnToLobby}
          coinInserted={coinInserted}
          gameOver={!gameOver}
          gameSessionId={gameSessionId}
          getCurrentCredits={getCurrentCredits}
          loading={loading}
          setCoinInserted={setCoinInserted}
          setGameSessionId={startGame}
        />
      </div>
      <div className={classes.panel}>
        <Scores
          {...scores}
          gameId={game}
          gameSessionId={gameSessionId}
          liveScore={liveScore}
        />
        <Controls game={game} />
      </div>
    </div>
  );
};

export default Game;
