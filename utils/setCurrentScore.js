/* eslint-disable no-unused-vars */

// Donkey Kong score setting
let setCurrentScore = (score) => {
  let str = `000000${score.toString()}`.substr(-6);
  for (let j = 0; j < 6; j++) {
    const i = 30267105 + (32 * j);
    Module.HEAP8[i] = parseInt(str.substr(5 - j, 1));
  }
};