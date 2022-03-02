const scaleModifier = gridQuant / baseGridQuant;
const bound = halfWorldDimension * scaleModifier;
const idxModifier = 10 / 1.8;

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
      xIdx: Math.floor((cx + bound) * idxModifier),
      yIdx: Math.floor((cy + bound) * idxModifier),
      zIdx: Math.floor((cz + bound) * idxModifier),
      dir: util.randIntRange(1, 6),
    });

    this.sheep.push(s);
    this.grid[`${s.xIdx},${s.yIdx},${s.zIdx}`] = s;
    this.currId++;
  },

  spawnWolf: function (cx, cy, cz) {
    const w = new Wolf({
      id: this.currId,
      cx: cx,
      cy: cy,
      cz: cz,
      xIdx: Math.floor((cx + bound) * idxModifier),
      yIdx: Math.floor((cy + bound) * idxModifier),
      zIdx: Math.floor((cz + bound) * idxModifier),
      dir: util.randIntRange(1, 6),
    });

    this.wolves.push(w);
    this.grid[`${w.xIdx},${w.yIdx},${w.zIdx}`] = w;
    this.currId++;
  },

  updateAnimals: function (m = 1) {
    for (let i = 0; i < simulationState.sheep.length; i++) {
      simulationState.sheep[i].update(m);
    }

    for (let i = 0; i < simulationState.wolves.length; i++) {
      simulationState.wolves[i].update(m);
    }
  },

  drawAnimals: function (ctm) {
    ctm = mult(
      ctm,
      scalem(
        baseGridQuant / gridQuant,
        baseGridQuant / gridQuant,
        baseGridQuant / gridQuant,
      ),
    );

    swapColor(sheepColors);

    for (let i = 0; i < simulationState.sheep.length; i++) {
      const currLoc = simulationState.sheep[i].getPos();
      ctm1 = mult(ctm, translate(currLoc.cx, currLoc.cy, currLoc.cz));

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
      gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }

    swapColor(wolfColors);

    for (let i = 0; i < simulationState.wolves.length; i++) {
      const currLoc = simulationState.wolves[i].getPos();
      ctm1 = mult(ctm, translate(currLoc.cx, currLoc.cy, currLoc.cz));

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
      gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }
  },

  swapIndex: function (oldIdx, newIdx, a) {
    delete this.grid[`${oldIdx.cx},${oldIdx.cy},${oldIdx.cz}`];
    this.grid[`${newIdx.cx},${newIdx.cy},${newIdx.cz}`] = a;
  },

  rebuildGrid: function () {},
};
