const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene = createScene();
const map = initMap(scene);
const overhead = new THREE.PerspectiveCamera( 75, canvas.clientWidth/canvas.clientHeight, 0.1, 1000 );
overhead.position.set(map.centerX - 0.5, map.centerY, 22);

const animate = function () {
  requestAnimationFrame(animate);

  renderer.render(scene, overhead);
};

animate();
