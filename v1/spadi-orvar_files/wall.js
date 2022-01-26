const wallTiles = [];
const wallSize = 80;
const minWallY = 640;
const wallOneX = 200;
const wallTwoX = 600;
const wallColors = [
  vec4(1.0, 1.0, 1.0, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
  vec4(1.0, 1.0, 1.0, 1.0),
];

function WallTile(descr) {
  for (const property in descr) {
    this[property] = descr[property];
  }
}

function checkWallX() {
  const half = 80 / 2;

  return (
    (playerX - playerHalfLength < wallOneX + half &&
      playerX + playerHalfLength > wallOneX + half) ||
    (playerX - playerHalfLength < wallTwoX + half &&
      playerX + playerHalfLength > wallTwoX + half) ||
    (playerX + playerHalfLength > wallOneX - half &&
      playerX - playerHalfLength < wallOneX - half) ||
    (playerX + playerHalfLength > wallTwoX - half &&
      playerX - playerHalfLength < wallTwoX - half) ||
    (playerX < wallOneX + half && playerX > wallOneX - half) ||
    (playerX < wallTwoX + half && playerX > wallTwoX - half)
  );
}

function checkWallY() {
  return playerY + playerHalfLength > minWallY;
}
