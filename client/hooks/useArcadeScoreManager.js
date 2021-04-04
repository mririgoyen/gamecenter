import { useEffect, useRef, useState } from 'react';

import useInterval from '~/hooks/useInterval';

const useArcadeScoreManager = () => {
  const socket = useRef();
  const [ connected, setConnected ] = useState(false);
  const [ scores, setScores ] = useState();

  const connect = () => {
    socket.current = new WebSocket(`ws${location.protocol === 'https:' ? 's' : ''}://${location.hostname}/`);

    socket.current.onopen = () => {
      setConnected(true);
    };

    socket.current.onmessage = ({ data }) => {
      try {
        const parsedScores = JSON.parse(data);
        setScores(parsedScores);
      } catch (error) {
      }
    };

    socket.current.onclose = () => {
      setConnected(false);
    };
  };

  useInterval(connect, !connected ? 5000 : null);
  useEffect(() => {
    if (!connected) {
      return connect();
    }
    return () => socket.current.close();
  }, [ connected ]);

  const sendScore = async (scorePacket) => {
    if (socket.current.readyState !== 1) {
      return console.error('Unable to send score, connection not available');
    }
    socket.current.send(JSON.stringify(scorePacket));
  };

  return [ scores, sendScore ];
};

export default useArcadeScoreManager;