const fps = 59.94;
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene = createScene();
const map = initMap(scene);
const pacman = map.pacman;

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
let PACMAN_SPEED = 0.05;
let GHOST_SPEED = PACMAN_SPEED * 0.8;

function updateCameras() {
  const pacman = map.pacman;

  thirdPerson.position.lerp(
    new THREE.Vector3()
      .copy(pacman.position)
      .addScaledVector(UP, 2)
      .addScaledVector(pacman.direction, keys[32] ? 3 : -1),
    keys[32] ? 0.5 : 0.05,
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

function spawnGhost() {
  const ghost = createGhost(
    GHOST_COLORS.splice(Math.floor(Math.random() * GHOST_COLORS.length), 1)[0],
  );

  ghost.position.set(map.ghostSpawn.x, map.ghostSpawn.y, map.ghostSpawn.z);
  scene.add(ghost);

  map.lastGhostSpawn = new Date().getTime() / 1000;
  map.ghosts++;
}

function updateGhosts() {
  if (map.ghosts < 4 && map.lastGhostSpawn + GHOST_SPAWNTIME < new Date().getTime() / 1000) {
    spawnGhost();
  }

  scene.children.forEach(function (obj) {
    if (obj.isGhost) {
      obj.update(map, scene);
    }
  });
}

function update() {
  pacman.update(map);
  updateCameras();
  updateGhosts();
}

const animate = function () {
  setTimeout(() => {
    if (eatKey('49')) currCam = 1;
    if (eatKey('50')) currCam = 2;
    if (eatKey('51')) currCam = 3;

    if (!pacman.dead) update();
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
