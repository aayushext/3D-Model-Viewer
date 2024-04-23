import * as THREE from "three";

import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    20
  );
  camera.position.z = 2.5;

  // scene

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xa0a0a0);
  scene.background = new THREE.Color(0xeeeeee);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 2000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.9);
  camera.add(pointLight);
  scene.add(camera);

  new MTLLoader()
    .setPath("models/")
    .load("Kinetic-Sculpture.mtl", function (materials) {
      materials.preload();

      new OBJLoader()
        .setMaterials(materials)
        .setPath("models/")
        .load("Kinetic-Sculpture.obj", function (object) {
          object.translateX(-0.2);
          object.scale.setScalar(2);
          object.rotateX(Math.PI / 2);
          object.rotateZ(-Math.PI / 2);
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.geometry.computeVertexNormals();
            }
          });
          scene.add(object);
        });
    });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 5;

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
