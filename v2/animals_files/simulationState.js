const simulationState = {
  currId: 0,
  sheep: [],
  wolves: [],
  grid: [], // Use hashtable 'x,y,z' key format instead of 3D array

  spawnSheep: function (cx, cy, cz) {
    const s = new Sheep({
      id: this.currId,
      cx: cx,
      cy: cy,
      cz: cz,
      dir: util.randIntRange(1, 6),
    });

    this.sheep.push(s);
    this.grid[
      `${(cx + halfWorldDimension) / gridQuant},${
        (cy + halfWorldDimension) / gridQuant
      },${(cz + halfWorldDimension) / gridQuant}`
    ] = s;

    this.currId++;
  },

  spawnWolf: function (cx, cy, cz) {
    const w = new Wolf({
      id: this.currId,
      cx: cx,
      cy: cy,
      cz: cz,
      dir: util.randIntRange(1, 6),
    });

    this.wolves.push(w);
    this.grid[
      `${(cx + halfWorldDimension) / gridQuant},${
        (cy + halfWorldDimension) / gridQuant
      },${(cz + halfWorldDimension) / gridQuant}`
    ] = w;

    this.currId++;
  },
};
