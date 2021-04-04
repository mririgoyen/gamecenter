import { Fragment } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import cx from 'classnames';
import { useGoogleLogin } from 'react-use-googlelogin';
import Icon from '@mdi/react';
import { mdiGamepadVariant } from '@mdi/js';

import Avataaar from '../../../modules/avataaars';

import { userState } from '~/atoms/userState';
import { menuState } from '~/atoms/menuState';
import { achievementState } from '~/atoms/achievementState';
import { modalState } from '~/atoms/modalState';

import GamecenterLogo from '~/assets/gamecenter.svg';
import GoogleLogo from '~/assets/google.svg';

import classes from './Login.module.scss';

function Login({ className }) {
  const { signIn, signOut } = useGoogleLogin({ clientId: productConfig.googleClientId });
  const user = useRecoilValue(userState);
  const setMenu = useSetRecoilState(menuState);
  const awardAchievement = useSetRecoilState(achievementState);
  const openModal = useSetRecoilState(modalState);

  const firstTimeUser = !Object.keys(user.avatarConfig).length;

  return (
    <div className={cx(classes.root, className)}>
      <GamecenterLogo className={classes.logo} />
      <div className={classes.auth}>
        {user.isAuthenticated &&
          <Fragment>
            <div className={classes.welcome}>
              {!!Object.keys(user.avatarConfig).length && <Avataaar avatarStyle='Circle' {...user.avatarConfig} />}
              <p>Welcome{!firstTimeUser ? ' back' : ''}, {user.displayName}</p>
            </div>
            <button onClick={() => setMenu({ active: firstTimeUser ? 'avatar' : 'arcade', backgroundEnabled: true })}>{firstTimeUser ? 'Get Started' : 'Start Playing'}</button>
            <p className={classes.signout}>
              <span onClick={signOut}>Sign Out</span>
            </p>
          </Fragment>
        }
        {!user.isAuthenticated &&
          <Fragment>
            <button
              className={classes.signin}
              onClick={signIn}
            >
              <GoogleLogo />
              Sign in with Google
            </button>
          </Fragment>
        }
      </div>
      <div
        className={classes.build}
        onClick={(e) => {
          if (e.detail === 3) {
            openModal({
              contents: (
                <div className={classes.about}>
                  <Icon path={mdiGamepadVariant} size={4} />
                  <p>The GameCenter was created for the 2020 Extra Life Game Day by Michael Irigoyen.</p>
                  <h2>Special Thanks</h2>
                  <div className={classes.thanks}>
                    <p>Jack Berlin</p>
                    <p>Jamison Prianos</p>
                    <p>Jody Shumaker</p>
                    <p>Mark Hansen</p>
                    <p>Josh Gdovin</p>
                    <p>Kyla Kolb</p>
                    <p>The Accusoft Extra Life Team</p>
                    <p>The Event Ninjas</p>
                  </div>
                </div>
              ),
              title: 'GameCenter'
            });

            if (user.isAuthenticated) {
              awardAchievement('viewed_about');
            }
          }
        }}
      >
        {productConfig.version}
      </div>
    </div>
  );
};

export default Login;
