import * as THREE from "./threejs/threejs/build/three.module.js";
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

const init = () => {
  scene = new THREE.Scene();
  let w = window.innerWidth;
  let h = window.innerHeight;
  let aspect = w / h;
  let fov = 75;
  let near = 0.1;
  let far = 10000;
  FRcamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  TPcamera = new THREE.PerspectiveCamera(90, aspect, near, far);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  FRcamera.position.set(640, 480, 240);
  FRcamera.lookAt(640, 320, 0);
  TPcamera.position.set(100, 336, 44);
  TPcamera.lookAt(100, 336, 44);
  TPcamera.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI / 2);
  orbitControls = new OrbitControls(TPcamera, renderer.domElement);
  orbitControls.autoRotate = true;
  // const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);
  // scene.add(ambientLight);
  createObject();
  loadSpaceshipModel();
};

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, TPcamera);
  animate();
};

window.onload = () => {
  init();
  render();
};

window.onresize = () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let aspect = w / h;
  renderer.setSize(w, h);
  FRcamera.aspect = aspect;
  FRcamera.updateProjectionMatrix();
  TPcamera.aspect = aspect;
  TPcamera.updateProjectionMatrix();
};
const createObject = () => {
  let pointLight = new THREE.PointLight("#FFFFFF", 1, 1280, 0);
  pointLight.position.set(640, 320, 0);
  spotLight = new THREE.SpotLight("#FFFFFF", 8, 8);
  spotLight.position.set(100, 326, 60);
  sun = createSun(40, "#FFFFFF", false, false, "./assets/textures/sun.jpg");
  sun.name = "Sun";
  mercury = createSphere(
    3.2,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/mercury.jpg"
  );
  mercury.name = "Mercury";
  venus = createSphere(
    4.8,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/venus.jpg"
  );
  venus.name = "Venus";
  earth = createSphere(
    4.8,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/earth.jpg"
  );
  earth.name = "Earth";
  mars = createSphere(4, "#FFFFFF", true, true, "./assets/textures/mars.jpg");
  mars.name = "Mars";
  jupiter = createSphere(
    13,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/jupiter.jpg"
  );
  jupiter.name = "Jupiter";
  saturn = createSphere(
    10,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/saturn.jpg"
  );
  saturn.name = "Saturn";
  uranus = createSphere(
    8,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/uranus.jpg"
  );
  uranus.name = "Uranus";
  neptune = createSphere(
    6,
    "#FFFFFF",
    true,
    true,
    "./assets/textures/neptune.jpg"
  );
  neptune.name = "Neptune";
  uranusring = createRing(
    16,
    20,
    64,
    "#FFFFFF",
    true,
    false,
    "./assets/textures/uranus_ring.png"
  );
  uranusring.name="Uranus Ring";
  saturnring = createRing(
    16,
    32,
    64,
    "#FFFFFF",
    true,
    false,
    "./assets/textures/saturn_ring.png"
  );
  saturnring.name="Saturn Ring"
  satelite = createCylinder(1, 0.5, 0.4, 8, "#FFFFFF", 0.5, 0.5, true, false);
  satelite.name="Satelite";
  let skyGeo = new THREE.BoxGeometry(4260, 4260, 4260);
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
  let skyBox = new THREE.Mesh(skyGeo, skyMat);

  sun.position.set(640, 320, 0);
  mercury.position.set(58, 320, 0);
  venus.position.set(80, 320, 0);
  earth.position.set(100, 320, 0);
  mars.position.set(130, 320, 0);
  jupiter.position.set(175, 320, 0);
  saturn.position.set(240, 320, 0);
  uranus.position.set(280, 320, 0);
  neptune.position.set(320, 320, 0);
  uranusring.position.set(240, 320, 0);
  saturnring.position.set(280, 320, 0);
  uranusring.rotation.set(-Math.PI / 2, 0, 0);
  saturnring.rotation.set(-Math.PI / 2, 0, 0);
  satelite.position.set(100 + 8, 320, 0);

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
    satelite,
  );
  let objects = [
    pointLight,
    spotLight,
    sun,
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
    satelite,
    skyBox,
  ];
  objects.forEach((element) => {
    scene.add(element);
  });
};
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
const createSphere = (radius, color, receive, cast, picture) => {
  let loader = new THREE.TextureLoader();
  let image = loader.load(picture);
  let geometry = new THREE.SphereGeometry(radius);
  let material = new THREE.MeshStandardMaterial({
    color: color,
    map: image,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = receive;
  mesh.castShadow = cast;
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

  mesh.rotation.set(-Math.PI / 2, 0, 0);

  return mesh;
};
const loadSpaceshipModel = () => {
  const loader = new GLTFLoader();
  loader.load("./assets/model/spaceship/scene.gltf", (gltf) => {
    spaceship = gltf.scene;
    spaceship.position.set(50, 320, 0);
    spaceship.scale.set(1, 1, 1);
    spaceship.rotation.y = Math.PI / 2;
    spaceship.castShadow = true;
    spaceship.receiveShadow = true;
    scene.add(spaceship);
  });
};
const createCylinder = (
  top,
  bottom,
  height,
  segment,
  color,
  metalness,
  roughness,
  receive,
  cast
) => {
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

  TPcamera.lookAt(lookOffset);
};

let planetSpeed = 0.0005;
let acceleration = 0.00005;
let deceleration = 0.00001;
let isClicked = false;
let lastClickedTime = 0;
let clickedPlanet = null;
let sunRotationSpeed = 0.01;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, TPcamera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    clickedPlanet = intersects[0].object;
    if (clickedPlanet == sun) {
      isClicked = true;
      if(sunRotationSpeed==0.05){
        sunRotationSpeed=0.01;
        isClicked=false;
      }else{
      sunRotationSpeed = 0.05;
      }
      lastClickedTime = Date.now();
    }else{

    isClicked = true;
    lastClickedTime = Date.now();
    }
    
  }
});

const animate = () => {
  if (!spaceship) return;

  if (keyPressed.w) moveForward();
  if (keyPressed.a) rotateLeft();
  if (keyPressed.d) rotateRight();
  if (keyPressed.space) rotateUp();
  if (keyPressed.s) rotateDown();

  if (isClicked && clickedPlanet &&clickedPlanet!=sun ) {
    const timeSinceLastClick = Date.now() - lastClickedTime;
    sunRotationSpeed=0.01;
    clickedPlanet.revolutionSpeed =
      (clickedPlanet.revolutionSpeed || planetSpeed) + acceleration;
    clickedPlanet.rotationSpeed =
      (clickedPlanet.rotationSpeed || 0.1) + acceleration;

    if (timeSinceLastClick > 5000) {
      isClicked = false;
      clickedPlanet.revolutionSpeed = planetSpeed;
      clickedPlanet.rotationSpeed = 0.01;
    }
  } else if (clickedPlanet && clickedPlanet != sun) {
    if (clickedPlanet.revolutionSpeed > planetSpeed) {
      clickedPlanet.revolutionSpeed -= deceleration;
    }
    if (clickedPlanet.rotationSpeed > 0.01) {
      clickedPlanet.rotationSpeed -= deceleration;
    }
  } else if (clickedPlanet == sun && isClicked) {
    const timeSinceLastClick = Date.now() - lastClickedTime;
    if (timeSinceLastClick > 5000) {
      isClicked = false;
      sunRotationSpeed = 0.01;
    }
  }
    else if(clickedPlanet==sun){
      if (clickedPlanet.rotationSpeed > 0.01) {
        clickedPlanet.rotationSpeed -= deceleration;
      }
    }
  

  orbitingObjects.forEach((planet, index) => {
    if(planet.name!="Saturn Ring"&&planet.name!="Satelite"&&planet.name!="Uranus Ring"){
    let currentRevolutionSpeed =
      planet === clickedPlanet
        ? planet.revolutionSpeed || planetSpeed
        : planetSpeed;
    let currentRotationSpeed =
      planet === clickedPlanet ? planet.rotationSpeed || 0.01 : 0.01;

    planet.rotation.y += currentRotationSpeed;

    let radius = 60 + index * 30;
    let speed = currentRevolutionSpeed + index * 0.00005;

    if (!angles[planet.uuid]) angles[planet.uuid] = Math.random() * Math.PI * 2;
    angles[planet.uuid] += speed;
    planet.position.x = sun.position.x + radius * Math.cos(angles[planet.uuid]);
    planet.position.z = sun.position.z + radius * Math.sin(angles[planet.uuid]);

    planet.revolutionSpeed = Math.min(planet.revolutionSpeed, 0.01);
    planet.rotationSpeed = Math.min(planet.rotationSpeed, 0.05);

    if (textMesh && planet.name === currentPlanet) {
      textMesh.position.x = planet.position.x - 45;
      textMesh.position.y = planet.position.y + 30;
      textMesh.position.z = planet.position.z;
    }
  }
  });
  let sunQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    sunRotationSpeed
  );
  sun.quaternion.multiplyQuaternions(sunQuaternion, sun.quaternion);

  uranusring.position.copy(uranus.position);
  uranusring.rotation.x = -Math.PI / 2;
  saturnring.position.copy(saturn.position);
  saturnring.rotation.x = -Math.PI / 2;

  satelite.position.x = earth.position.x + 8;
  satelite.position.y = earth.position.y;
  satelite.position.z = earth.position.z;

  if (textMesh && spaceship) {
    textMesh.lookAt(spaceship.position);
  }
  spotLight.position.x=spaceship.position.x;
  spotLight.position.y = spaceship.position.y+8;
  spotLight.position.z = spaceship.position.z;

  updateCamera();
};

const getRandomColor = () => {
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
  let randomColor = Math.floor(Math.random() * randomColorChoices.length);
  return randomColorChoices[randomColor];
};

window.onmousemove = (event) => {
  console.log(mouse);
  console.log(scene.children);
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, TPcamera);
  const planet = raycaster.intersectObjects(scene.children);
  if (planet.length > 0) {
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
  } else {
    if (hoveredObject) {
      hoveredObject.material.color.set(originalColor);
      hoveredObject = null;
    }
  }
};

const createText = (planet, position) => {
  if (planet != currentPlanet) {
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
