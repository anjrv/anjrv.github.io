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
