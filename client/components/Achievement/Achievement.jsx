import TrophyImage from '~/assets/trophy.svg';

import classes from './Achievement.module.scss';

function Achievement ({
  achievementId,
  description,
  name
}) {
  return (
    <div className={classes.root} key={achievementId}>
      <div className={classes.graphic}>
        <TrophyImage />
      </div>
      <div className={classes.info}>
        <h1>Achievement Unlocked</h1>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Achievement;