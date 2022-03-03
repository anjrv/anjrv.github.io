let canvas;
let gl;

let cBuffer;
let avBuffer;
let acBuffer;

let vColor;
let vPosition;

let movement = false; // Do we rotate?
let spinX = 0;
let spinY = 0;
let origX;
let origY;

let zDist = -4.0;

let proLoc;
let mvLoc;

// Slider values
let speedMultiplier = 1;
let sheepSpeedMultiplier = 1;
let sheepBirthSpeed = 5;
let sheepPanicRange = 2;

let wolfSpeedMultiplier = 1;
let wolfBirthSpeed = 3;
let wolfAggroRange = 3;

let gridQuant = 10;
let startingSheep = 10;
let startingWolves = 2;

let scaleModifier;
let bound;

// Some constants
const NumVertices = 36;
const points = [];
const colors = [];
const halfWorldDimension = 0.9;
const fps = 60;
const sheepSpeed = 0.002;
const wolfSpeed = 0.002;
const baseGridQuant = 10;
const storage = window.sessionStorage;
const idxModifier = 10 / 1.8;

// World grid line definitions
const worldLines = [
  [-0.9, -0.9, 0.9], //1
  [-0.9, 0.9, 0.9], //2
  [-0.9, -0.9, 0.9], //1
  [0.9, -0.9, 0.9], //4
  [-0.9, -0.9, 0.9], //1
  [-0.9, -0.9, -0.9], //5
  [-0.9, 0.9, 0.9], //2
  [0.9, 0.9, 0.9], //3
  [-0.9, 0.9, 0.9], //2
  [-0.9, 0.9, -0.9], //6
  [0.9, 0.9, 0.9], //3
  [0.9, -0.9, 0.9], //4
  [0.9, 0.9, 0.9], //3
  [0.9, 0.9, -0.9], //7
  [0.9, -0.9, 0.9], //4
  [0.9, -0.9, -0.9], //8
  [-0.9, -0.9, -0.9], //5
  [-0.9, 0.9, -0.9], //6
  [-0.9, -0.9, -0.9], //5
  [0.9, -0.9, -0.9], //8
  [-0.9, 0.9, -0.9], //6
  [0.9, 0.9, -0.9], //7
  [0.9, 0.9, -0.9], //7
  [0.9, -0.9, -0.9], //8
];

// World grid black for line connections
const worldLineColors = [
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
  [0.0, 0.0, 0.0, 1.0],
];

function loadState() {
  if (sessionStorage.getItem('speedMultiplier'))
    speedMultiplier = sessionStorage.getItem('speedMultiplier');

  if (sessionStorage.getItem('sheepSpeedMultiplier'))
    sheepSpeedMultiplier = sessionStorage.getItem('sheepSpeedMultiplier');

  if (sessionStorage.getItem('sheepBirthSpeed'))
    sheepBirthSpeed = sessionStorage.getItem('sheepBirthSpeed');

  if (sessionStorage.getItem('sheepPanicRange'))
    sheepPanicRange = sessionStorage.getItem('sheepPanicRange');

  if (sessionStorage.getItem('wolfSpeedMultiplier'))
    wolfSpeedMultiplier = sessionStorage.getItem('wolfSpeedMultiplier');

  if (sessionStorage.getItem('wolfBirthSpeed'))
    wolfBirthSpeed = sessionStorage.getItem('wolfBirthSpeed');

  if (sessionStorage.getItem('wolfAggroRange'))
    wolfAggroRange = sessionStorage.getItem('wolfAggroRange');

  if (sessionStorage.getItem('gridQuant'))
    gridQuant = sessionStorage.getItem('gridQuant');

  if (sessionStorage.getItem('startingSheep'))
    startingSheep = sessionStorage.getItem('startingSheep');

  if (sessionStorage.getItem('startingWolves'))
    startingWolves = sessionStorage.getItem('startingWolves');
}

function spawn(sheep) {
  const tiles = gridQuant * gridQuant * gridQuant;
  const halfTileSize = (1.8 * scaleModifier) / gridQuant / 2;

  if (simulationState.wolves.length + simulationState.sheep.length < tiles) {
    let x = util.randIntRange(0, gridQuant - 1);
    let y = util.randIntRange(0, gridQuant - 1);
    let z = util.randIntRange(0, gridQuant - 1);

    while (true) {
      if (!simulationState.grid[`${x},${y},${z}`]) {
        if (sheep)
          simulationState.spawnSheep(
            x * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
            y * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
            z * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
          );
        else
          simulationState.spawnWolf(
            x * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
            y * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
            z * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
          );

        break;
      } else {
        x = util.randIntRange(0, gridQuant - 1);
        y = util.randIntRange(0, gridQuant - 1);
        z = util.randIntRange(0, gridQuant - 1);
      }
    }
  }
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  loadState();

  const inputSpeedMultiplier = document.getElementById('globalSpeed');
  const inputSheepSpeedMultiplier = document.getElementById('sSpeed');
  const inputSheepBirthSpeed = document.getElementById('sbSpeed');
  const inputSheepPanicRange = document.getElementById('sPanic');
  const inputWolfSpeedMultiplier = document.getElementById('wSpeed');
  const inputWolfBirthSpeed = document.getElementById('wbSpeed');
  const inputWolfAggroRange = document.getElementById('wAggro');
  const inputGridQuant = document.getElementById('gSize');
  const inputStartingSheep = document.getElementById('startSheep');
  const inputStartingWolves = document.getElementById('startWolf');

  inputSpeedMultiplier.value = speedMultiplier;
  inputSheepSpeedMultiplier.value = sheepSpeedMultiplier;
  inputSheepBirthSpeed.value = sheepBirthSpeed;
  inputSheepPanicRange.value = sheepPanicRange;
  inputWolfSpeedMultiplier.value = wolfSpeedMultiplier;
  inputWolfBirthSpeed.value = wolfBirthSpeed;
  inputWolfAggroRange.value = wolfAggroRange;
  inputGridQuant.value = gridQuant;
  inputStartingSheep.value = startingSheep;
  inputStartingWolves.value = startingWolves;
  scaleModifier = gridQuant / baseGridQuant;
  bound = halfWorldDimension * scaleModifier;

  colorCube();

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  //
  //  Load shaders and initialize attribute buffers
  //
  let program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.STATIC_DRAW);

  vColor = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  acBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, acBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(worldLineColors), gl.STATIC_DRAW);

  avBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, avBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(worldLines), gl.STATIC_DRAW);

  gl.lineWidth(3.0);

  proLoc = gl.getUniformLocation(program, 'projection');
  mvLoc = gl.getUniformLocation(program, 'modelview');

  let proj = perspective(50.0, 1.0, 0.09, 100.0);
  gl.uniformMatrix4fv(proLoc, false, flatten(proj));

  //event listeners for mouse
  canvas.addEventListener('mousedown', function (e) {
    movement = true;
    origX = e.offsetX;
    origY = e.offsetY;
    e.preventDefault(); // Disable drag and drop
  });

  canvas.addEventListener('mouseup', function (e) {
    movement = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    if (movement) {
      spinY = (spinY + (origX - e.offsetX)) % 360;
      spinX = (spinX + (e.offsetY - origY)) % 360;
      origX = e.offsetX;
      origY = e.offsetY;
    }
  });

  let i = 0;
  const tiles = gridQuant * gridQuant * gridQuant;
  while (i < tiles && i <= startingSheep) {
    spawn(true);
    i++;
  }

  i = 0;
  while (i < tiles && i <= startingWolves) {
    spawn(false);
    i++;
  }

  document.getElementById('globalSpeed').onchange = function (event) {
    speedMultiplier = event.target.value;
    sessionStorage.setItem('speedMultiplier', speedMultiplier);
  };

  document.getElementById('sSpeed').onchange = function (event) {
    sheepSpeedMultiplier = event.target.value;
    sessionStorage.setItem('sheepSpeedMultiplier', sheepSpeedMultiplier);
  };

  document.getElementById('sbSpeed').onchange = function (event) {
    sheepBirthSpeed = event.target.value;
    sessionStorage.setItem('sheepBirthSpeed', sheepBirthSpeed);
  };

  document.getElementById('sPanic').onchange = function (event) {
    sheepPanicRange = event.target.value;
    sessionStorage.setItem('sheepPanicRange', sheepPanicRange);
  };

  document.getElementById('wSpeed').onchange = function (event) {
    wolfSpeedMultiplier = event.target.value;
    sessionStorage.setItem('wolfSpeedMultiplier', wolfSpeedMultiplier);
  };

  document.getElementById('wbSpeed').onchange = function (event) {
    wolfBirthSpeed = event.target.value;
    sessionStorage.setItem('wolfBirthSpeed', wolfBirthSpeed);
  };

  document.getElementById('wAggro').onchange = function (event) {
    wolfAggroRange = event.target.value;
    sessionStorage.setItem('wolfAggroRange', wolfAggroRange);
  };

  document.getElementById('gSize').onchange = function (event) {
    sessionStorage.setItem('gridQuant', event.target.value);
  };

  document.getElementById('startSheep').onchange = function (event) {
    sessionStorage.setItem('startingSheep', event.target.value);
  };

  document.getElementById('startWolf').onchange = function (event) {
    sessionStorage.setItem('startingWolves', event.target.value);
  };

  document.getElementById('spawnSheep').onclick = function () {
    spawn(true);
  };

  document.getElementById('spawnWolf').onclick = function () {
    spawn(false);
  };

  render();
};

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

// Small origin cube
function quad(a, b, c, d) {
  const vertices = [
    vec3(-0.0675, -0.0675, 0.0675),
    vec3(-0.0675, 0.0675, 0.0675),
    vec3(0.0675, 0.0675, 0.0675),
    vec3(0.0675, -0.0675, 0.0675),
    vec3(-0.0675, -0.0675, -0.0675),
    vec3(-0.0675, 0.0675, -0.0675),
    vec3(0.0675, 0.0675, -0.0675),
    vec3(0.0675, -0.0675, -0.0675),
  ];

  const indices = [a, b, c, a, c, d];

  for (let i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]]);
  }
}

function swapColor(color) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(color));
}

function render() {
  setTimeout(() => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let ctm = lookAt(
      vec3(0.0, 0.0, zDist),
      vec3(0.0, 0.0, 0.0),
      vec3(0.0, 1.0, 0.0),
    );
    ctm = mult(ctm, rotateX(spinX));
    ctm = mult(ctm, rotateY(spinY));

    // Move animals and then draw
    simulationState.updateAnimals(speedMultiplier);
    simulationState.drawAnimals(ctm);

    // Draw world grid ( Use retained origin )
    gl.bindBuffer(gl.ARRAY_BUFFER, acBuffer);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, avBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
    gl.drawArrays(gl.LINES, 0, 24);

    requestAnimFrame(render);
  }, 1000 / fps);
}
