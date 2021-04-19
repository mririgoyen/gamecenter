import { useEffect, useState } from 'react';
import cx from 'classnames';
import { useRecoilValue, useRecoilState } from 'recoil';
import { getParticipant } from 'extra-life';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';

import Avataaar from '../../../modules/avataaars';

import { userState } from '~/atoms/userState';
import { menuState } from '~/atoms/menuState';

import useInterval from '~/hooks/useInterval';

import GamecenterLogo from '~/assets/gamecenter.svg';
import ExtraLifeLogo from '~/assets/extra-life.svg';
import classes from './MenuPage.module.scss';

function MenuPage({
  children,
  className,
  for: menuFor,
  parentTitle,
  primaryAction,
  secondaryAction,
  showAvatar,
  title
}) {
  const user = useRecoilValue(userState);
  const [ menu, setMenu ] = useRecoilState(menuState);
  const [ extraLifeStatus, setExtraLifeStatus ] = useState({});
  const [ shouldUpdateTeamInfo, setShouldUpdateTeamInfo ] = useState(false);

  useEffect(() => {
    const getTeamInfo = async () => {
      try {
        const participant = await getParticipant(449349);
        participant.percentToGoal = (participant.sumDonations / participant.fundraisingGoal) * 100;
        setExtraLifeStatus(participant);
      } catch (error) {
        console.error(error);
      }
      setShouldUpdateTeamInfo(false);
    };
    getTeamInfo();
  }, [ shouldUpdateTeamInfo ]);

  useInterval(() => setShouldUpdateTeamInfo(true), 300000);

  return (
    <div className={cx(classes.root, className)}>
      <header>
        <h1>{parentTitle && <span>{parentTitle}</span>}{title}</h1>
        <div className={classes.logo}><GamecenterLogo /></div>
      </header>
      <div className={classes.container}>
        {children}
      </div>
      <div className={classes.actions}>
        {!!primaryAction ? (
          <button
            className={classes.primary}
            onClick={async () => {
              if (typeof primaryAction.action === 'function') {
                await primaryAction.action();
              }

              if (menu.returnTo) {
                return setMenu({ active: menu.returnTo.target, backgroundEnabled: true });
              }

              if (primaryAction.target) {
                return setMenu({ active: primaryAction.target, backgroundEnabled: true });
              }
            }}
          >
            {primaryAction.icon && <Icon path={primaryAction.icon} size={1} />}
            {primaryAction.title}
          </button>
        ) : (
          <div className={classes.primary}>
            <div className={cx(classes['extra-life'], {
              [classes.hidden]: !Object.keys(extraLifeStatus).length
            })}>
              <ExtraLifeLogo />
              <div className={classes.info}>
                <h1>{extraLifeStatus.displayName}</h1>
                <p>
                  <span>Raised ${Math.ceil(extraLifeStatus.sumDonations)}</span>
                  <span>Goal ${extraLifeStatus.fundraisingGoal}</span>
                </p>
                <div className={classes.status}>
                  <div style={{ width: `${extraLifeStatus.percentToGoal}%` }} />
                </div>
              </div>
              <div className={classes.donate}>
                <a href='https://www.extra-life.org/participant/goyney' rel='noreferrer' target='_blank'>Donate Now</a>
              </div>
            </div>
          </div>
        )}
        {!!secondaryAction &&
          <button
            className={classes.secondary}
            onClick={async () => {
              if (typeof secondaryAction.action === 'function') {
                await secondaryAction.action();
              }

              if (menu.returnTo) {
                return setMenu({ active: menu.returnTo.target, backgroundEnabled: true });
              }

              if (secondaryAction.target) {
                return setMenu({ active: secondaryAction.target, backgroundEnabled: true });
              }
            }}
          >
            <Icon path={secondaryAction.icon ? secondaryAction.icon : mdiArrowLeft} size={1} />
            Back
          </button>
        }
        {!!showAvatar && !secondaryAction && !!Object.keys(user.avatarConfig).length &&
          <div className={cx(classes.secondary, classes.avatar)}>
            <Avataaar avatarStyle='Circle' {...user.avatarConfig} />
            <div>
              <p>{user.displayName}</p>
              <a
                onClick={() => setMenu({
                  active: 'profile',
                  backgroundEnabled: true,
                  returnTo: {
                    name: title,
                    target: menuFor
                  }
                })}
              >
                View Profile
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MenuPage;
