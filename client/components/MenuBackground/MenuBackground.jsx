import { useEffect, useRef } from 'react';
import Particles from 'react-particles-js';

import bgMusic from '~/assets/bgmusic.mp3';

import classes from './MenuBackground.module.scss';

function MenuBackground({ disableMusic }) {
  const bgMusicRef = useRef();

  useEffect(() => {
    if (bgMusicRef?.current) {
      bgMusicRef.current.volume = 0.5;
    }
  }, []);

  return (
    <div className={classes.root}>
      <Particles
        className={classes.particles}
        height='100vh'
        params={{
          particles: {
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: true,
                speed: .4,
                opacity_min: 0.1,
                sync: false
              }
            },
            number: {
              value: 30,
              density: {
                enable: false
              }
            },
            size: {
              value: 40,
              random: true,
              anim: {
                speed: .2,
                size_min: 3
              }
            },
            line_linked: {
              enable: false
            },
            move: {
              random: true,
              speed: .3,
              out_mode: 'out'
            }
          }
        }}
        width='100vw'
      />
      {!disableMusic && (
        <audio
          autoPlay
          loop
          ref={bgMusicRef}
          src={bgMusic}
        />
      )}
    </div>
  );
};

export default MenuBackground;
