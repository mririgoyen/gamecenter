import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import { errorState } from '~/atoms/errorState';
import { userState } from '~/atoms/userState';
import { menuState } from '~/atoms/menuState';

const useUserSession = async ({ googleUser, isInitialized, isSignedIn }) => {
  const [ user, setUser ] = useRecoilState(userState);
  const resetUser = useResetRecoilState(userState);
  const [ menu, setMenu ] = useRecoilState(menuState);
  const handleError = useSetRecoilState(errorState);

  useEffect(() => {
    const startUserSession = async () => {
      const userInfo = await getUserInformation(googleUser);
      setUser(userInfo);
    };

    if (!isInitialized) {
      return;
    }

    if (!isSignedIn) {
      setMenu({ ...menu, active: 'login' });
      return resetUser();
    }

    if (isSignedIn && !user?.isAuthenticated) {
      return startUserSession();
    }
  }, [ googleUser, isInitialized, isSignedIn ]);

  const getUserInformation = async ({ googleId, profileObj, tokenId }) => {
    const displayName = `${profileObj.givenName} ${profileObj.familyName.charAt(0)}.`;

    try {
      const userResponse = await fetch(`/api/v1/users/${profileObj.email}`);

      if (userResponse.status === 404) {
        const createResponse = await fetch('/api/v1/users', {
          body: JSON.stringify({
            avatarConfig: {},
            emailAddress: profileObj.email,
            displayName
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!createResponse.ok) {
          throw new Error('Unable to create new user');
        }

        const newUserInfo = await userResponse.json();

        return {
          achievements: [],
          avatarConfig: {},
          displayName,
          emailAddress: profileObj.email,
          id: newUserInfo.userId,
          isAdmin: false,
          isAuthenticated: true,
          key: googleId,
          token: tokenId
        };
      } else if (!userResponse.ok) {
        throw userResponse;
      }

      const userInfo = await userResponse.json();

      return {
        achievements: userInfo?.achievements ? JSON.parse(userInfo.achievements) : [],
        avatarConfig: userInfo?.avatarConfig ? JSON.parse(userInfo.avatarConfig) : {},
        displayName,
        emailAddress: profileObj.email,
        id: userInfo.userId,
        isAdmin: userInfo.admin === 1,
        isAuthenticated: true,
        key: googleId,
        token: tokenId
      };
    } catch (error) {
      console.error(error);
      handleError({ errorCode: 'ERR_USER_SESSION_INIT' });
    }
  };
};

export default useUserSession;