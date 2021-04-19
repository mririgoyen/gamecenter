import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CSSTransition } from 'react-transition-group';
import { useGoogleLogin } from 'react-use-googlelogin';
import Icon from '@mdi/react';
import { mdiLanCheck, mdiLanDisconnect } from '@mdi/js';

import { errorState } from '~/atoms/errorState';
import { userState } from '~/atoms/userState';
import { menuState } from '~/atoms/menuState';
import { modalState } from '~/atoms/modalState';

import useHealthCheck from '~/hooks/useHealthCheck';
import useUserSessions from '~/hooks/useUserSessions';
import useAchievementManager from '~/hooks/useAchievementManager';
import useInterval from '~/hooks/useInterval';

import ErrorFallback from '../ErrorFallback/ErrorFallback';
import Achievement from '../Achievement/Achievement';
import MenuBackground from '../MenuBackground/MenuBackground';
import Modal from '../Modal/Modal';

import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import Avatar from '../Avatar/Avatar';
import Arcade from '../Arcade/Arcade';

import classes from './App.module.scss';

const menuScreens = {
  arcade: Arcade,
  avatar: Avatar,
  login: Login,
  profile: Profile
};

function App() {
  const googleLogin = useGoogleLogin({ clientId: productConfig.googleClientId });
  const { isInitialized } = googleLogin;
  const menu = useRecoilValue(menuState);
  const user = useRecoilValue(userState);
  const [ modal, setModal ] = useRecoilState(modalState);
  const [ achievementDetails, setAchievementToShow ] = useState();
  const fatalError = useRecoilValue(errorState);

  const health = useHealthCheck();
  useUserSessions(googleLogin);
  useAchievementManager(setAchievementToShow);

  useEffect(() => {
    if (!health && !modal) {
      const isInArcade = window?.Module && typeof window?.Module?.pauseMainLoop === 'function';
      if (isInArcade) {
        window.Module.pauseMainLoop();
      }

      setModal({
        contents: (
          <div className={classes.modal}>
            <Icon path={mdiLanDisconnect} size={4} />
            <p>Your connection to the GameCenter server was lost.</p>
            <p>Please check your internet connection.</p>
            {isInArcade && <p className={classes.paused}>Your game has been paused.<br/>You will be able to resume play once you reestablish your connection.</p>}
          </div>
        ),
        hideActions: true,
        title: 'Server Connection Lost'
      });
    }
    if (health && modal.title === 'Server Connection Lost') {
      const isInArcade = window?.Module && typeof window?.Module?.resumeMainLoop === 'function';
      setModal({
        callback: () => {
          if (isInArcade) {
            window.Module.resumeMainLoop();
          }
        },
        contents: (
          <div className={classes.modal}>
            <Icon path={mdiLanCheck} size={4} />
            <p>Your connection to the GameCenter server was restored.</p>
            {isInArcade && <p className={classes.ready}>When you close this dialog, your game will unpause. Be ready!</p>}
          </div>
        ),
        title: 'Server Connection Restored'
      });
    }
  }, [ health, modal ]);

  useInterval(() => {
    setAchievementToShow();
  }, !!achievementDetails ? 7500 : null);

  const pages = Object.keys(menuScreens).map((screen) => {
    const Screen = menuScreens[screen];
    return (
      <CSSTransition
        classNames={{
          appear: classes['appear'],
          appearActive: classes['appear-active'],
          appearDone: classes['appear-done'],
          enter: classes['appear'],
          enterActive: classes['appear-active'],
          enterDone: classes['appear-done'],
          exit: classes['exit'],
          exitActive: classes['exit-active'],
          exitDone: classes['exit-done']
        }}
        in={isInitialized && menu.active === screen && (menu.active === 'login' || user.isAuthenticated)}
        key={screen}
        mountOnEnter
        timeout={1000}
        unmountOnExit
      >
        <Screen />
      </CSSTransition>
    );
  });

  if (fatalError) {
    return <ErrorFallback />;
  }

  return (
    <div className={classes.root}>
      {!!achievementDetails && <Achievement {...achievementDetails} />}
      <div className={classes.container}>
        {pages}
      </div>
      {menu.backgroundEnabled && <MenuBackground />}
      {!!modal &&
        <Modal
          hideActions={modal.hideActions}
          onClose={() => {
            if (typeof modal.callback === 'function') {
              modal.callback();
            }
            setModal(false);
          }}
          title={modal.title}
        >
          {modal.contents}
        </Modal>
      }
    </div>
  );
};

export default App;
