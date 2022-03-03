const sheepColors = [
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
];

function Sheep(attrib) {
  this.setup(attrib);
}

Sheep.prototype = new Animal();

Sheep.prototype.died = function () {
  this.isDead = true;
};

Sheep.prototype.update = function (m = 1) {
  // Check for wolf
  let nearestWolf = 0;

  for (let i = 1; nearestWolf === 0 && i <= sheepPanicRange; i++) {
    if (
      simulationState.grid[
        `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
      ] &&
      !simulationState.grid[
        `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
      ].isSheep
    )
      nearestWolf = 1;
    if (
      simulationState.grid[
        `${(this.xIdx - i) % gridQuant},${this.yIdx},${this.zIdx}`
      ] &&
      !simulationState.grid[
        `${(this.xIdx - i) % gridQuant},${this.yIdx},${this.zIdx}`
      ].isSheep
    )
      nearestWolf = 2;
    if (
      simulationState.grid[
        `${this.xIdx},${(this.yIdx + i) % gridQuant},${this.zIdx}`
      ] &&
      !simulationState.grid[
        `${this.xIdx},${(this.yIdx + i) % gridQuant},${this.zIdx}`
      ].isSheep
    )
      nearestWolf = 3;
    if (
      simulationState.grid[
        `${this.xIdx},${(this.yIdx - i) % gridQuant},${this.zIdx}`
      ] &&
      !simulationState.grid[
        `${this.xIdx},${(this.yIdx - i) % gridQuant},${this.zIdx}`
      ].isSheep
    )
      nearestWolf = 4;
    if (
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx + i) % gridQuant}`
      ] &&
      !simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx + i) % gridQuant}`
      ].isSheep
    )
      nearestWolf = 5;
    if (
      simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx - i) % gridQuant}`
      ] &&
      !simulationState.grid[
        `${this.xIdx},${this.yIdx},${(this.zIdx - i) % gridQuant}`
      ].isSheep
    )
      nearestWolf = 6;
  }

  // Obtain adjacent residents
  adjacents = this.getAdjacents();

  if (nearestWolf !== 0) {
    // Panic
    const preferredDirection =
      nearestWolf % 2 === 0 ? nearestWolf - 1 : nearestWolf + 1;

    if (!adjacents[preferredDirection - 1]) this.dir = preferredDirection;
    else if (adjacents[preferredDirection - 1]) this.dir = 0;
  } else {
    // Wander
    // While wandering try stick approximately to the relative mid points of tiles
    if (
      (this.cx % 0.18 < 0.1 && this.cx % 0.18 > 0.08 && Math.random() > 0.99) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[0] ? 1 : !adjacents[1] ? 2 : 0;
    } else if (
      (this.cy % 0.18 < 0.1 && this.cy % 0.18 > 0.08 && Math.random() > 0.99) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[2] ? 3 : !adjacents[3] ? 4 : 0;
    } else if (
      (this.cz % 0.18 < 0.1 && this.cz % 0.18 > 0.08 && Math.random() > 0.99) ||
      this.dir === 0
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[4] ? 5 : !adjacents[5] ? 6 : 0;
    }

    if (this.birthTimer <= 0) {
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
        simulationState.spawnSheep(
          x * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
          y * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
          z * (halfTileSize * 2) + halfTileSize - 0.9 * scaleModifier,
        );
      this.birthTimer = 2000;
    } else {
      this.birthTimer -= 1 * sheepBirthSpeed * m;
    }
  }

  if (adjacents[this.dir - 1]) this.dir = 0;

  this.move(m, sheepSpeed * sheepSpeedMultiplier);
};
