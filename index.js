import * as THREE from "./threejs/threejs/build/three.module.js"
import { GLTFLoader } from "./threejs/threejs/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./threejs/threejs/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "./threejs/threejs/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "./threejs/threejs/examples/jsm/geometries/TextGeometry.js";
var scene,FRcamera,TPcamera,renderer,x,y,z,orbitControls,spaceship,spotLight;
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;

const init=()=>{
scene = new THREE.Scene();
let w = window.innerWidth;
let h = window.innerHeight;
let aspect=w/h;
let fov=75;
let near=0.1;
let far=10000;
FRcamera= new THREE.PerspectiveCamera(fov,aspect,near,far);
TPcamera = new THREE.PerspectiveCamera(90, aspect, near, far);
renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h);
renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);
FRcamera.position.set(640,480,240);
FRcamera.lookAt(640,320,0);
TPcamera.position.set(100, 336, 44);
TPcamera.lookAt(100, 336, 44);
TPcamera.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI / 2);
orbitControls = new OrbitControls(TPcamera, renderer.domElement);
orbitControls.autoRotate=true;
const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);
scene.add(ambientLight);
createObject();
loadSpaceshipModel();
// generateBoxes();
}

const render=()=>{
requestAnimationFrame(render);
// orbitControls.update();
renderer.render(scene,TPcamera);
}


window.onload=()=>{
init();
render();
addListener();
}


window.onresize=()=>{
let w = window.innerWidth;
let h = window.innerHeight;
let aspect = w / h;
renderer.setSize(w, h);
FRcamera.aspect=aspect;
FRcamera.updateProjectionMatrix();
TPcamera.aspect = aspect;
TPcamera.updateProjectionMatrix();
}
const createObject=()=>{
let pointLight = new THREE.PointLight("#FFFFFF",1,1280,0);
pointLight.position.set(640,320,0);
spotLight = new THREE.SpotLight("#FFFFFF",1,8);
spotLight.position.set(100, 326, 60);
sun = createSun(
  40,
  "#FFFFFF",
  false,
  false,
  "./assets/textures/sun.jpg"
);
mercury = createSphere(
  3.2,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/mercury.jpg"
);
venus = createSphere(
  4.8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/venus.jpg"
);
earth = createSphere(
  4.8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/earth.jpg"
);
mars = createSphere(
  4,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/mars.jpg"
);
jupiter = createSphere(
  13,
   "#FFFFFF",
    true,
    true,
    "./assets/textures/jupiter.jpg");
saturn = createSphere(
  10,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/saturn.jpg"
);
uranus = createSphere(
  8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/uranus.jpg"
);
neptune = createSphere(
  6,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/neptune.jpg"
);
let uranusring = createRing(
  16,
  20,
  64,
  "#FFFFFF",
  true,
  false,
  "./assets/textures/uranus_ring.png"
);
let saturnring = createRing(
  16,
  32,
  64,
  "#FFFFFF",
  true,
  false,
  "./assets/textures/saturn_ring.png"
);
let satelite = createCylinder(
  1,
  0.5,
  0.4,
  8,
  "#FFFFFF",
  0.5,
  0.5,
  true,
  false,
);
let skyGeo= new THREE.BoxGeometry(4260,4260,4260);
let loader = new THREE.TextureLoader();
let skyMat = [
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/back.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/bottom.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/cubemap.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/front.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/left.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/right.png"),
    side: THREE.BackSide,
  }),
  new THREE.MeshBasicMaterial({
    map: loader.load("./assets/skybox/top.png"),
    side: THREE.BackSide,
  }),
];
let skyBox=new THREE.Mesh(skyGeo,skyMat);

sun.position.set(640,320,0);
mercury.position.set(58,320,0)
venus.position.set(80, 320, 0);
earth.position.set(100, 320, 0);
mars.position.set(130, 320, 0);
jupiter.position.set(175, 320, 0);
saturn.position.set(240,320,0);
uranus.position.set(280,320,0);
neptune.position.set(320, 320, 0);
uranusring.position.set(240,320,0);
saturnring.position.set(280, 320, 0);
uranusring.rotation.set(-Math.PI / 2,0,0);
saturnring.rotation.set(-Math.PI / 2, 0, 0);
satelite.position.set(100+8,320,0);
let objects=[pointLight,spotLight,sun,mercury,venus,earth,mars,jupiter,saturn,uranus,neptune,saturnring,uranusring,satelite,skyBox];
objects.forEach(element => {
    scene.add(element);
});

}
const createSun = (radius, color, receive, cast, picture) => {
  let loader = new THREE.TextureLoader();
  let image = loader.load(picture);
  let geometry = new THREE.SphereGeometry(radius);
  let material = new THREE.MeshBasicMaterial({
    color: color,
    map: image,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = receive;
  mesh.castShadow = cast;
  return mesh;
};
const createSphere = (radius,color,receive,cast,picture) => {
  let loader = new THREE.TextureLoader();
  let image = loader.load(picture);
  let geometry = new THREE.SphereGeometry(radius);
  let material = new THREE.MeshStandardMaterial({
    color: color,
    map:image
  });
  let mesh = new THREE.Mesh(geometry,material);
  mesh.receiveShadow=receive;
  mesh.castShadow=cast;
  return mesh;
};
const createRing = (inner, outer, segment, color, receive, cast, picture) => {
  let loader = new THREE.TextureLoader();
  let image = loader.load(picture);
  let geometry = new THREE.RingGeometry(inner, outer, segment);
  let material = new THREE.MeshStandardMaterial({
    color: color,
    map: image,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = receive;
  mesh.castShadow = cast;
  return mesh;
};
const loadSpaceshipModel=()=>{
  const loader = new GLTFLoader();
  loader.load(
    "./assets/model/spaceship/scene.gltf",
    (gltf) => {
      spaceship = gltf.scene;
      spaceship.position.set(100, 320, 44); 
      spaceship.scale.set(1, 1, 1); 
      spaceship.rotation.y = Math.PI / 2;
      spaceship.castShadow = true;
      spaceship.receiveShadow = true;
      scene.add(spaceship);
    });
}
const createCylinder = (top, bottom, height, segment,color,metalness,roughness,receive,cast) => {
  let geometry = new THREE.CylinderGeometry(top, bottom, height, segment);
  let material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: metalness,
    roughness: roughness,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = receive;
  mesh.castShadow = cast;
  return mesh;
};

let keyListener=event=>{
  let keycode=event.keyCode;
  if (keycode == 87) {
    spaceship.position.x += 1;
    TPcamera.position.x += 1;
    spotLight.position.x += 1;
  } else if (keycode == 83) {
    spaceship.position.x -= 1;
    TPcamera.position.x -= 1;
    spotLight.position.x -= 1;
  } else if (keycode == 65) {
    spaceship.position.z -= 1;
    TPcamera.position.z -= 1;
    spotLight.position.z -= 1;
  } else if (keycode == 68) {
    spaceship.position.z += 1;
    TPcamera.position.z += 1;
    spotLight.position.z += 1;
  } else if (keycode == 32) {
    spaceship.position.y += 1;
    TPcamera.position.y += 1;
    spotLight.position.y += 1;
  } else if (keycode == 8) {
    spaceship.position.y -= 1;
    TPcamera.position.y -= 1;
    spotLight.position.y -= 1;
  }
  orbitControls.target=spaceship.position;
  TPcamera.lookAt(spaceship.position);

}
let addListener=_=>{
  document.addEventListener("keydown",keyListener);
}
// let generateBoxes=()=>{
//   for (let index = 0; index <3; index++) {
//     const geometry= new THREE.BoxGeometry(2,2,2);
//     const material = new THREE.MeshBasicMaterial({
//       color:0xff0000
//     });
//     const mesh = new THREE.Mesh(geometry,material);
//     mesh.position.x=index-1*5;
//     scene.add(mesh);
//   }
// }
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.onmousemove = event =>{
  console.log(mouse);
  console.log(scene.children);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientX / window.innerWidth) * 2 + 1;
  raycaster.setFromCamera(mouse,FRcamera);
  const planet=raycaster.intersectObjects(scene.children);
  if(planet.length>0){
  const object = planet[0].object;
  if(object == sun){
    createText("sun", {x:640,y:400,z:0});
  }
  if(object == mercury){
    createText("mercury", { x: 58, y: 400, z: 0 });
  }
  if (object == venus) {
    createText("venus", { x: 80, y: 400, z: 0 });
  }
  if (object == earth) {
    createText("earth", { x: 100, y: 400, z: 0 });
  }
  if (object == mars) {
    createText("mars", { x: 130, y: 400, z: 0 });
  }
  if (object == jupiter) {
    createText("jupiter", { x: 175, y: 400, z: 0 });
  }
  if (object == saturn) {
    createText("saturn", { x: 240, y: 400, z: 0 });
  }
  if (object == uranus) {
    createText("uranus", { x: 280, y: 400, z: 0 });
  }
  if (object == neptune) {
    createText("neptune", { x: 320, y: 400, z: 0 });
  }
}
}

const createText = (planet, position) => {
  const loader = new FontLoader();
  loader.load("./assets/fonts/helvetiker_regular.typeface.json", (font) => {
    const geometry = new TextGeometry(planet, {
      font: font,
      size: 10,
      height: 1,
    });
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh); 
  });
};

