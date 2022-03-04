function Animal() {
  // Unused, this is a wrapper class
}

Animal.prototype.setup = function (attrib) {
  for (const property in attrib) {
    this[property] = attrib[property];
  }
};

Animal.prototype.getPos = function () {
  return { cx: this.cx, cy: this.cy, cz: this.cz };
};

Animal.prototype.getAdjacents = function () {
  return [
    simulationState.grid[
      `${(this.xIdx + 1) % gridQuant},${this.yIdx},${this.zIdx}`
    ], // Left
    simulationState.grid[
      `${(this.xIdx - 1) % gridQuant},${this.yIdx},${this.zIdx}`
    ], // Right
    simulationState.grid[
      `${this.xIdx},${(this.yIdx + 1) % gridQuant},${this.zIdx}`
    ], // Up
    simulationState.grid[
      `${this.xIdx},${(this.yIdx - 1) % gridQuant},${this.zIdx}`
    ], // Down
    simulationState.grid[
      `${this.xIdx},${this.yIdx},${(this.zIdx + 1) % gridQuant}`
    ], // Back
    simulationState.grid[
      `${this.xIdx},${this.yIdx},${(this.zIdx - 1) % gridQuant}`
    ], // Forward
  ];
};

Animal.prototype.move = function (m = 1, speed) {
  let nextX, nextY, nextZ, nextXIdx, nextYIdx, nextZIdx, oldIdx;
  const halfTileSize = 1.8 / gridQuant / 2;
  const scaleModifier = gridQuant / baseGridQuant;
  const lowerBound = -0.9 * scaleModifier + halfTileSize;
  const upperBound = 0.9 * scaleModifier - halfTileSize;

  switch (this.dir) {
    case 1: // Left
      nextX = util.wrapRange(this.cx + speed * m, lowerBound, upperBound);
      nextXIdx = Math.floor((nextX + bound) * idxModifier);
      if (this.xIdx !== nextXIdx) {
        oldIdx = this.xIdx;
        this.xIdx = nextXIdx;
        simulationState.swapIndex(
          { cx: oldIdx, cy: this.yIdx, cz: this.zIdx },
          this,
        );
      }
      this.cx = nextX;
      break;
    case 2: // Right
      nextX = util.wrapRange(this.cx - speed * m, lowerBound, upperBound);
      nextXIdx = Math.floor((nextX + bound) * idxModifier);
      if (this.xIdx !== nextXIdx) {
        oldIdx = this.xIdx;
        this.xIdx = nextXIdx;
        simulationState.swapIndex(
          { cx: oldIdx, cy: this.yIdx, cz: this.zIdx },
          this,
        );
      }
      this.cx = nextX;
      break;
    case 3: // Up
      nextY = util.wrapRange(this.cy + speed * m, lowerBound, upperBound);
      nextYIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.yIdx !== nextYIdx) {
        oldIdx = this.yIdx;
        this.yIdx = nextYIdx;
        simulationState.swapIndex(
          { cx: this.xIdx, cy: oldIdx, cz: this.zIdx },
          this,
        );
      }
      this.cy = nextY;
      break;
    case 4: // Down
      nextY = util.wrapRange(this.cy - speed * m, lowerBound, upperBound);
      nextYIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.YIdx !== nextYIdx) {
        oldIdx = this.yIdx;
        this.yIdx = nextYIdx;
        simulationState.swapIndex(
          { cx: this.xIdx, cy: oldIdx, cz: this.zIdx },
          this,
        );
      }
      this.cy = nextY;
      break;
    case 5: // Forwards
      nextZ = util.wrapRange(this.cz - speed * m, lowerBound, upperBound);
      nextZIdx = Math.floor((nextZ + bound) * idxModifier);
      if (this.zIdx !== nextZIdx) {
        oldIdx = this.zIdx;
        this.zIdx = nextZIdx;
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: oldIdx },
          this,
        );
      }
      this.cz = nextZ;
      break;
    case 6: // Backwards
      nextZ = util.wrapRange(this.cz + speed * m, lowerBound, upperBound);
      nextZIdx = Math.floor((nextZ + bound) * idxModifier);
      if (this.zIdx !== nextZIdx) {
        oldIdx = this.zIdx;
        this.zIdx = nextZIdx;
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: oldIdx },
          this,
        );
      }
      this.cz = nextZ;
      break;
  }

  // Cheat
  if (
    this.cx < lowerBound ||
    this.cx > upperBound ||
    this.cy < lowerBound ||
    this.cy > upperBound ||
    this.cz < lowerBound ||
    this.cz > upperBound
  ) {
    this.isDead = true;
  }
};
