// Unit information
const PACMAN_SPEED = 2;
const PACMAN_RADIUS = 0.25;

const GHOST_SPEED = 1.5;
const GHOST_RADIUS = PACMAN_RADIUS * 1.25;

const DOT_RADIUS = 0.05;
const PELLET_RADIUS = DOT_RADIUS * 2;

// Map bounds
const UP = new THREE.Vector3(0, 0, 1);
const LEFT = new THREE.Vector3(-1, 0, 0);
const TOP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);
const BOTTOM = new THREE.Vector3(0, -1, 0);
