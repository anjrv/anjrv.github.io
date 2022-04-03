
const canvas = document.querySelector('#c');

// Skilgreina sviðsnet
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

// Skilgreina myndavél og staðsetja hana
const camera = new THREE.PerspectiveCamera(
  90,
  canvas.clientWidth / canvas.clientHeight,
  1,
  1000,
);
camera.position.set(0, 10, 0);

// Þarf að uppfæra ofanvörpunarfylki ef stikar myndavélar breytast
function updateCamera() {
  camera.updateProjectionMatrix();
}

// Bæta við músarstýringu
const controls = new THREE.OrbitControls(camera, canvas);

// Skilgreina birtingaraðferð með afbjögun (antialias)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Búa til tening með Phong áferð (Phong material) og bæta í sviðsnetið
const geometry = new THREE.BoxGeometry(1, 0.25, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);
cube.position.x += 1;
cube.position.y += -0.125;
scene.add(cube);

// Búa til kúlu með Phong áferð og bæta í sviðsnetið
const ballGeometry = new THREE.SphereGeometry(0.5, 20, 20);
const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xaa8844 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.x += -1;
scene.add(ball);

// Búa til sléttu með Phong áferð
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, -0.5, 0);
scene.add(plane);

// Skilgreina ljósgjafa og bæta honum í sviðsnetið
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

// Hreyfifall
const animate = function () {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};

animate();
