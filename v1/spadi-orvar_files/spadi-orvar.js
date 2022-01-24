const left = 37;
const right = 39;
const jump = 38;
const fps = 60;
const maxJump = 40;

const keys = [];
const playerHalfLength = 40;
const playerVertices = [
  // Triangle 1
  vec2(-0.1, -1.0),
  vec2(-0.1, -0.8),
  vec2(0.1, -1.0),

  // Triangle 2
  vec2(-0.1, -0.8),
  vec2(0.1, -1.0),
  vec2(0.1, -0.8),
];

let playerX = 400;
let playerY = 760;
let canvas;
let gl;
let playerDir = 1;
let jumpFrames = 0;
let allVertices = [];
let monsters = {};
let scores = {};

function handleKeydown(evt) {
  keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
  keys[evt.keyCode] = false;
}

function keyCode(keyChar) {
  return keyChar.charCodeAt(0);
}

function playerChange() {
  let xmove = 0.0;
  let ymove = 0.0;

  if (jumpFrames === 0) {
    if (keys[left]) {
      if (playerX > playerHalfLength) {
        xmove = -0.02;
        playerX -= 8;
      }
      playerDir = -1;
    }

    if (keys[right]) {
      if (playerX < canvas.width - playerHalfLength) {
        xmove = 0.02;
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
      xmove = jumpFrames <= maxJump / 2 ? 0.02 * playerDir : 0.02 * playerDir;
      playerX += 8 * playerDir;
    }

    if (jumpFrames <= maxJump / 2) {
      ymove = -0.04;
      playerY -= 16;
    } else {
      ymove = 0.04;
      playerY += 16;
    }

    jumpFrames--;
  }

  for (i = 0; i < playerVertices.length; i++) {
    playerVertices[i][0] += xmove;
    playerVertices[i][1] += ymove;
  }

  allVertices = [...playerVertices];
}

function computeChange() {
  allVertices = [];

  playerChange();
}

function render() {
  setTimeout(() => {
    computeChange();

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(allVertices));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, allVertices.length);

    window.requestAnimFrame(render);
  }, 1000 / fps);
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Load the data into the GPU
  const bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(playerVertices), gl.DYNAMIC_DRAW);

  // Associate out shader variables with our data buffer
  const vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);

  render();
};
