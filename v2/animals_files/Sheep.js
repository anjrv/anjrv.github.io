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
Sheep.isSheep = true;

Sheep.prototype.update = function (m = 1) {
  // Check for wolf
  let nearestWolf = 0;

  for (let i = 1; nearestWolf === 0 && i < sheepPanicRange; i++) {
    if (
      simulationState.grid[
        `${(this.xIdx + i) % gridQuant},${this.yIdx},${this.zIdx}`
      ] &&
      simulationState.grid[
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
  let adjacents = [];
  if (collision) {
    adjacents = [
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
  }

  const directionOffsets = [
    this.cx,
    this.cx,
    this.cy,
    this.cy,
    this.cz,
    this.cz,
  ];

  if (nearestWolf !== 0) {
    // Panic
    const preferredDirection =
      nearestWolf % 2 === 0 ? nearestWolf - 1 : nearestWolf + 1;

    if (
      !adjacents[preferredDirection - 1] &&
      directionOffsets[preferredDirection - 1] % 0.18 < 0.1 &&
      directionOffsets[preferredDirection - 1] % 0.18 > 0.08
    ) {
      this.dir = preferredDirection;
    } else if (adjacents[preferredDirection - 1]) {
      this.dir = 0;
    }
  } else {
    // Wander
    if (this.cx % 0.18 < 0.1 && this.cx % 0.18 > 0.08 && Math.random() > 0.99) {
      this.dir =
        Math.random() > 0.5 && !adjacents[0] ? 1 : !adjacents[1] ? 2 : 0;
    } else if (
      this.cy % 0.18 < 0.1 &&
      this.cy % 0.18 > 0.08 &&
      Math.random() > 0.99
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[2] ? 3 : !adjacents[3] ? 4 : 0;
    } else if (
      this.cz % 0.18 < 0.1 &&
      this.cz % 0.18 > 0.08 &&
      Math.random() > 0.99
    ) {
      this.dir =
        Math.random() > 0.5 && !adjacents[4] ? 5 : !adjacents[5] ? 6 : 0;
    }
  }

  this.move(m, sheepSpeed * sheepSpeedMultiplier);
};
