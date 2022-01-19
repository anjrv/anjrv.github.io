/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     Teiknar punkt � strigann �ar sem notandinn smellir m�sinni
//
//    Hj�lmt�r Hafsteinsson, jan�ar 2021
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var maxNumTriangles = 200; // H�marksfj�ldi punkta sem forriti� r��ur vi�!
var index = 0; // N�mer n�verandi punkts

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * 3 * maxNumTriangles, gl.DYNAMIC_DRAW);

  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  canvas.addEventListener('mousedown', function (e) {
    if (index === maxNumTriangles) return;

    if (e.button === 2) {
      gl.bufferData(gl.ARRAY_BUFFER, 24 * maxNumTriangles, gl.DYNAMIC_DRAW);
      index = 0;

      return;
    }

    const x = (2 * e.offsetX) / canvas.width - 1;
    const y = (2 * (canvas.height - e.offsetY)) / canvas.height - 1;

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      24 * index,
      flatten([
        vec2(x - 0.05, y - 0.05),
        vec2(x, y + 0.05),
        vec2(x + 0.05, y - 0.05),
      ]),
    );

    index++;
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3 * index);

  window.requestAnimFrame(render);
}
