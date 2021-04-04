import { useCallback, useEffect, useState } from 'react';

import useInterval from './useInterval';

const useHealthCheck = () => {
  const [ isHealthy, setIsHealthy ] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/health');
      setIsHealthy(response.ok);
    } catch (error) {
      setIsHealthy(false);
    }
  }, []);

  useEffect(checkHealth, []);
  useInterval(checkHealth, 30000);

  return isHealthy;
};

export default useHealthCheck;