import delay from './delay';

const findStartingOffset = async (value, estimated = 0, gap = 1) => {
  const findLocation = (value) => {
    const heap = Module.HEAPU8;
    const values = value.match(/[A-F0-9]{2}/g).map((e) => parseInt(e, 16));
    for (let i = 0; i < Math.max(estimated, Module.HEAPU8.length - estimated); i++) {
      if (estimated + i < Module.HEAPU8.length - values.length && !values.find((v, j) => values[j] !== heap[estimated + i + (j * gap)])) {
        return estimated + i;
      }
      if (estimated - i > 0 && !values.find((v, j) => values[j] !== heap[estimated - i + (j * gap)])) {
        return estimated - i;
      }
    }
  };
  let location = findLocation(value);
  while (!location) {
    await delay(500);
    location = findLocation(value);
  }
  return location;
};

export default findStartingOffset;