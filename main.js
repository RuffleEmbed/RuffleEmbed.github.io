import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(ambient, sun);

// Ground plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Movement
let keys = {};
let velocity = 0;
const accel = 0.01;
const maxSpeed = 0.5;
const friction = 0.98;

let turnVelocity = 0;
const turnAccel = 0.002;
const turnFriction = 0.9;
const maxTurn = 0.05;

let car = null;

// Load GLB car model
const loader = new GLTFLoader();
loader.load(
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SimpleCar/glTF-Binary/SimpleCar.glb',
  gltf => {
    car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.position.y = 0.1;
    scene.add(car);
  },
  undefined,
  err => console.error('Error loading model:', err)
);

// Controls
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Animate loop
function animate() {
  requestAnimationFrame(animate);

  if (car) {
    if (keys["ArrowUp"]) velocity -= accel;
    if (keys["ArrowDown"]) velocity += accel;
    velocity *= friction;
    velocity = Math.max(-maxSpeed, Math.min(maxSpeed, velocity));

    if (keys["ArrowLeft"]) {
      turnVelocity -= turnAccel;
    } else if (keys["ArrowRight"]) {
      turnVelocity += turnAccel;
    } else {
      turnVelocity *= turnFriction;
    }

    turnVelocity = Math.max(-maxTurn, Math.min(maxTurn, turnVelocity));

    if (Math.abs(velocity) > 0.001) {
      car.rotation.y += turnVelocity * (velocity < 0 ? -1 : 1);
    }

    car.translateZ(velocity);

    // Camera follow
    camera.position.x = car.position.x + Math.sin(car.rotation.y) * 10;
    camera.position.z = car.position.z + Math.cos(car.rotation.y) * 10;
    camera.position.y = car.position.y + 5;
    camera.lookAt(car.position);
  }

  renderer.render(scene, camera);
}

animate();
