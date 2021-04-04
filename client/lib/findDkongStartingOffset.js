import delay from './delay';

const findDkongStartingOffset = async () => {
  const findInitialCandidates = () => {
    try {
      const digits = '007300';
      const heap = Module.HEAP8;
      const matching = heap.slice(28000000, 32000000).reduce((locs, v, i) => {
        for (let j = 0; j < digits.length; j++) {
          if (heap[i + 28000000 + (j * 32)] !== parseInt(digits[j])) {
            return locs;
          }
        }
        locs.push(i + 28000000);
        return locs;
      }, []);
      return matching;
    } catch (err) {
      return [];
    }
  };
  let candidates = findInitialCandidates();
  while (candidates.length === 0) {
    await delay(500);
    candidates = findInitialCandidates();
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  let confirmed = null;
  while (confirmed === null) {
    const heap = Module.HEAP8;
    candidates.forEach((l) => {
      let value = '';
      for (let j = 0; j < 6; j++) {
        value = `${heap[l + (32 * j)]}${value}`;
      }
      if (value === '000000') {
        confirmed = l;
      }
    });
    await delay(500);
  }
  return confirmed;
};

export default findDkongStartingOffset;