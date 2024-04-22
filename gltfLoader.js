import * as THREE from "three";

import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let camera, scene, renderer;

init();
render();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    4000
  );
  camera.position.set(-500, 40, 500);
  camera.add(new THREE.PointLight(0xffffff, 250));

  const environment = new RoomEnvironment(renderer);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x606060);
  // scene.environment = pmremGenerator.fromScene(environment).texture;
  // environment.dispose();

  scene.add(new THREE.AmbientLight(0x999999));

  // const grid = new THREE.GridHelper(500, 10, 0xffffff, 0xffffff);
  // grid.material.opacity = 0.5;
  // grid.material.depthWrite = false;
  // grid.material.transparent = true;
  // scene.add(grid);

  // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  // hemiLight.position.set(0, 2000, 0);
  // scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 3);
  dirLight.position.set(-0, 40, 50);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -25;
  dirLight.shadow.camera.left = -25;
  dirLight.shadow.camera.right = 25;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 2000;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  const loader = new GLTFLoader().setPath("models/");
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  loader.setDRACOLoader(dracoLoader);
  loader.load("Kinetic-Sculpture.gltf", function (gltf) {
    let scale = 350;

    gltf.scene.position.z = -75;
    gltf.scene.rotation.x = 1.57;
    gltf.scene.scale.set(scale, scale, scale);

    scene.add(gltf.scene);

    render();
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  // controls.minDistance = 50;
  // controls.maxDistance = 4000;
  // controls.enablePan = false;
  controls.target.set(0, 0, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}
