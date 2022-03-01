const util = {
  wrapRange: function (value, lowBound, highBound) {
    while (value < lowBound) {
      value += highBound - lowBound;
    }
    while (value > highBound) {
      value -= highBound - lowBound;
    }
    return value;
  },

  randRange: function (min, max) {
    return min + Math.random() * (max - min);
  },

  randIntRange: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
