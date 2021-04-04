import { atom } from 'recoil';

const determineStartingPage = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('game')) {
    return 'arcade';
  }

  if (params.get('page')) {
    return params.get('page');
  }

  return 'login';
};

export const menuState = atom({
  key: 'menuState',
  default: {
    active: determineStartingPage(),
    backgroundEnabled: true
  }
});
