import { useEffect, useRef } from 'react';

const useInterval = (callback, delay, initialTick = false) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      if (initialTick) {
        tick();
      }
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [ delay, initialTick ]);
};

export default useInterval;
