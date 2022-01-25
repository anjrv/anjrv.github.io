// Framerate cap for consistency
// Hacky but it's enough for this
// ( Affects physics like jump height and movement speed )
const fps = 60;

let canvas;
let gl;

let N = 0;
let score = 0;
let monster = null;

/**
 * Returns a random int between min ( inclusive )
 * and max ( inclusive )
 *
 * @param {*} min the minimum value of the int to return
 * @param {*} max the maximum value of the int to return
 * @returns a random int between min and max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper function to translate screenspace x, y and sidelength
 * into a vec2 rectangle (actually square) that can be drawn.
 *
 * @param {number} x The x-axis midpoint of the square
 * @param {number} y The y-axis midpoint of the square
 * @param {number} sideLength How long the sides of the square should be
 * @returns an array of 2D vectors to be used by the gpu to draw the square
 */
function drawRect(x, y, sideLength) {
  const midX = (2 * x) / canvas.width - 1;
  const midY = (2 * (canvas.height - y)) / canvas.height - 1;
  const vertDiff = sideLength / canvas.width; // Assume width === height

  const rectVerts = [
    vec2(midX - vertDiff, midY - vertDiff),
    vec2(midX - vertDiff, midY + vertDiff),
    vec2(midX + vertDiff, midY - vertDiff),
    vec2(midX - vertDiff, midY + vertDiff),
    vec2(midX + vertDiff, midY - vertDiff),
    vec2(midX + vertDiff, midY + vertDiff),
  ];

  return rectVerts;
}

function checkScoreCollisions() {
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i].checkPlayerCollision()) {
      score++;
      scores.splice(i, 1);
    }
  }
}

function updateState() {
  if (!monster) {
    // Spawn monster randomly
  }

  if (Math.random() > 0.995) {
    const half = scoreSize / 2;
    scores.push(
      new Score({
        x: getRandomInt(0 + half, canvas.width - half),
        y: getRandomInt(400 + half, canvas.height - half),
        life: 600,
      }),
    );
  }

  for (let i = scores.length - 1; i >= 0; i--) {
    scores[i].life--;
    if (scores[i].life <= 0) {
      scores.splice(i, 1);
    }
  }

  document.getElementById('score').innerHTML = score;
}

function computeChange(allVertices, allColors) {
  // Append playerchange to this round of vertices
  allVertices.push(...playerChange());
  allColors.push(...playerColors);

  checkScoreCollisions();

  updateState();

  scores.forEach(function (score) {
    allVertices.push(...drawRect(score.x, score.y, scoreSize));
    allColors.push(...scoreColors);
  });
}

function render() {
  setTimeout(() => {
    if (score < 10) {
      let allVertices = [];
      let allColors = [];
      computeChange(allVertices, allColors); // Changes allVertices

      N = allVertices.length;
      allVertices.push(...allColors);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(allVertices));
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, N);

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
  gl.bufferData(gl.ARRAY_BUFFER, 12000, gl.DYNAMIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 12000, gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  const vPosition = gl.getAttribLocation(program, 'aVertexPosition');
  const vColor = gl.getAttribLocation(program, 'aVertexColor');

  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);

  render();
};
