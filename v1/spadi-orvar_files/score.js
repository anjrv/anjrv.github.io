const scoreSize = 40;
const scoreColors = [
  vec4(1.0, 1.0, 0.0, 1.0),
  vec4(1.0, 1.0, 0.0, 1.0),
  vec4(1.0, 1.0, 0.0, 1.0),
  vec4(1.0, 1.0, 0.0, 1.0),
  vec4(1.0, 1.0, 0.0, 1.0),
  vec4(1.0, 1.0, 0.0, 1.0),
];

let scores = [];

function Score(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Score.prototype.checkPlayerCollision = function () {
  const half = scoreSize / 2;

  return (
    this.x - half < playerX + playerHalfLength &&
    this.x + half > playerX - playerHalfLength &&
    this.y - half < playerY + playerHalfLength &&
    this.y + half > playerY - playerHalfLength
  );
};
