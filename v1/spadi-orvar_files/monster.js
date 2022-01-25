const monsterSize = 60;
const monsterColors = [
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
  vec4(1.0, 0.0, 0.0, 1.0),
];

function Monster(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

Monster.prototype.checkPlayerCollision = function () {
  const half = monsterSize/ 2;

  return (
    this.x - half < playerX + playerHalfLength &&
    this.x + half > playerX - playerHalfLength &&
    this.y - half < playerY + playerHalfLength &&
    this.y + half > playerY - playerHalfLength
  );
};

Monster.prototype.draw = function (allVertices, allColors) {
  allVertices.push(...drawRect(this.x, this.y, monsterSize));
  allColors.push(...monsterColors);
}

