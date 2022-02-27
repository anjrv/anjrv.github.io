var canvas;
var gl;

var NumVertices = 36;

var points = [];
var colors = [];

var vBuffer;
var cBuffer;
var avBuffer;
var acBuffer;

var vColor;
var vPosition;

var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;

var proLoc;
var mvLoc;

// World grid line definitions
var axes = [
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
var axes_colors = [
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

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  colorCube();

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

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
  gl.bufferData(gl.ARRAY_BUFFER, flatten(axes_colors), gl.STATIC_DRAW);

  avBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, avBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(axes), gl.STATIC_DRAW);

  gl.lineWidth(3.0);

  proLoc = gl.getUniformLocation(program, 'projection');
  mvLoc = gl.getUniformLocation(program, 'modelview');

  var proj = perspective(50.0, 1.0, 0.05, 100.0);
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
  var vertices = [
    vec3(-0.05, -0.05, 0.05),
    vec3(-0.05, 0.05, 0.05),
    vec3(0.05, 0.05, 0.05),
    vec3(0.05, -0.05, 0.05),
    vec3(-0.05, -0.05, -0.05),
    vec3(-0.05, 0.05, -0.05),
    vec3(0.05, 0.05, -0.05),
    vec3(0.05, -0.05, -0.05),
  ];

  var vertexColors = [
    [0.0, 0.0, 0.0, 1.0], // black
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 1.0, 0.0, 1.0], // yellow
    [0.0, 1.0, 0.0, 1.0], // green
    [0.0, 0.0, 1.0, 1.0], // blue
    [1.0, 0.0, 1.0, 1.0], // magenta
    [0.0, 1.0, 1.0, 1.0], // cyan
    [1.0, 1.0, 1.0, 1.0], // white
  ];

  // We need to parition the quad into two triangles in order for
  // WebGL to be able to render it.  In this case, we create two
  // triangles from the quad indices

  //vertex color assigned by the index of the vertex

  var indices = [a, b, c, a, c, d];

  for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]]);
    //colors.push( vertexColors[indices[i]] );

    // for solid colored faces use
    colors.push(vertexColors[a]);
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var ctm = lookAt(
    vec3(0.0, 0.0, zDist),
    vec3(0.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
  );
  ctm = mult(ctm, rotateX(spinX));
  ctm = mult(ctm, rotateY(spinY));

  // Draw animals - TODO: For loop with translation
  ctm1 = mult( ctm, translate( 0.0, 0.0, 0.0 ) );

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

  // Draw world grid ( Use retained origin )
  gl.bindBuffer(gl.ARRAY_BUFFER, acBuffer);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, avBuffer);
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(mvLoc, false, flatten(ctm));
  gl.drawArrays(gl.LINES, 0, 24);

  requestAnimFrame(render);
}
