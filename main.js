import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://skhdesewdziqujemittx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNraGRlc2V3ZHppcXVqZW1pdHR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDc0MTczNCwiZXhwIjoyMDYwMzE3NzM0fQ.kZBOW2U2i7Gkz6dv7_uZ-hBYPxGPY-8s8nt7XhiWSpU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let playerId = localStorage.getItem('playerId');
if (!playerId) {
  playerId = '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('playerId', playerId);
}


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

// Cube (Car)
const cubeGeometry = new THREE.BoxGeometry(2, 1, 4);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
scene.add(cube);

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

  // Acceleration / Braking
  if (keys["ArrowUp"]) velocity -= acceleration;
  if (keys["ArrowDown"]) velocity += acceleration;

  // Clamp speed
  velocity = Math.max(-maxSpeed, Math.min(maxSpeed, velocity));
  velocity *= friction;

  // Steering with smooth turn acceleration
  if (keys["ArrowRight"]) {
    turnVelocity += turnAcceleration;
  } else if (keys["ArrowLeft"]) {
    turnVelocity -= turnAcceleration;
  } else {
    turnVelocity *= turnFriction; // Let steering relax
  }

  // Clamp turn velocity
  turnVelocity = Math.max(-maxTurnSpeed, Math.min(maxTurnSpeed, turnVelocity));

  // Apply turning only if moving
  if (Math.abs(velocity) > 0.001) {
    cube.rotation.y += turnVelocity * (velocity < 0 ? -1 : 1);
  }

  // Move car
  cube.translateZ(velocity);

  // Follow camera
  camera.position.x = cube.position.x + Math.sin(cube.rotation.y) * 10;
  camera.position.z = cube.position.z + Math.cos(cube.rotation.y) * 10;
  camera.position.y = cube.position.y + 5;
  camera.lookAt(cube.position);

  renderer.render(scene, camera);
}

animate();
