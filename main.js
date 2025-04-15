import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Load car model
const loader = new GLTFLoader();
loader.load(
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SimpleCar/glTF-Binary/SimpleCar.glb',
  gltf => {
    const car = gltf.scene;
    car.scale.set(1.5, 1.5, 1.5);
    car.position.y = 0.1;
    scene.add(car);

    animate(car);
  },
  undefined,
  err => {
    console.error('Error loading GLB model:', err);
  }
);

// Movement state
const keys = {};
let velocity = 0;
const accel = 0.01;
const maxSpeed = 0.5;
const friction = 0.98;
let turnVelocity = 0;
const turnAccel = 0.002;
const turnFriction = 0.9;
const maxTurn = 0.05;

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Animate with car
function animate(car) {
  requestAnimationFrame(() => animate(car));

  if (keys["ArrowUp"]) velocity -= accel;
  if (keys["ArrowDown"]) velocity += accel;
  velocity = Math.max(-maxSpeed, Math.min(maxSpeed, velocity));
  velocity *= friction;

  if (keys["ArrowLeft"]) turnVelocity -= turnAccel;
  else if (keys["ArrowRight"]) turnVelocity += turnAccel;
  else turnVelocity *= turnFriction;

  turnVelocity = Math.max(-maxTurn, Math.min(maxTurn, turnVelocity));

  if (Math.abs(velocity) > 0.001) {
    car.rotation.y += turnVelocity * (velocity < 0 ? -1 : 1);
  }

  car.translateZ(velocity);

  // Camera follows car
  camera.position.x = car.position.x + Math.sin(car.rotation.y) * 10;
  camera.position.z = car.position.z + Math.cos(car.rotation.y) * 10;
  camera.position.y = car.position.y + 5;
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}
