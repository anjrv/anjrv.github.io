function createScene() {
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x888888));

  const light = new THREE.DirectionalLight('#FFFFFF', 1);
  light.position.set(0, 0, 10);
  scene.add(light);

  return scene;
}

function createWall() {
  const geom = new THREE.BoxGeometry(1, 1, 0.4);
  const mat = new THREE.MeshLambertMaterial({ color: '#153C4E' });

  const wall = new THREE.Mesh(geom, mat);
  wall.isWall = true;

  return wall;
}

function createDot() {
  const geom = new THREE.SphereGeometry(DOT_RADIUS);
  const mat = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.0,
  });

  const dot = new THREE.Mesh(geom, mat);
  dot.isDot = true;

  return dot;
}

function createPowerUp() {
  const geom = new THREE.SphereGeometry(UP_RADIUS, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: '#CD607E',
    roughness: 0.0,
  });

  const power = new THREE.Mesh(geom, mat);
  power.isPowerUp = true;

  return power;
}

function createPacman() {
  const geom = new THREE.SphereGeometry(
    PACMAN_RADIUS,
    32,
    32,
    0,
    Math.PI * 1.8,
  );
  const mat = new THREE.MeshStandardMaterial({ color: '#FFFF31' });

  const pacman = new THREE.Mesh(geom, mat);

  const eye1 = new THREE.Mesh(
    new THREE.SphereGeometry(DOT_RADIUS),
    new THREE.MeshLambertMaterial({ color: '#000000' }),
  );

  eye1.position.x -= PACMAN_RADIUS * 0.7;
  eye1.position.y += PACMAN_RADIUS * 0.3;
  eye1.position.z += PACMAN_RADIUS * 0.5;

  pacman.add(eye1);

  const eye2 = new THREE.Mesh(
    new THREE.SphereGeometry(DOT_RADIUS),
    new THREE.MeshLambertMaterial({ color: '#000000' }),
  );

  eye2.position.x -= PACMAN_RADIUS * 0.7;
  eye2.position.y -= PACMAN_RADIUS * 0.3;
  eye2.position.z += PACMAN_RADIUS * 0.5;

  pacman.add(eye2);

  pacman.direction = new THREE.Vector3(-1, 0, 0);
  pacman.isPacman = true;
  pacman.isMoving = false;
  pacman.isPowered = false;
  pacman.prevWasWall = 0;
  pacman.dead = false;

  pacman.update = function (map) {
    pacman.isPowered = false;
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
    if (eatKey(37) && !map.isWall(left)) {
      // Left arrow
      pacman.direction.applyAxisAngle(UP, Math.PI / 2);
      pacman.prevWasWall = 0;
    }
    if (eatKey(39) && !map.isWall(right)) {
      // Right arrow
      pacman.direction.applyAxisAngle(UP, -Math.PI / 2);
      pacman.prevWasWall = 0;
    }

    if (pacman.isMoving && pacman.prevWasWall < 2)
      pacman.translateOnAxis(LEFT, PACMAN_SPEED); // Try advance

    // Aggressively push out of walls
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
      } else if (cell.isPowerUp) {
        map.clear(pacman.position);
        pacman.isPowered = true;
      }
    }
  };

  return pacman;
}

function createGhost(color) {
  const geom = new THREE.SphereGeometry(GHOST_RADIUS, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: color });
  const ghost = new THREE.Mesh(geom, mat);
  ghost.direction = new THREE.Vector3(-1, 0, 0);
  ghost.isGhost = true;
  ghost.isScared = false;
  ghost.originalColor = color;
  
  ghost.update = function (map, scene) {
    const prev = new THREE.Vector3()
      .copy(ghost.position)
      .addScaledVector(ghost.direction, 0.5)
      .round();
    ghost.translateOnAxis(ghost.direction, GHOST_SPEED);

    const curr = new THREE.Vector3()
      .copy(ghost.position)
      .addScaledVector(ghost.direction, 0.5)
      .round();

    if (!curr.equals(prev)) {
      const left = new THREE.Vector3()
        .copy(ghost.direction)
        .applyAxisAngle(UP, Math.PI / 2);
      const right = new THREE.Vector3()
        .copy(ghost.direction)
        .applyAxisAngle(UP, -Math.PI / 2);

      const turns = [];
      if (!map.isWall(curr)) turns.push(ghost.direction);
      if (!map.isWall(curr.copy(ghost.position).add(left))) turns.push(left);
      if (!map.isWall(curr.copy(ghost.position).add(right))) turns.push(right);

      ghost.direction.copy(turns[Math.floor(Math.random() * turns.length)]);
    }

    if (
      ghost.isAfraid &&
      ghost.becameAfraid + UP_DURATION < new Date().getTime() / 1000
    ) {
      ghost.material.color.setStyle(ghost.originalColor);
      ghost.isAfraid = false;
    }

    if (map.pacman.isPowered) {
      ghost.material.color.setStyle('#FFFFFF');
      ghost.isAfraid = true;
      ghost.becameAfraid = new Date().getTime() / 1000;
    }

    if (distance(map.pacman, ghost) < PACMAN_RADIUS + GHOST_RADIUS) {
      if (ghost.isAfraid) {
        GHOST_COLORS.push(ghost.originalColor);
        scene.remove(ghost);
        map.ghosts--;
      } else {
        map.pacman.dead = true;
      }
    }
  };

  return ghost;
}
