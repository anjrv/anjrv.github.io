/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Búum til bókstafinn H úr þremur teningum
//
//    Hjálmtýr Hafsteinsson, febrúar 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numScreenVertices = 6;
var numVertices = 36;

var texture;

var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var zDist = 5.0;

var origX;
var origY;

var locProjection1;
var locModelView1;
var locPosition1;
var locProjection2;
var locModelView2;
var locPosition2;
var locTexCoord;

var screenFrameBuffer;
var screenBuffer;

var screenFrameVerts = [];

var screenVerts = [
  vec4(-1.25, -0.9, 0.0, 1.0),
  vec4(1.25, -0.9, 0.0, 1.0),
  vec4(1.25, 0.9, 0.0, 1.0),
  vec4(1.25, 0.9, 0.0, 1.0),
  vec4(-1.25, 0.9, 0.0, 1.0),
  vec4(-1.25, -0.9, 0.0, 1.0),
];

var texCoords = [
  vec2(0.0, 0.0),
  vec2(1.0, 0.0),
  vec2(1.0, 1.0),
  vec2(1.0, 1.0),
  vec2(0.0, 1.0),
  vec2(0.0, 0.0),
];

function configureTexture(image, prog) {
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.useProgram(prog);
  gl.uniform1i(gl.getUniformLocation(prog, 'texture'), 0);
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  colorCube();

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Litarar sem lita með einum lit (sendur sem uniform-breyta)
  program1 = initShaders(gl, 'vertex-shader', 'fragment-shader');

  // Litarar sem lita með mynstri
  program2 = initShaders(gl, 'vertex-shader2', 'fragment-shader2');

  screenFrameBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, screenFrameBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(screenFrameVerts), gl.STATIC_DRAW);

  locPosition1 = gl.getAttribLocation(program1, 'vPosition');
  gl.enableVertexAttribArray(locPosition1);

  locProjection1 = gl.getUniformLocation(program1, 'projection');
  locModelView1 = gl.getUniformLocation(program1, 'modelview');

  screenBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(screenVerts), gl.STATIC_DRAW);

  locPosition2 = gl.getAttribLocation(program2, 'vPosition');
  gl.enableVertexAttribArray(locPosition2);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  locTexCoord = gl.getAttribLocation(program2, 'vTexCoord');
  gl.vertexAttribPointer(locTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(locTexCoord);

  var image = document.getElementById('texImage');
  configureTexture(image, program2);

  locProjection2 = gl.getUniformLocation(program2, 'projection');
  locModelView2 = gl.getUniformLocation(program2, 'modelview');

  var proj = perspective(50.0, 1.0, 0.2, 100.0);

  gl.useProgram(program1);
  gl.uniformMatrix4fv(locProjection1, false, flatten(proj));

  gl.useProgram(program2);
  gl.uniformMatrix4fv(locProjection2, false, flatten(proj));

  //event listeners for mouse
  canvas.addEventListener('mousedown', function (e) {
    movement = true;
    origX = e.clientX;
    origY = e.clientY;
    e.preventDefault(); // Disable drag and drop
  });

  canvas.addEventListener('mouseup', function (e) {
    movement = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    if (movement) {
      spinY = (spinY + (origX - e.clientX)) % 360;
      spinX = (spinX + (origY - e.clientY)) % 360;
      origX = e.clientX;
      origY = e.clientY;
    }
  });

  // Event listener for keyboard
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 38: // upp ör
        zDist += 0.1;
        break;
      case 40: // niður ör
        zDist -= 0.1;
        break;
    }
  });

  // Event listener for mousewheel
  window.addEventListener('mousewheel', function (e) {
    if (e.wheelDelta > 0.0) {
      zDist += 0.2;
    } else {
      zDist -= 0.2;
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

function quad(a, b, c, d) {
  var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
  ];

  var indices = [a, b, c, a, c, d];

  for (var i = 0; i < indices.length; ++i) {
    screenFrameVerts.push(vertices[indices[i]]);
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var mv = lookAt(
    vec3(0.0, 0.0, zDist),
    vec3(0.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
  );
  mv = mult(mv, rotateX(spinX));
  mv = mult(mv, rotateY(spinY));

  var mv2 = mv;

  // Frame
  gl.useProgram(program1);
    gl.uniform4fv(
    gl.getUniformLocation(program1, 'Color'),
    vec4(0.0, 0.0, 0.0, 1.0),
  );

  mv1 = mult(mv, translate(0.0, 0.0, -0.02));
  mv1 = mult(mv1, scalem(1.6, 1.0, 0.1));
  gl.uniformMatrix4fv(locModelView1, false, flatten(mv1));
  gl.bindBuffer(gl.ARRAY_BUFFER, screenFrameBuffer);
  gl.vertexAttribPointer(locPosition1, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);

  mv1 = mult(mv, translate(0.0, -0.6, 0.0));
  mv1 = mult(mv1, scalem(0.1, 0.3, 0.05));
  gl.uniformMatrix4fv(locModelView1, false, flatten(mv1));
  gl.bindBuffer(gl.ARRAY_BUFFER, screenFrameBuffer);
  gl.vertexAttribPointer(locPosition1, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);

  mv1 = mult(mv, translate(0.0, -0.8, 0.0));
  mv1 = mult(mv1, scalem(0.8, 0.1, 0.5));
  gl.uniformMatrix4fv(locModelView1, false, flatten(mv1));
  gl.bindBuffer(gl.ARRAY_BUFFER, screenFrameBuffer);
  gl.vertexAttribPointer(locPosition1, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, numVertices);

  // Screen
  gl.useProgram(program2);
  mv2 = mult(mv2, translate(0.0, 0.0, 0.031));
  mv2 = mult(mv2, scalem(0.5, 0.5, 0.1));

  gl.uniformMatrix4fv(locModelView2, false, flatten(mv2));

  gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
  gl.vertexAttribPointer(locPosition2, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, numScreenVertices);

  requestAnimFrame(render);
}
