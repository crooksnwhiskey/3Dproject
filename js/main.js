import * as THREE from 'three';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

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

let moveForward = false;
let moveBackward = false;
let moveRight = false;
let moveLeft = false;
window.addEventListener("keydown", function (e) {
    if (e.key === "w") {
        moveForward = true;
    }
    if (e.key === "s") {
        moveBackward = true;
    }

    if (e.key === "a") {
        moveLeft = true;
    }
    if (e.key === "d") {
        moveRight = true;
    }
})

window.addEventListener("keyup", function (e) {
    if (e.key === "w") {
        moveForward = false;
    }

    if (e.key === "s") {
        moveBackward = false;
    }
    if (e.key === "a") {
        moveLeft = false;
    }
    if (e.key === "d") {
        moveRight = false;
    }
})
//sizes for the room
const length = 150;
const width = 5;
const height = 3.5;
//materials for the walls, floor, and ceiling and buttons
const wallmaterial = new THREE.MeshStandardMaterial({ color: 0xc5c6c7 });
const floormaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a24 });
const ceilingmaterial = new THREE.MeshStandardMaterial({ color: 0x222230 });
const buttonOnematerial = new THREE.MeshStandardMaterial({ color: 0x222230 });
const buttonTwomaterial = new THREE.MeshStandardMaterial({ color: 0x222230 });
const tempObsMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300 });



const buttonOne = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), buttonOnematerial);
buttonOne.position.set(-width / 2 + 0.01, height / 2, -length / 3);
buttonOne.rotation.y = Math.PI / 2;
scene.add(buttonOne);

const buttonTwo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), buttonTwomaterial);
buttonTwo.position.set(width / 2 - 0.01, height / 2 - 1, -length * 2 / 3 + 9.2);
buttonTwo.rotation.y = -Math.PI / 2;
scene.add(buttonTwo);

let removableWall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall1.position.set(0, height / 2, -length / 3 - 10);
scene.add(removableWall1);

let removableWall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
removableWall2.position.set(0, height / 2, -length * 2 / 3 - 10);
scene.add(removableWall2);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

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
}

function removeWall1() {
    if (removableWall1) {
        scene.remove(removableWall1);
        removableWall1.geometry.dispose();
        removableWall1.material.dispose();
        removableWall1 = null;
    }
}
function removeWall2() {
    if (removableWall2) {
        scene.remove(removableWall2);
        removableWall2.geometry.dispose();
        removableWall2.material.dispose();
        removableWall2 = null;
    }
}




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


//player size for collision detection
const playerSize = 0.5;
//bounds for the player to stay within the room
const bounds = {
    minX: -width / 2 + playerSize,
    maxX: width / 2 - playerSize,
    minZ: -length + playerSize,
    maxZ: -playerSize
}

const lights = new THREE.AmbientLight(0x404060, 0.5);


const spacing = length / 5;
for (let i = 0; i < 5; i++) {
    const light = new THREE.PointLight(0xFADB38, 5.9, 12);
    light.position.set(0, height - 0.15, -(i + 0.5) * spacing);
    scene.add(light);
}
scene.add(lights);

function animate() {
    window.requestAnimationFrame(animate)
    if (moveForward) controls.moveForward(0.04);
    if (moveBackward) controls.moveForward(-0.04);
    if (moveRight) controls.moveRight(0.04);
    if (moveLeft) controls.moveRight(-0.04);

    // Update camera position based on bounds
    camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, camera.position.x));
    camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, camera.position.z));
    renderer.render(scene, camera)
}