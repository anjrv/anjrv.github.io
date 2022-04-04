const MAP = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'W............WW............W',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'WoWWWW.WWWWW.WW.WWWWW.WWWWoW',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'W..........................W',
  'W.WWWW.WW.WW.WW.WW.WW.WWWW.W',
  'W.WWWW.WW.WW.WW.WW.WW.WWWW.W',
  'W......WW....WW....WW......W',
  'W.WWWW.WWWWW WW WWWWW.WWWW.W',
  'W.WWWW.WWWWW WW WWWWW.WWWW.W',
  'W.WWWW.WW    G     WW.WWWW.W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W......   WWWWWWWW   ......W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W.WWWW.WW          WW.WWWW.W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W.WWWW.WW WWWWWWWW WW.WWWW.W',
  'W............WW............W',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'W.WWWW.WWWWW.WW.WWWWW.WWWW.W',
  'Wo..WW.......P .......WW..oW',
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW',
  'WWW.WW.WW.WWWWWWWW.WW.WW.WWW',
  'W......WW....WW....WW......W',
  'W.WWWWWWWWWW.WW.WWWWWWWWWW.W',
  'W.WWWWWWWWWW.WW.WWWWWWWWWW.W',
  'W..........................W',
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
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
  map.ghostSpawn = null;

  let y;

  for (let i = 0; i < MAP.length; i++) {
    y = -i;
    map[y] = {};

    for (let x = 0; x < MAP[i].length; x++) {
      const curr = MAP[i][x];
      let object = null;

      switch (curr) {
        case 'W':
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
          const pacman = createPacman();
          pacman.position.set(x, y, 0);
          map.pacman = pacman;
          scene.add(pacman);
          break;
        case 'G':
          map.ghostSpawn = new THREE.Vector3(x, y, 0);
          map.lastGhostSpawn = new Date().getTime() / 1000;
          const ghost = createGhost('#FF0000');
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
