
function createScene() {
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x888888));

  const light = new THREE.SpotLight('#FFFFFF', 0.5);
  light.position.set(0, 0, 50);
  scene.add(light);

  return scene;
}

function createWall() {
  const geom = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshLambertMaterial({ color: '#0000FF' });

  const wall = new THREE.Mesh(geom, mat);
  wall.isWall = true;

  return wall;
}

function createDot() {
  const geom = new THREE.SphereGeometry(DOT_RADIUS);
  const mat = new THREE.MeshPhongMaterial({ color: '#FFFFFF' });

  const dot = new THREE.Mesh(geom, mat);
  dot.isDot = true;

  return dot;
}

function createPowerUp() {
  const geom = new THREE.SphereGeometry(PELLET_RADIUS);
  const mat = new THREE.MeshPhongMaterial({ color: '#FFFFFF' });

  const power = new THREE.Mesh(geom, mat);
  power.isPowerUp = true;

  return power;
}

function createPacman() {
  const geom = new THREE.SphereGeometry(PACMAN_RADIUS, 16, 16);
  const mat = new THREE.MeshPhongMaterial({ color: '#FFFF00' });

  const pacman = new THREE.Mesh(geom, mat);
  pacman.isPacman = true;
  pacman.distanceMoved = 0;

  return pacman;
}

function createGhost() {
  const geom = new THREE.SphereGeometry(GHOST_RADIUS, 16, 16);
  const mat = new THREE.MeshPhongMaterial({ color: '#FF0000' });

  const ghost = new THREE.Mesh(geom, mat);
  ghost.isGhost = true;
  ghost.isScared = false;

  return ghost;
}
