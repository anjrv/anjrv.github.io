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

  square: function (x) {
    return x * x;
  },

  distSq: function (x1, y1, z1, x2, y2, z2) {
    return this.square(x2 - x1) + this.square(y2 - y1) + this.square(z2 - z1);
  },
};
