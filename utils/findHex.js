/* eslint-disable no-unused-vars */

// Finds a set of hex values in memory
let findHex = (value) => {
  const heap = Module.HEAPU8;
  const values = value.match(/[A-F0-9]{2}/g).map((e) => parseInt(e, 16));
  const matching = heap.reduce((loc, v, i) => {
    if (loc) {
      return loc;
    }
    for (let j = 0; j < values.length; j++) {
      if (heap[i + j] !== values[j]) {
        return loc;
      }
    }
    return i;
  }, null);
  return matching;
};