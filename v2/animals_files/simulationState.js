const simulationState = {
  sheep: [],
  wolves: [],
  grid: new Object(), // Use hashtable 'x,y,z' key format instead of 3D array

  spawnSheep: function (cx, cy, cz) {
    if (
      this.sheep.length + this.wolves.length >=
      gridQuant * gridQuant * gridQuant
    )
      return;

    const s = new Sheep({
      cx: cx,
      cy: cy,
      cz: cz,
      xIdx: Math.floor((cx + bound) * idxModifier),
      yIdx: Math.floor((cy + bound) * idxModifier),
      zIdx: Math.floor((cz + bound) * idxModifier),
      isSheep: true,
      dir: util.randIntRange(1, 6),
      birthTimer: util.randIntRange(0, 1000), // Randomize so its not completely synced
      isDead: false,
    });

    this.sheep.push(s);
    this.grid[`${s.xIdx},${s.yIdx},${s.zIdx}`] = s;
  },

  spawnWolf: function (cx, cy, cz) {
    if (
      this.sheep.length + this.wolves.length >=
      gridQuant * gridQuant * gridQuant
    )
      return;

    const w = new Wolf({
      cx: cx,
      cy: cy,
      cz: cz,
      xIdx: Math.floor((cx + bound) * idxModifier),
      yIdx: Math.floor((cy + bound) * idxModifier),
      zIdx: Math.floor((cz + bound) * idxModifier),
      isSheep: false,
      dir: util.randIntRange(1, 6),
      nextBirth: 10,
      starvation: 2000,
      isDead: false,
    });

    this.wolves.push(w);
    this.grid[`${w.xIdx},${w.yIdx},${w.zIdx}`] = w;
  },

  updateAnimals: function (m = 1) {
    for (let i = this.sheep.length - 1; i >= 0; i--) {
      if (this.sheep[i].isDead) {
        delete this.grid[
          `${this.sheep[i].xIdx},${this.sheep[i].yIdx},${this.sheep[i].zIdx}`
        ];
        this.sheep.splice(i, 1);
      } else this.sheep[i].update(m);
    }

    for (let i = this.wolves.length - 1; i >= 0; i--) {
      if (this.wolves[i].isDead) {
        delete this.grid[
          `${this.wolves[i].xIdx},${this.wolves[i].yIdx},${this.wolves[i].zIdx}`
        ];
        this.wolves.splice(i, 1);
      } else this.wolves[i].update(m);
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
      const ctm1 = mult(ctm, translate(currLoc.cx, currLoc.cy, currLoc.cz));

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
      gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }

    swapColor(wolfColors);

    for (let i = 0; i < simulationState.wolves.length; i++) {
      const currLoc = simulationState.wolves[i].getPos();
      const ctm1 = mult(ctm, translate(currLoc.cx, currLoc.cy, currLoc.cz));

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(mvLoc, false, flatten(ctm1));
      gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    }
  },

  swapIndex: function (oldIdx, a) {
    delete this.grid[`${oldIdx.cx},${oldIdx.cy},${oldIdx.cz}`];
    this.grid[`${a.xIdx},${a.yIdx},${a.zIdx}`] = a;
  },
};
