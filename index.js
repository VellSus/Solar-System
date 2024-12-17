import * as THREE from "./threejs/threejs/build/three.module.js"
import { GLTFLoader } from "./threejs/threejs/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./threejs/threejs/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "./threejs/threejs/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "./threejs/threejs/examples/jsm/geometries/TextGeometry.js";
var scene,
  FRcamera,
  TPcamera,
  renderer,
  x,
  y,
  z,
  orbitControls,
  spaceship,
  spotLight,
  currentPlanet;
let sun,
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  uranusring,
  saturnring,
  satelite,
  textMesh = null,
  hoveredObject = null,
  originalColor = null;
  let orbitingObjects = []; // Array to store objects that orbit around the Sun
  let angles = {}; 

var speed = 0.05;
var rotate = 0.005;

var keyPressed = {
  w: false,
  a: false,
  d: false,
  space: false,
  s: false,
};

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
}

const render=()=>{
requestAnimationFrame(render);
renderer.render(scene,TPcamera);
animate();
}


window.onload=()=>{
init();
render();
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
sun.name = "Sun";
mercury = createSphere(
  3.2,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/mercury.jpg"
);
mercury.name="Mercury";
venus = createSphere(
  4.8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/venus.jpg"
);
venus.name="Venus";
earth = createSphere(
  4.8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/earth.jpg"
);
earth.name="Earth";
mars = createSphere(
  4,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/mars.jpg"
);
mars.name="Mars";
jupiter = createSphere(
  13,
   "#FFFFFF",
    true,
    true,
    "./assets/textures/jupiter.jpg");
  jupiter.name="Jupiter";
saturn = createSphere(
  10,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/saturn.jpg"
);
saturn.name="Saturn";
uranus = createSphere(
  8,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/uranus.jpg"
);
uranus.name="Uranus";
neptune = createSphere(
  6,
  "#FFFFFF",
  true,
  true,
  "./assets/textures/neptune.jpg"
);
neptune.name="Neptune";
uranusring = createRing(
  16,
  20,
  64,
  "#FFFFFF",
  true,
  false,
  "./assets/textures/uranus_ring.png"
);
saturnring = createRing(
  16,
  32,
  64,
  "#FFFFFF",
  true,
  false,
  "./assets/textures/saturn_ring.png"
);
satelite = createCylinder(
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

orbitingObjects.push(
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  saturnring,
  uranusring,
  satelite
);
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

const updateCamera = () => {
  if (!spaceship) return;

  const distanceBehind = 40;
  const heightAbove = 10;

  const offset = new THREE.Vector3(0, heightAbove, -distanceBehind);

  offset.applyQuaternion(spaceship.quaternion);
  TPcamera.position.copy(spaceship.position).add(offset);

  let lookOffset = new THREE.Vector3().copy(spaceship.position);
  // lookOffset.y += 0.5;

  TPcamera.lookAt(lookOffset);
};



const animate = () => {
  if(!spaceship){
    return;
  }
  if (keyPressed.w) {
    moveForward();
  }

  if (keyPressed.a) {
    rotateLeft();
  }

  if (keyPressed.d) {
    rotateRight();
  }

  if (keyPressed.space) {
    rotateUp();
  }

  if (keyPressed.s) {
    rotateDown();
  }
  orbitingObjects.forEach((object, index) => {
    let radius = 60 + index * 30; 
    let speed = 0.001 + index * 0.0001; 

    if (!angles[object.uuid]) angles[object.uuid] = Math.random() * Math.PI * 2;
    angles[object.uuid] += speed; 
    object.position.x = sun.position.x + radius * Math.cos(angles[object.uuid]);
    object.position.z = sun.position.z + radius * Math.sin(angles[object.uuid]);
      if (textMesh && object.name === currentPlanet) {
        textMesh.position.x = object.position.x-45;
        textMesh.position.y = object.position.y + 30;
        textMesh.position.z = object.position.z;
      }
  });
  uranusring.position.copy(uranus.position); 
  uranusring.rotation.x = -Math.PI / 2;
  saturnring.position.copy(saturn.position); 
  saturnring.rotation.x = -Math.PI / 2;
  satelite.position.x=earth.position.x+8;
  satelite.position.y = earth.position.y
  satelite.position.z = earth.position.z
   if (textMesh && spaceship) {
     textMesh.lookAt(spaceship.position);
   }
  updateCamera();
};

const getRandomColor=()=>{
  let randomColorChoices = [
    "#00FFFF",
    "#00FF00",
    "#FFCC00",
    "#E6E6FA",
    "#FF69B4",
    "#FF8C00",
    "#FFB6C1",
    "#00FFFF",
    "#87CEEB",
    "#A8FFB2",
    "#EE82EE",
    "#ADD8E6",
  ];
  let randomColor=Math.floor(Math.random() * randomColorChoices.length);
  return randomColorChoices[randomColor];
}


const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
window.onmousemove = event =>{
  console.log(mouse);
  console.log(scene.children);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,TPcamera);
  const planet=raycaster.intersectObjects(scene.children);
  if(planet.length>0){
  const object = planet[0].object;
  if (object.material && object.material.color) {
    if (hoveredObject && hoveredObject !== object) {
      hoveredObject.material.color.set(originalColor);
    }

    if (hoveredObject !== object) {
      hoveredObject = object;
      originalColor = object.material.color.getHex();
      object.material.color.set(getRandomColor());
      removeTextOnMouseMove();
    }
  }

  console.log(object.name);
      if (!textMesh || textMesh.name !== object.name) {
  switch (object.name) {
    case "Sun":
      createText("Sun", {
        x: sun.position.x - 15,
        y: sun.position.y + 60,
        z: 0,
      });
      break;
    case "Mercury":
      createText("Mercury", {
        x: mercury.position.x - 15,
        y: mercury.position.y + 10,
        z: mercury.position.z,
      });
      break;
    case "Venus":
      createText("Venus", {
        x: venus.position.x - 15,
        y: venus.position.y + 10,
        z: venus.position.z,
      });
      break;
    case "Earth":
      createText("Earth", {
        x: earth.position.x - 15,
        y: earth.position.y + 10,
        z: earth.position.z,
      });
      break;
    case "Mars":
      createText("Mars", {
        x: mars.position.x - 15,
        y: mars.position.y + 10,
        z: mars.position.z,
      });
      break;
    case "Jupiter":
      createText("Jupiter", {
        x: jupiter.position.x - 20,
        y: jupiter.position.y + 20,
        z: jupiter.position.z,
      });
      break;
    case "Saturn":
      createText("Saturn", {
        x: saturn.position.x - 20,
        y: saturn.position.y + 20,
        z: saturn.position.z,
      });
      break;
    case "Uranus":
      createText("Uranus", {
        x: uranus.position.x - 20,
        y: uranus.position.y + 20,
        z: uranus.position.z,
      });
      break;
    case "Neptune":
      createText("Neptune", {
        x: neptune.position.x - 30,
        y: neptune.position.y + 10,
        z: neptune.position.z,
      });
      break;
    default:
      currentPlanet = null;
  }
}
  }
  else{
      if (hoveredObject) {
          hoveredObject.material.color.set(originalColor);
          hoveredObject = null;
        }
  }
  }

const createText = (planet, position) => {
  if(planet!=currentPlanet){
  let loader = new FontLoader();
  loader.load(
    "./threejs/threejs/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      const geometry = new TextGeometry(planet, {
        font: font,
        size: 10,
        height: 10,
      });
      let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position.x, position.y, position.z);
      removeTextOnMouseMove();
      currentPlanet = planet;
      textMesh = mesh;
      scene.add(mesh);
      mesh.material.color.set(getRandomColor());
    }
  );
}
};
const removeTextOnMouseMove = () => {
  if (textMesh) {
    scene.remove(textMesh); 
    textMesh.geometry.dispose(); 
    textMesh.material.dispose(); 
    textMesh = null; 
  }
};
// window.addEventListener("mousemove", removeTextOnMouseMove);

window.addEventListener("keydown", (event) => {
  if (event.key === "w" || event.key === "W") {
    keyPressed.w = true;
  } else if (event.key === "a" || event.key === "A") {
    keyPressed.a = true;
  } else if (event.key === "d" || event.key === "D") {
    keyPressed.d = true;
  } else if (event.key === " " || event.key === "Spacebar") {
    keyPressed.space = true;
  } else if (event.key === "s" || event.key === "S") {
    keyPressed.s = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "w" || event.key === "W") {
    keyPressed.w = false;
  } else if (event.key === "a" || event.key === "A") {
    keyPressed.a = false;
  } else if (event.key === "d" || event.key === "D") {
    keyPressed.d = false;
  } else if (event.key === " " || event.key === "Spacebar") {
    keyPressed.space = false;
  } else if (event.key === "s" || event.key === "S") {
    keyPressed.s = false;
  }
});

const moveForward = () => {
  const direction = new THREE.Vector3(0, 0, 5); // Arah default "maju"
  direction.applyQuaternion(spaceship.quaternion); // Sesuaikan arah dengan orientasi model
  spaceship.position.add(direction.multiplyScalar(speed));
};

const rotateLeft = () => {
  spaceship.rotation.y += rotate;
};

const rotateRight = () => {
  spaceship.rotation.y -= rotate;
};

const rotateUp = () => {
  spaceship.rotation.x -= rotate;
};

const rotateDown = () => {
  spaceship.rotation.x += rotate;
};


