// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Grid helper (optional)
const grid = new THREE.GridHelper(100, 100);
scene.add(grid);

// Plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

let car; // Will hold the loaded model

const loader = new THREE.GLTFLoader();
loader.load('/car.glb', (gltf) => {
  car = gltf.scene;
  car.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
  car.position.set(0, 0, 0);
  scene.add(car);
}, undefined, (error) => {
  console.error('Error loading model:', error);
});


// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// Camera
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Movement state
let keys = {};
let velocity = 0;
let acceleration = 0.01;
let maxSpeed = 0.5;
let friction = 0.98;

let turnVelocity = 0;
let turnAcceleration = 0.002;
let turnFriction = 0.9;
let maxTurnSpeed = 0.05;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function animate() {
    requestAnimationFrame(animate);
  
    if (!car) return; // Wait until car is loaded
  
    // Acceleration / Braking
    if (keys["ArrowUp"]) velocity -= acceleration;
    if (keys["ArrowDown"]) velocity += acceleration;
    velocity = Math.max(-maxSpeed, Math.min(maxSpeed, velocity));
    velocity *= friction;
  
    // Steering with smooth turn acceleration
    if (keys["ArrowRight"]) {
      turnVelocity += turnAcceleration;
    } else if (keys["ArrowLeft"]) {
      turnVelocity -= turnAcceleration;
    } else {
      turnVelocity *= turnFriction;
    }
  
    turnVelocity = Math.max(-maxTurnSpeed, Math.min(maxTurnSpeed, turnVelocity));
  
    if (Math.abs(velocity) > 0.001) {
      car.rotation.y += turnVelocity * (velocity < 0 ? -1 : 1);
    }
  
    // Move car
    car.translateZ(velocity);
  
    // Follow camera
    camera.position.x = car.position.x + Math.sin(car.rotation.y) * 10;
    camera.position.z = car.position.z + Math.cos(car.rotation.y) * 10;
    camera.position.y = car.position.y + 5;
    camera.lookAt(car.position);
  
    renderer.render(scene, camera);
  }
  

animate();
