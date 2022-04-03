const fps = 59.94;
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene = createScene();
const map = initMap(scene);

// Cameras
const firstPerson = new THREE.PerspectiveCamera(
  90,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);
firstPerson.up.copy(UP);

const thirdPerson = new THREE.PerspectiveCamera(
  65,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);
thirdPerson.up.copy(UP);

const overhead = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);
overhead.position.set(map.centerX - 0.5, map.centerY, 22);

let currCam = 2;
let score = 0;

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

  if (pacman.isMoving && pacman.prevWasWall < 3)
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

  const cell = map.getCell(pacman.position);

  if (cell && cell.visible) {
    if (cell.isDot) {
      map.clear(pacman.position);
      score++;
    } else if (cell.isPowerUp) {
      map.clear(pacman.position);
      pacman.isPowered = true;
    }
  }
}

function updateCameras() {
  const pacman = map.pacman;

  thirdPerson.position.lerp(
    new THREE.Vector3()
      .copy(pacman.position)
      .addScaledVector(UP, 2)
      .addScaledVector(pacman.direction, -1),
    0.05,
  );
  thirdPerson.lookAt(
    new THREE.Vector3().copy(pacman.position).add(pacman.direction),
  );

  firstPerson.position.lerp(
    new THREE.Vector3()
      .copy(pacman.position)
      .addScaledVector(pacman.direction, 0),
    0.5,
  );
  firstPerson.lookAt(
    new THREE.Vector3().copy(pacman.position).add(pacman.direction),
  );
}

function update() {
  if (eatKey('49')) currCam = 1;
  if (eatKey('50')) currCam = 2;
  if (eatKey('51')) currCam = 3;

  updatePacman();
  updateCameras();
}

const animate = function () {
  setTimeout(() => {
    update();
    requestAnimationFrame(animate);

    switch (currCam) {
      case 1:
        renderer.render(scene, firstPerson);
        break;
      case 2:
        renderer.render(scene, thirdPerson);
        break;
      case 3:
        renderer.render(scene, overhead);
        break;
    }
  }, 1000 / fps);
};

animate();
