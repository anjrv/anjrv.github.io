function distance(x, y) {
  const diff = new THREE.Vector3();
  diff.copy(x.position).sub(y.position);
  
  return diff.length();
}