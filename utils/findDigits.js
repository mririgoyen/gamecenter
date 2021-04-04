/* eslint-disable no-unused-vars */

// Used to find specific digits in a MAME game's memory
let findDigits = (value, gap = 1) => {
  const heap = Module.HEAP8;
  const digits = value.toString().split('');
  const matching = heap.reduce((locs, v, i) => {
    for (let j = 0; j < digits.length; j++) {
      if (heap[i + (j * gap)] !== parseInt(digits[j])) {
        return locs;
      }
    }
    locs.push(i);
    return locs;
  }, []);
  return matching;
};
