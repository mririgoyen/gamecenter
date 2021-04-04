import { Fragment } from 'react';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiMenuLeft, mdiPlay } from '@mdi/js';

import classes from './Actions.module.scss';

function Actions({
  accentColor = 'grey',
  backToLobby,
  coinInserted,
  gameOver,
  gameSessionId,
  getCurrentCredits,
  loading,
  setCoinInserted,
  setGameSessionId
}) {
  const insertCoin = () => {
    setCoinInserted(true);
    dispatchEvent(new KeyboardEvent('keydown', { keyCode: 53 }));
    setTimeout(() => {
      dispatchEvent(new KeyboardEvent('keyup', { keyCode: 53 }));
      const reportedCredits = getCurrentCredits();
      if (reportedCredits === 0) {
        setCoinInserted(false);
      }
    }, 500);
  };

  const startGame = () => {
    setCoinInserted(false);
    setGameSessionId(uuidv4());
    dispatchEvent(new KeyboardEvent('keydown', { keyCode: 49 }));
    setTimeout(() => {
      dispatchEvent(new KeyboardEvent('keyup', { keyCode: 49 }));
      const reportedCredits = getCurrentCredits();
      if (reportedCredits === 1) {
        setCoinInserted(true);
        setGameSessionId();
      }
    }, 500);
  };

  const coinDisabled = loading || coinInserted || !!gameSessionId;
  const playDisabled = loading || !!gameSessionId || (!gameSessionId && !coinInserted);

  return (
    <div className={classes.root} style={{ borderColor: accentColor }}>
      <button
        className={classes.back}
        disabled={loading || (gameOver && !!gameSessionId)}
        onClick={backToLobby}
      >
        <Icon path={mdiArrowLeft} size={1} />
        Back to Lobby
      </button>
      <div className={classes.buttons}>
        <button
          className={classes.coin}
          disabled={coinDisabled}
          onClick={insertCoin}
        >
          <div>
            <Icon path={mdiStar} size={1} />
          </div>
        </button>
        <button
          className={cx(classes.start, {
            [classes.attention]: !coinDisabled
          })}
          disabled={playDisabled}
          onClick={startGame}
        >
          {playDisabled ? (
            <Fragment>
              <Icon path={mdiMenuLeft} size={1} /> Insert Coin
            </Fragment>
          ) : (
            <Fragment>
              <Icon path={mdiPlay} size={1} /> Start Game
            </Fragment>
          )}
        </button>
      </div>
    </div>
  );
}

export default Actions;