import { useRecoilValue } from 'recoil';
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

import { errorState } from '~/atoms/errorState';

import MenuBackground from '../MenuBackground/MenuBackground';

import GamecenterLogo from '~/assets/gamecenter.svg';

import classes from './ErrorFallback.module.scss';

function ErrorFallback() {
  const { errorCode } = useRecoilValue(errorState);

  return (
    <div className={classes.root}>
      <GamecenterLogo className={classes.logo} />
      <div className={classes.container}>
        <h1>A Fatal Error Has Occurred</h1>
        <p>Something unexpected happened that is preventing GameCenter from working as intended. Please refresh GameCenter and try again.</p>
        <div className={classes.action}>
          <button onClick={() => location.reload()}>
            <Icon path={mdiRefresh} size={1} />
            Refresh GameCenter
          </button>
        </div>
        <div className={classes.details}>
          CODE: {errorCode}
        </div>
      </div>
      <MenuBackground disableMusic />
    </div>
  );
};

export default ErrorFallback;
