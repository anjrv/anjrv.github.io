let currCam = 1;

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene = createScene();
const map = initMap(scene);

// Cameras
const thirdPerson = new THREE.PerspectiveCamera(
  65,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);

const overhead = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);
overhead.position.set(map.centerX - 0.5, map.centerY, 22);

function updatePacman() {
  const pacman = map.pacman;

  pacman.up.copy(pacman.direction).applyAxisAngle(UP, -Math.PI / 2);
  pacman.lookAt(new THREE.Vector3().copy(pacman.position).add(UP));

  const up = pacman.position
    .clone()
    .addScaledVector(TOP, PACMAN_RADIUS)
    .round();
  const down = pacman.position
    .clone()
    .addScaledVector(BOTTOM, PACMAN_RADIUS)
    .round();
  const left = pacman.position
    .clone()
    .addScaledVector(LEFT, PACMAN_RADIUS)
    .round();
  const right = pacman.position
    .clone()
    .addScaledVector(RIGHT, PACMAN_RADIUS)
    .round();

  if (eatKey(38)) pacman.isMoving = true; // Up arrow
  if (eatKey(40)) {
    // Down arrow
    pacman.direction.applyAxisAngle(UP, Math.PI);
    pacman.prevWasWall = 0;
  }
  if (eatKey(37)) {
    // Left arrow
    pacman.direction.applyAxisAngle(UP, Math.PI / 2);
    pacman.prevWasWall = 0;
  }
  if (eatKey(39)) {
    // Right arrow
    pacman.direction.applyAxisAngle(UP, -Math.PI / 2);
    pacman.prevWasWall = 0;
  }

  if (pacman.isMoving && pacman.prevWasWall < 5)
    pacman.translateOnAxis(LEFT, PACMAN_SPEED); // Try advance

  // Clamp to wall edges
  if (map.isWall(up)) {
    pacman.position.y = up.y - 0.6 - PACMAN_RADIUS;
    pacman.prevWasWall++;
  }
  if (map.isWall(down)) {
    pacman.position.y = down.y + 0.6 + PACMAN_RADIUS;
    pacman.prevWasWall++;
  }
  if (map.isWall(left)) {
    pacman.position.x = left.x + 0.6 + PACMAN_RADIUS;
    pacman.prevWasWall++;
  }
  if (map.isWall(right)) {
    pacman.position.x = right.x - 0.6 - PACMAN_RADIUS;
    pacman.prevWasWall++;
  }

  thirdPerson.position.x = pacman.position.x + 10;
  thirdPerson.position.y = pacman.position.y;
  thirdPerson.position.z = pacman.position.z + 5;
  thirdPerson.rotation.x = pacman.rotation.x;
  thirdPerson.rotation.y = pacman.rotation.y;

  thirdPerson.lookAt(pacman.position);
}

function update() {
  if (eatKey('49')) currCam = 1;
  if (eatKey('50')) currCam = 2;

  updatePacman();
}

const animate = function () {
  update();
  requestAnimationFrame(animate);

  switch (currCam) {
    case 1:
      renderer.render(scene, overhead);
      break;
    case 2:
      renderer.render(scene, thirdPerson);
      break;
  }
};

animate();
