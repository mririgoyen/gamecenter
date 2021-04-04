import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import CryptoJS from 'crypto-js';

import { errorState } from '~/atoms/errorState';
import { userState } from '~/atoms/userState';
import { achievementDictionary } from '~/atoms/achievementDictionary';
import { achievementState } from '~/atoms/achievementState';

import defaultImage from '~/assets/achievements/_default.png';
import createdAvatarImage from '~/assets/achievements/created_avatar.png';
import dkongTop3Image from '~/assets/achievements/dkong_top3.png';
import dkongWinnerImage from '~/assets/achievements/dkong_tournament_winner.png';
import extralife2020Image from '~/assets/achievements/extralife_2020.png';
import extralife2020TeamImage from '~/assets/achievements/extralife_2020_team.png';
import galagaTop3Image from '~/assets/achievements/galaga_top3.png';
import galagaWinnerImage from '~/assets/achievements/galaga_tournament_winner.png';
import pacmanTop3Image from '~/assets/achievements/pacman_top3.png';
import pacmanWinnerImage from '~/assets/achievements/pacman_tournament_winner.png';
import viewedAboutImage from '~/assets/achievements/viewed_about.png';

const images = {
  _default: defaultImage,
  created_avatar: createdAvatarImage,
  dkong_top3: dkongTop3Image,
  dkong_tournament_winner: dkongWinnerImage,
  extralife_2020: extralife2020Image,
  extralife_2020_team: extralife2020TeamImage,
  galaga_top3: galagaTop3Image,
  galaga_tournament_winner: galagaWinnerImage,
  pacman_top3: pacmanTop3Image,
  pacman_tournament_winner: pacmanWinnerImage,
  viewed_about: viewedAboutImage
};

const useAchievementManager = async (setAchievementToShow) => {
  const [ user, setUser ] = useRecoilState(userState);
  const [ achievement, setAchievementToAward ] = useRecoilState(achievementState);
  const [ dictionary, setDictionary ] = useRecoilState(achievementDictionary);
  const handleError = useSetRecoilState(errorState);

  useEffect(() => {
    const getDictionary = async () => {
      const response = await fetch('/api/v1/achievements');

      if (!response.ok) {
        console.error('Unable to load achievement system');
        handleError({ errorCode: 'ERR_ACHIEVEMENT_INIT' });
        return;
      }

      const results = await response.json();

      const dictionary = results.map((r) => {
        r.image = images[r.achievementId || '_default'];
        return r;
      });

      setDictionary(dictionary);
    };
    getDictionary();
  }, [ setDictionary ]);

  useEffect(() => {
    const awardAchievement = async (achievementId) => {
      const response = await fetch('/api/v1/achievements', {
        body: CryptoJS.AES.encrypt(JSON.stringify({
          achievementId,
          emailAddress: user.emailAddress
        }), user.key).toString(),
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        method: 'POST'
      });

      setAchievementToAward();

      if (!response.ok) {
        console.error('Unable to award achievement', achievementId);
        return;
      }

      setAchievementToShow(dictionary.find((d) => d.achievementId === achievementId && d.obtainable === 1));
      setUser({ ...user, achievements: [...user.achievements, { id: achievementId, on: Date.now() }] });
    };

    if (!dictionary.length || !user || !achievement) {
      return;
    }

    const userHas = Object.keys(user.achievements).find((a) => user.achievements[a].id === achievement);
    if (!userHas) {
      awardAchievement(achievement);
    }
  }, [ achievement, dictionary, setAchievementToAward, setAchievementToShow, setUser, user ]);
};

export default useAchievementManager;
