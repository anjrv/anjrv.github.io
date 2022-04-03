const MAP = [
  '############################',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#o####.#####.##.#####.####o#',
  '#.####.#####.##.#####.####.#',
  '#..........................#',
  '#.####.##.########.##.####.#',
  '#.####.##.########.##.####.#',
  '#......##....##....##......#',
  '#.####.##### ## #####.####.#',
  '#.####.##### ## #####.####.#',
  '#.####.##    G     ##.####.#',
  '#.####.## ######## ##.####.#',
  '#.####.## ######## ##.####.#',
  '#......   ########   ......#',
  '#.####.## ######## ##.####.#',
  '#.####.## ######## ##.####.#',
  '#.####.##          ##.####.#',
  '#.####.## ######## ##.####.#',
  '#.####.## ######## ##.####.#',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#.####.#####.##.#####.####.#',
  '#o..##.......P .......##..o#',
  '###.##.##.########.##.##.###',
  '###.##.##.########.##.##.###',
  '#......##....##....##......#',
  '#.##########.##.##########.#',
  '#.##########.##.##########.#',
  '#..........................#',
  '############################',
];

function initMap(scene) {
  const map = {};
  map.bottom = -(MAP.length - 1);
  map.top = 0;
  map.left = 0;
  map.right = MAP[0].length;
  map.dots = 0;
  map.ghosts = 0;
  map.pacman = null;
  map.pacmanSpawn = null;
  map.ghostSpawn = null;

  let y;

  for (let i = 0; i < MAP.length; i++) {
    y = -i;
    map[y] = {};

    for (let x = 0; x < MAP[i].length; x++) {
      const curr = MAP[i][x];
      let object = null;

      switch (curr) {
        case '#':
          object = createWall();
          object.position.set(x, y, -0.3);
          break;
        case '.':
          object = createDot();
          object.position.set(x, y, 0);
          map.dots++;
          break;
        case 'o':
          object = createPowerUp();
          object.position.set(x, y, 0);
          break;
        case 'P':
          map.pacmanSpawn = new THREE.Vector3(x, y, 0);
          const pacman = createPacman();
          pacman.position.set(x, y, 0);
          map.pacman = pacman;
          scene.add(pacman);
          break;
        case 'G':
          map.ghostSpawn = new THREE.Vector3(x, y, 0);
          const ghost = createGhost();
          ghost.position.set(x, y, 0);
          scene.add(ghost);
          map.ghosts++;
          break;
      }

      if (object) {
        map[y][x] = object;
        scene.add(object);
      }
    }
  }

  map.centerX = (map.left + map.right) / 2;
  map.centerY = (map.bottom + map.top) / 2;

  map.getCell = function (loc) {
    const y = Math.round(loc.y);
    return map[y] && map[y][Math.round(loc.x)];
  };

  map.isWall = function (loc) {
    const cell = this.getCell(loc);
    return cell && cell.isWall;
  };

  map.clear = function (loc) {
    const y = Math.round(loc.y);
    const x = Math.round(loc.x);

    if (map[y] && map[y][x]) map[y][x].visible = false;
  };

  return map;
}
