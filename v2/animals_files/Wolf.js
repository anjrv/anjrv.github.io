const wolfColors = [
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
  [0.5, 0.35, 0.05, 1.0],
];

function Wolf(attrib) {
  this.setup(attrib);
}

Wolf.prototype = new Animal();

Wolf.prototype.update = function (m = 1) {
  let nearestSheep = -1;
  let nearestSheepInfo;

  if (
    simulationState.grid[`${this.xIdx},${this.yIdx},${this.zIdx}`] &&
    simulationState.grid[`${this.xIdx},${this.yIdx},${this.zIdx}`].isSheep
  ) {
    nearestSheep = 0;
    nearestSheepInfo =
      simulationState.grid[`${this.xIdx},${this.yIdx},${this.zIdx}`];
  }

  for (let i = 1; nearestSheep === -1 && i <= wolfAggroRange; i++) {
    if (
      simulationState.grid[
        `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
      ] &&
      simulationState.grid[
        `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
      ].isSheep
    ) {
      nearestSheep = 1;
      nearestSheepInfo =
        simulationState.grid[
          `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
        ];
    } else if (
      simulationState.grid[
        `${(this.xIdx - i) % gridQuant},${this.yIdx},${this.zIdx}`
      ] &&
      simulationState.grid[
        `${(this.xIdx - i) % gridQuant},${this.yIdx},${this.zIdx}`
      ].isSheep
    ) {
      nearestSheep = 2;
      nearestSheepInfo =
        simulationState.grid[
          `${(this.xIdx - i) % gridQuant},${this.yIdx},${this.zIdx}`
        ];
    } else if (
      simulationState.grid[
        `${this.xIdx},${(this.yIdx + i) % gridQuant},${this.zIdx}`
      ] &&
      simulationState.grid[
        `${this.xIdx},${(this.yIdx + i) % gridQuant},${this.zIdx}`
      ].isSheep
    ) {
      nearestSheep = 3;
      nearestSheepInfo =
        simulationState.grid[
          `${this.xIdx},${(this.yIdx + i) % gridQuant},${this.zIdx}`
        ];
    } else if (
      simulationState.grid[
        `${this.xIdx},${(this.yIdx - i) % gridQuant},${this.zIdx}`
      ] &&
      simulationState.grid[
        `${this.xIdx},${(this.yIdx - i) % gridQuant},${this.zIdx}`
      ].isSheep
    ) {
      nearestSheep = 4;
      nearestSheepInfo =
        simulationState.grid[
          `${this.xIdx},${(this.yIdx - i) % gridQuant},${this.zIdx}`
        ];
    } else if (
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx + i) % gridQuant}`
      ] &&
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx + i) % gridQuant}`
      ].isSheep
    ) {
      nearestSheep = 6;
      nearestSheepInfo =
        simulationState.grid[
          `${this.xIdx},${this.yIdx},${(this.zIdx + i) % gridQuant}`
        ];
    } else if (
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx - i) % gridQuant}`
      ] &&
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx - i) % gridQuant}`
      ].isSheep
    ) {
      nearestSheep = 5;
      nearestSheepInfo =
        simulationState.grid[
          `${this.xIdx},${this.yIdx},${(this.zIdx - i) % gridQuant}`
        ];
    }
  }

  // Obtain adjacent residents
  let adjacents = this.getAdjacents();

  if (nearestSheep !== -1) {
    // Chase
    if (!adjacents[nearestSheep - 1] || adjacents[nearestSheep - 1].isSheep) {
      this.dir = nearestSheep;
      if (
        util.distSq(
          nearestSheepInfo.cx,
          nearestSheepInfo.cy,
          nearestSheepInfo.cz,
          this.cx,
          this.cy,
          this.cz,
        ) < util.square(0.18)
      ) {
        nearestSheepInfo.died();
        this.starvation = 2000;
        this.nextBirth -= 1 * wolfBirthSpeed;
      }
    } else this.dir = 0;
  } else {
    // Wander
    // While wandering try stick approximately to the relative mid points of tiles
    if (
      (this.cx % 0.18 < 0.1 && this.cx % 0.18 > 0.08 && Math.random() > 0.95) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[0] ? 1 : !adjacents[1] ? 2 : 0;
    } else if (
      (this.cy % 0.18 < 0.1 && this.cy % 0.18 > 0.08 && Math.random() > 0.95) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[2] ? 3 : !adjacents[3] ? 4 : 0;
    } else if (
      (this.cz % 0.18 < 0.1 && this.cz % 0.18 > 0.08 && Math.random() > 0.95) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[4] ? 5 : !adjacents[5] ? 6 : 0;
    }
  }

  this.starvation -= 1 * m;
  if (this.starvation <= 0) {
    this.isDead = true;
  }

  if (this.nextBirth <= 0) {
    const halfTileSize = (1.8 * scaleModifier) / gridQuant / 2;
    let x, y, z;

    if (!adjacents[0]) {
      x = (this.xIdx + 1) % gridQuant;
      y = this.yIdx;
      z = this.zIdx;
    } else if (!adjacents[1]) {
      x = (this.xIdx - 1) % gridQuant;
      y = this.yIdx;
      z = this.zIdx;
    } else if (!adjacents[2]) {
      x = this.xIdx;
      y = (this.yIdx + 1) % gridQuant;
      z = this.zIdx;
    } else if (!adjacents[3]) {
      x = this.xIdx;
      y = (this.yIdx - 1) % gridQuant;
      z = this.zIdx;
    } else if (!adjacents[4]) {
      x = this.xIdx;
      y = this.yIdx;
      z = (this.zIdx + 1) % gridQuant;
    } else if (!adjacents[5]) {
      x = this.xIdx;
      y = this.yIdx;
      z = (this.zIdx - 1) % gridQuant;
    }

    if (x)
      simulationState.spawnWolf(
        x * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
        y * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
        z * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
      );

    this.nextBirth = 10;
  }

  this.move(m, wolfSpeed * wolfSpeedMultiplier);
};
