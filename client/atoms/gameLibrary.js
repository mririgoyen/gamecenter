import { atom } from 'recoil';

import delay from '~/lib/delay';
import findStartingOffset from '~/lib/findStartingOffset';
import findDkongStartingOffset from '~/lib/findDkongStartingOffset';

import pacmanLogo from '~/assets/arcade/pacman-logo.png';
import galagaLogo from '~/assets/arcade/galaga-logo.png';
import dkongLogo from '~/assets/arcade/dkong-logo.png';

import pacmanBack from '~/assets/arcade/pacman-back.png';
import galagaBack from '~/assets/arcade/galaga-back.png';
import dkongBack from '~/assets/arcade/dkong-back.png';

export const gameLibrary = atom({
  key: 'gameLibrary',
  default: {
    arcade: [
      {
        accentColor: 'yellow',
        bgImage: pacmanBack,
        gameOverDelay: 1000,
        getMemoryOffsets: async () => {
          await delay(5000);
          const baseOffset = await findStartingOffset('505531', 0x13E0000); // Find 0x43D8 ('1UP')
          const offsets = {
            creditOffset: baseOffset + (0x4E6E - 0x43D8), // 0x4E6E
            gameOverOffset: baseOffset + (0x4172 - 0x43D8), // 0x4172
            gameOverSequence: [ 82, 69, 86, 79, 64, 64, 69, 77, 65, 71 ],
            scoreOffset: baseOffset + (0x43F7 - 0x43D8) // 0x43F7
          };
          return offsets;
        },
        id: 'pacman',
        loadingText: 'Picking the fruit...',
        logo: pacmanLogo,
        name: 'PAC-MAN'
      },
      {
        accentColor: 'blue',
        bgImage: galagaBack,
        gameOverDelay: 11000,
        getMemoryOffsets: async () => {
          await delay(15000);
          const baseOffset = await findStartingOffset('0E1B180C1C2411101211', 0x31C5000); // Find 0x83CB ('HIGH SCORE')
          const offsets = {
            creditOffset: baseOffset + (0x8035 - 0x83CB), // 0x8035
            gameOverOffset: baseOffset + (0x8170 - 0x83CB), // 0x8170
            gameOverSequence: [ 27, 14, 31, 24, 36, 14, 22, 10, 16 ],
            playingOffset: baseOffset + (0x9012 - 0x83CB), // 0x9012
            scoreOffset: baseOffset + (0x83F8 - 0x83CB) // 0x83F8
          };
          return offsets;
        },
        id: 'galaga',
        loadingText: 'Fueling the ships...',
        logo: galagaLogo,
        name: 'Galaga'
      },
      {
        accentColor: 'red',
        bgImage: dkongBack,
        gameOverDelay: 4000,
        getMemoryOffsets: async () => {
          await delay(1000);
          const baseOffset = await findDkongStartingOffset(); // Find 0x76E1 (Initial '003700' score)
          const offsets = {
            creditOffset: baseOffset + (0x749F - 0x76E1), // 0x749F
            gameOverOffset: baseOffset + (0x7576 - 0x76E1), // 0x7576
            gameOverSequence: [ 34, 21, 38, 31, 16, 16, 21, 29, 17, 23 ],
            playingOffset: baseOffset + (0x6005 - 0x76E1), // 0x6005
            scoreOffset: baseOffset
          };
          return offsets;
        },
        id: 'dkong',
        loadingText: 'Stacking the barrels...',
        logo: dkongLogo,
        name: 'Donkey Kong'
      }
    ]
  }
});
