import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    achievements: [],
    avatarConfig: {},
    displayName: undefined,
    emailAddress: undefined,
    forbidden: false,
    isAdmin: false,
    isAuthenticated: false,
    key: undefined,
    token: undefined
  }
});
