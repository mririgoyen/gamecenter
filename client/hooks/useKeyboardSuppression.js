import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '~/atoms/userState';

const useKeyboardSuppression = () => {
  const user = useRecoilValue(userState);

  useEffect(() => {
    const allowedKeys = [13, 32, 37, 38, 39, 40, 65, 68, 83, 87];
    const suppressNonGameKeys = (e) => {
      if (!allowedKeys.includes(e.keyCode) && !user.isAdmin) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', suppressNonGameKeys);
    document.addEventListener('keyup', suppressNonGameKeys);
    document.addEventListener('keypress', suppressNonGameKeys);
    return () => {
      document.addEventListener('keydown', suppressNonGameKeys);
      document.addEventListener('keyup', suppressNonGameKeys);
      document.addEventListener('keypress', suppressNonGameKeys);
    };
  }, [ user ]);
};

export default useKeyboardSuppression;
