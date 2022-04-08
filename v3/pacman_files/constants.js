const PACMAN_RADIUS = 0.25;
const GHOST_RADIUS = PACMAN_RADIUS * 1.25;
const DOT_RADIUS = 0.04;
const UP_RADIUS = 0.1;

const UP_DURATION = 20;

const UP = new THREE.Vector3(0, 0, 1);
const LEFT = new THREE.Vector3(-1, 0, 0);
const TOP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);
const BOTTOM = new THREE.Vector3(0, -1, 0);

const GHOST_COLORS = ['#00FF00', '#00FFFF', '#746AB0'];
const GHOST_SPAWNTIME = 10;
