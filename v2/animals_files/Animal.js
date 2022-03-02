function Animal() {
  // Unused, this is a wrapper class
}

Animal.prototype.setup = function (attrib) {
  for (const property in attrib) {
    this[property] = attrib[property];
  }
};

Animal.prototype.setPos = function (cx, cy, cz) {
  this.cx = cx;
  this.cy = cy;
  this.cz = cz;
};

Animal.prototype.getPos = function () {
  return { cx: this.cx, cy: this.cy, cz: this.cz };
};

Animal.prototype.getId = function () {
  return this.id;
};

Animal.prototype.move = function (m = 1, speed) {
  let nextX, nextY, nextZ, nextXIdx, nextYIdx, nextZIdx;
  const halfTileSize = 1.8 / gridQuant / 2;
  const scaleModifier = gridQuant / baseGridQuant;
  const lowerBound = -0.9 * scaleModifier + halfTileSize;
  const upperBound = 0.9 * scaleModifier - halfTileSize;

  switch (this.dir) {
    case 1: // Left
      nextX = util.wrapRange(this.cx + speed * m, lowerBound, upperBound);
      nextXIdx = Math.floor((nextX + bound) * idxModifier);
      if (this.xIdx !== nextXIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: nextXIdx, cy: this.yIdx, cz: this.zIdx },
          this,
        );
      }
      this.cx = nextX;
      break;
    case 2: // Right
      nextX = util.wrapRange(this.cx - speed * m, lowerBound, upperBound);
      nextXIdx = Math.floor((nextX + bound) * idxModifier);
      if (this.xIdx !== nextXIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: nextXIdx, cy: this.yIdx, cz: this.zIdx },
          this,
        );
      }
      this.cx = nextX;
      break;
    case 3: // Up
      nextY = util.wrapRange(this.cy + speed * m, lowerBound, upperBound);
      nextYIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.yIdx !== nextYIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: this.xIdx, cy: nextYIdx, cz: this.zIdx },
          this,
        );
      }
      this.cy = nextY;
      break;
    case 4: // Down
      nextY = util.wrapRange(this.cy - speed * m, lowerBound, upperBound);
      nextYIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.YIdx !== nextYIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: this.xIdx, cy: nextYIdx, cz: this.zIdx },
          this,
        );
      }
      this.cy = nextY;
      break;
    case 5: // Forwards
      nextZ = util.wrapRange(this.cz - speed * m, lowerBound, upperBound);
      nextZIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.zIdx !== nextZIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: this.xIdx, cy: this.YIdx, cz: nextZIdx },
          this,
        );
      }
      this.cz = nextZ;
      break;
    case 6: // Backwards
      nextZ = util.wrapRange(this.cz - speed * m, lowerBound, upperBound);
      nextZIdx = Math.floor((nextY + bound) * idxModifier);
      if (this.zIdx !== nextZIdx) {
        simulationState.swapIndex(
          { cx: this.xIdx, cy: this.yIdx, cz: this.zIdx },
          { cx: this.xIdx, cy: this.YIdx, cz: nextZIdx },
          this,
        );
      }
      this.cz = nextZ;
      break;
  }
};

