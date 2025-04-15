// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x007700 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Cube (Car)
const cubeGeometry = new THREE.BoxGeometry(2, 1, 4);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Camera
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Movement
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function animate() {
  requestAnimationFrame(animate);

  // Basic driving logic
  const speed = 0.2;
  const turnSpeed = 0.03;

  if (keys["ArrowUp"]) cube.translateZ(-speed);
  if (keys["ArrowDown"]) cube.translateZ(speed);
  if (keys["ArrowLeft"]) cube.rotation.y += turnSpeed;
  if (keys["ArrowRight"]) cube.rotation.y -= turnSpeed;

  camera.position.x = cube.position.x + Math.sin(cube.rotation.y) * 10;
  camera.position.z = cube.position.z + Math.cos(cube.rotation.y) * 10;
  camera.lookAt(cube.position);

  renderer.render(scene, camera);
}

animate();
