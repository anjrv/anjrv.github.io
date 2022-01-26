// Player constants
const maxJump = 40;
const playerHalfLength = 40;

const playerColors = [
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
  vec4(0.0, 0.0, 1.0, 1.0),
];

// Player starting state
let playerX = 400;
let playerY = 760;
let playerDir = 1;
let jumpFrames = 0;

function playerChange() {
  const prevX = playerX;
  const prevY = playerY;

  if (jumpFrames === 0) {
    if (keys[left]) {
      if (playerX > playerHalfLength) {
        playerX -= 8;
      }
      playerDir = -1;
    }

    if (keys[right]) {
      if (playerX < canvas.width - playerHalfLength) {
        playerX += 8;
      }
      playerDir = 1;
    }

    if (keys[jump]) {
      jumpFrames = maxJump;
    }
  } else {
    if (
      playerX < canvas.width - playerHalfLength &&
      playerX > playerHalfLength
    ) {
      playerX += 8 * playerDir;
    }

    if (jumpFrames <= maxJump / 2) {
      playerY += 16;
    } else {
      playerY -= 16;
    }

    jumpFrames--;
  }

  if (checkWallY() && checkWallX()) {
    playerX = prevX;
  } else {
    if (!jumpFrames && playerY < 760) playerY += 16;
  }

  if (checkWallX() && checkWallY() && prevY < minWallY) {
    playerY = minWallY - playerHalfLength;
  }

  return drawRect(playerX, playerY, playerHalfLength * 2);
}
