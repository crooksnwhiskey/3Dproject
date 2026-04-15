import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const audio = document.getElementById('background-music');

// Enable looping via the property
audio.loop = true;

// Play the audio
audio.play();


const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0f)
scene.fog = new THREE.Fog(0x0a0a0f, 8, 40)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('canvas#three-ex')
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3;
camera.position.x = 0;
camera.position.y = 1.4;

scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


const controls = new PointerLockControls(camera, document.body);
controls.addEventListener("lock", function () {
    console.log("we are locked")
})

controls.addEventListener("unlock", function () {
    console.log("we are unlocked")
})

window.requestAnimationFrame(animate)

const playButton = document.getElementById('play_button'); // Example button
playButton.addEventListener('click', function () {
    controls.lock();

}, false)

controls.addEventListener('lock', function () {
    playButton.style.display = 'none';
    crosshair.style.opacity = '1';
});

controls.addEventListener('unlock', function () {
    playButton.style.display = 'block';
    crosshair.style.opacity = '0';
});

let moveForward = false;
let moveBackward = false;
let moveRight = false;
let moveLeft = false;
let isSprinting = false;
window.addEventListener("keydown", function (e) {
    if (e.keyCode === 87) {
        moveForward = true;
    }
    if (e.keyCode === 83) {
        moveBackward = true;
    }
    if (e.keyCode === 65) {
        moveLeft = true;
    }
    if (e.keyCode === 68) {
        moveRight = true;
    }
    if (e.keyCode == 16) {
        isSprinting = true;
    }
    // teleporting to fix stuff easier                          READ THIS< ALEX ik emmets ass aint doing it
    if (e.keyCode == 84) {
        bounds.minZ = -length + playerSize;
        camera.position.set(0, camera.position.y, -220);
    }
})

window.addEventListener("keyup", function (e) {
    if (e.keyCode === 87) {
        moveForward = false;
    }
    if (e.keyCode === 83) {
        moveBackward = false;
    }
    if (e.keyCode === 65) {
        moveLeft = false;
    }
    if (e.keyCode === 68) {
        moveRight = false;
    }
    if (e.keyCode == 16) {
        isSprinting = false;
    }
})

const textureLoader = new THREE.TextureLoader();
//from official three.js github
const floorRoughness = textureLoader.load('textures/hardwood2_roughness.jpg');
const floorDiffuse = textureLoader.load('textures/hardwood2_diffuse.jpg');
const floorBump = textureLoader.load('textures/hardwood2_bump.jpg');
//sizes for the room
const length = 350;
const width = 5;
const height = 3.5;
//materials for the walls, floor, and ceiling and buttons
const wallmaterial = new THREE.MeshStandardMaterial({ color: 0xc5c6c7 });
const floormaterial = new THREE.MeshStandardMaterial({

    map: floorDiffuse,
    bumpMap: floorBump,
    roughnessMap: floorRoughness,
    color: 0x898F89
});
const ceilingmaterial = new THREE.MeshStandardMaterial({ color: 0xc5c6c7 });
const buttonOnematerial = new THREE.MeshStandardMaterial({ color: 0x222230 });
const buttonTwomaterial = new THREE.MeshStandardMaterial({ color: 0x222230 });
const tempObsMaterial = new THREE.MeshStandardMaterial({ color: 0xc5c6c7 });


// 0xff3300
//https://threejs.org/docs/#Texture.repeat
floorDiffuse.repeat.set(3, 100);
floorBump.repeat.set(3, 100);
floorRoughness.repeat.set(3, 100);

floorDiffuse.wrapS = floorDiffuse.wrapT = THREE.RepeatWrapping;
floorBump.wrapS = floorBump.wrapT = THREE.RepeatWrapping;
floorRoughness.wrapS = floorRoughness.wrapT = THREE.RepeatWrapping;


const buttonOne = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), buttonOnematerial);
scene.add(buttonOne);
buttonRand1();

const buttonTwo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), buttonTwomaterial);
scene.add(buttonTwo);
buttonRand2()

const buttonThree = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), buttonTwomaterial);
scene.add(buttonThree);
buttonRand3()

const buttonFour = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), buttonTwomaterial);
scene.add(buttonFour);
buttonRand4()

const buttonFive = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), buttonTwomaterial);
scene.add(buttonFive);
buttonRand5()

let removableWall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall1.position.set(0, 1.75, -60);
scene.add(removableWall1);

let removableWall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall2.position.set(0, 1.75, -110);
scene.add(removableWall2);

let removableWall3 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall3.position.set(0, 1.75, -160);
scene.add(removableWall3);
let removableWall4 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall4.position.set(0, 1.75, -210);
scene.add(removableWall4);
let removableWall5 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall5.position.set(0, 1.75, -260);
scene.add(removableWall5);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const hitsOne = raycaster.intersectObject(buttonOne);
    if (hitsOne.length > 0) {
        buttonOne.material.color.setHex(0xff0000);
        setTimeout(() => buttonOne.material.color.setHex(0x222230), 200);
        removeWall1();
        return;
    }

    const hitsTwo = raycaster.intersectObject(buttonTwo);
    if (hitsTwo.length > 0) {
        buttonTwo.material.color.setHex(0xff0000);
        setTimeout(() => buttonTwo.material.color.setHex(0x222230), 200);
        removeWall2();
        return;
    }
    const hitsThree = raycaster.intersectObject(buttonThree);
    if (hitsThree.length > 0) {
        buttonThree.material.color.setHex(0xff0000);
        setTimeout(() => buttonThree.material.color.setHex(0x222230), 200);
        removeWall3();
        return;
    }
    const hitsFour = raycaster.intersectObject(buttonFour);
    if (hitsFour.length > 0) {
        buttonFour.material.color.setHex(0xff0000);
        setTimeout(() => buttonThree.material.color.setHex(0x222230), 200);
        removeWall4();
        return;
    }
    const hitsFive = raycaster.intersectObject(buttonFive);
    if (hitsFive.length > 0) {
        buttonFive.material.color.setHex(0xff0000);
        setTimeout(() => buttonFive.material.color.setHex(0x222230), 200);
        removeWall5();
        return;
    }
}

function removeWall1() {
    if (removableWall1) {
        scene.remove(removableWall1);
        removableWall1.geometry.dispose();
        removableWall1.material.dispose();
        removableWall1 = null;
        bounds.minZ = removableWall2.position.z + playerSize;
    }
}
function removeWall2() {
    if (removableWall2) {
        scene.remove(removableWall2);
        removableWall2.geometry.dispose();
        removableWall2.material.dispose();
        removableWall2 = null;
        bounds.minZ = removableWall3.position.z + playerSize;
    }
}
function removeWall3() {
    if (removableWall3) {
        scene.remove(removableWall3);
        removableWall3.geometry.dispose();
        removableWall3.material.dispose();
        removableWall3 = null;
        bounds.minZ = -length + playerSize;
    }
}
function removeWall4() {
    if (removableWall4) {
        scene.remove(removableWall4);
        removableWall4.geometry.dispose();
        removableWall4.material.dispose();
        removableWall4 = null;
        bounds.minZ = -length + playerSize;
    }

}
function removeWall5() {
    if (removableWall5) {
        scene.remove(removableWall5);
        removableWall5.geometry.dispose();
        removableWall5.material.dispose();
        removableWall5 = null;
        bounds.minZ = -length + playerSize;
    }
}
// Camera Model from https://sketchfab.com/3d-models/surveillance-camera-cd2a7ca0211d4fc08acc88ce868c2f8f
const cctv = [];
const loader = new GLTFLoader();
const cctvPositions = [
    { x: -2.1, z: -20 },
    { x: 2.2, z: -40 },
    { x: -2.2, z: -60 },
    { x: 2.2, z: -80 },
    { x: -2.2, z: -100 },
    { x: 2.2, z: -120 },
    { x: -2.1, z: -140 },
    { x: 2.2, z: -160 },
    { x: -2.2, z: -180 },
    { x: 2.2, z: -200 },
    { x: -2.2, z: -220 },
    { x: 2.2, z: -240 },
];

cctvPositions.forEach(pos => {
    loader.load('models/camera.glb', (gltf) => {
        const cameraModel = gltf.scene;
        cameraModel.scale.set(0.2, 0.2, 0.1);
        scene.add(cameraModel);
        cameraModel.position.set(pos.x, 3, pos.z);
        cctv.push(cameraModel);

    });

});
const pillarStartZ = -220;
const pillarStartX = [
    { x: -1.9 }, { x: 0.3 },
    { x: 1.8 }, { x: -0.5 },
    { x: 0.1 }, { x: 1.6 },
    { x: -1.7 }, { x: 0.8 },
    { x: 1.2 }, { x: -0.2 },
    { x: -1.4 }, { x: 0.6 },
    { x: 1.9 }, { x: -0.9 },
    { x: 0.4 }, { x: -1.6 },
    { x: 1.5 }, { x: -0.1 },
    { x: -1.8 }, { x: 0.7 },
    { x: 1.3 }, { x: -0.4 },
    { x: -1.5 }, { x: 0.2 },
    { x: 1.7 }, { x: -0.6 },
    { x: -0.3 }, { x: 1.4 },
    { x: -1.6 }, { x: 0.5 },
    { x: 1.4 }, { x: -0.8 },
    { x: -1.3 }, { x: 0.9 },
    { x: 1.6 }, { x: -0.7 },
    { x: -1.4 }, { x: 0.3 },
];

pillarStartX.forEach((pillar, i) => {
    loader.load('models/pillar.glb', (gltf) => {
        const pillarModel = gltf.scene;
        pillarModel.scale.set(1, 1, 1);
        pillarModel.position.set(pillar.x, 0, pillarStartZ - 1 * i);
        scene.add(pillarModel);
        cctv.push(pillarModel);
    });
});

window.addEventListener('click', onMouseClick);
//left wall
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(length, height), wallmaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-width / 2, height / 2, -length / 2);
scene.add(leftWall);
//right wall
const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(length, height), wallmaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(width / 2, height / 2, -length / 2);
scene.add(rightWall);
//floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, length), floormaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -length / 2);
scene.add(floor);
//ceiling
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, length), ceilingmaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, height, - length / 2);
scene.add(ceiling);



const obs1b = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs1b.position.set(-2, height / 2, -85);
scene.add(obs1b);

const obs2b = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs2b.position.set(2, height / 2, -85);
scene.add(obs2b);

const obs3b = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs3b.position.set(-2, height / 2, -90);
scene.add(obs3b);

const obs4b = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs4b.position.set(2, height / 2, -90);
scene.add(obs4b);

const obs5b = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs5b.position.set(0, height / 2, -95);
scene.add(obs5b);


const obs1c = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), tempObsMaterial);
obs1c.position.set(-2, height / 2, -122);
obs1c.rotation.y = -Math.PI / 3;
scene.add(obs1c);

const obs2c = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 1), tempObsMaterial);
obs2c.position.set(2, height / 2, -130);
obs2c.rotation.y = -Math.PI / 3;
scene.add(obs2c);

const obs3c = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 3), tempObsMaterial);
obs3c.position.set(2, height / 2, -135);
obs3c.rotation.y = -Math.PI / 3;
scene.add(obs3c);

const obs4c = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 1), tempObsMaterial);
obs4c.position.set(2, height / 2, -140);
obs4c.rotation.y = -Math.PI / 3;
obs4c.rotation.x = -Math.PI / 4;
scene.add(obs4c);

const obs5c = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 2), tempObsMaterial);
obs5c.position.set(-2, height / 2, -130);
obs5c.rotation.y = -Math.PI / 2.5;
obs5c.rotation.x = -Math.PI / 2.5;
scene.add(obs5c);

const obs1d = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 3), tempObsMaterial);
obs1d.position.set(-2, height / 2, -190);
obs1d.rotation.y = -Math.PI / 3;
scene.add(obs1d);

const obs2d = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 4), tempObsMaterial);
obs2d.position.set(3, height / 2, -180);
obs2d.rotation.x = -Math.PI / 3;
obs2d.rotation.z = -Math.PI / 7;
scene.add(obs2d);

const obs3d = new THREE.Mesh(new THREE.BoxGeometry(5, 6, 2), tempObsMaterial);
obs3d.position.set(-5, height / 2, -177);
obs3d.rotation.y = -Math.PI / 4;
obs3d.rotation.x = -Math.PI / 2.5;
scene.add(obs3d);

const obs4d = new THREE.Mesh(new THREE.BoxGeometry(7, 6, 3), tempObsMaterial);
obs4d.position.set(-4, height / 2, -170);
obs4d.rotation.x = -Math.PI / 2.5;
scene.add(obs4d);

const obs5d = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 3), tempObsMaterial);
obs5d.position.set(4, height / 2, -167);
obs5d.rotation.x = -Math.PI / 5;
obs5d.rotation.z = -Math.PI / 5;
scene.add(obs5d);

const obs6d = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 3), tempObsMaterial);
obs6d.position.set(4, 4, -168);
obs6d.rotation.x = -Math.PI / 5;
scene.add(obs6d);

const obs7d = new THREE.Mesh(new THREE.BoxGeometry(20, 5, 3), tempObsMaterial);
obs7d.position.set(4, 5, -180);
obs7d.rotation.y = -Math.PI;
scene.add(obs7d);


//player size for collision detection
const playerSize = 0.5;
//bounds for the player to stay within the room
const bounds = {
    minX: -width / 2 + playerSize,
    maxX: width / 2 - playerSize,
    minZ: removableWall1.position.z + playerSize,
    maxZ: -playerSize
}

const lights = new THREE.AmbientLight(0x404060, 0.5);


const spacing = length / 20;
for (let i = 0; i < 20; i++) {
    const light = new THREE.PointLight(0xFADB38, 5.9, 12);
    light.position.set(0, height - 0.15, -(i + 0.5) * spacing);
    scene.add(light);
}
scene.add(lights);
function buttonRand1() {
    const buttonSpotNumber = Math.random();
    if (buttonSpotNumber < .33) {
        buttonOne.rotation.y = Math.PI / 2;
        buttonOne.position.set(-2.49, 1.75, -50);
    }
    if (buttonSpotNumber > .33 && buttonSpotNumber < .66) {
        buttonOne.rotation.y = -Math.PI / 2;
        buttonOne.position.set(2.49, 1.75, -50);
    }
    if (buttonSpotNumber > .66) {
        buttonOne.rotation.y = Math.PI / 2;
        buttonOne.position.set(-2.49, 1.75, -25);
    }
}
function buttonRand2() {
    const buttonSpotNumber = Math.random();
    if (buttonSpotNumber < .33) {
        buttonTwo.position.set(2.49, 0.75, -90.8);
        buttonTwo.rotation.y = -Math.PI / 2;
    }
    if (buttonSpotNumber > .33 && buttonSpotNumber < .66) {
        buttonTwo.position.set(-2.49, 0.75, -85.8);
        buttonTwo.rotation.y = Math.PI / 2;
    }
    if (buttonSpotNumber > .66) {
        buttonTwo.position.set(0, 0.75, -95.51);
        buttonTwo.rotation.y = -Math.PI;
    }
    console.log(buttonTwo.position)
}
function buttonRand3() {
    const buttonSpotNumber = Math.random();
    if (buttonSpotNumber < .33) {
        buttonThree.position.set(2.49, 3, -130.3);
        buttonThree.rotation.y = -Math.PI / 2;
    }
    if (buttonSpotNumber > .33 && buttonSpotNumber < .66) {
        buttonThree.position.set(2.49, 3.1, -142);
        buttonThree.rotation.y = -Math.PI / 2;
    }
    if (buttonSpotNumber > .66) {
        buttonThree.position.set(0.4, 3.46, -150);
        buttonThree.rotation.x = Math.PI / 2;
    }
}
function buttonRand4() {
    const buttonSpotNumber = Math.random();
    if (buttonSpotNumber < .33) {
        buttonFour.position.set(2.48, 0.1, -167.7);
        buttonFour.rotation.y = -Math.PI / 2;
        buttonFour.rotation.z = 45
    }
    if (buttonSpotNumber > .33 && buttonSpotNumber < .66) {
        buttonFour.position.set(-0.8, 3.4, -169.5);
        buttonFour.rotation.x = 39
    }
    if (buttonSpotNumber > .66) {
        buttonFour.position.set(2.48, 0.01, -178.35);
        buttonFour.rotation.x = -Math.PI / 2;
    }
}
function buttonRand5() {
    const buttonSpotNumber = Math.random();
    if (buttonSpotNumber < .33) {
        buttonFive.position.set(-1.4, 0.1, -233.5);
        buttonFive.rotation.x = -Math.PI / 2;

    }
    if (buttonSpotNumber > .33 && buttonSpotNumber < .66) {
        buttonFive.position.set(0, 0.1, -255);


        buttonFive.rotation.x = -Math.PI / 2;

    }
    if (buttonSpotNumber > .66) {
        buttonFive.position.set(1.8, 0.1, -223.5);


        buttonFive.rotation.x = -Math.PI / 2;

    }
}

function animate() {
    window.requestAnimationFrame(animate)

    const walkSpeed = isSprinting ? 0.20 : 0.04;


    if (moveForward) controls.moveForward(walkSpeed);
    if (moveBackward) controls.moveForward(-walkSpeed);
    if (moveRight) controls.moveRight(walkSpeed);
    if (moveLeft) controls.moveRight(-walkSpeed);

    cctv.forEach(cam => {
        cam.lookAt(camera.position);
    });
    //Update camera position based on bounds
    camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, camera.position.x));
    camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, camera.position.z));
    renderer.render(scene, camera)
}