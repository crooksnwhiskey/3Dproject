import * as THREE from 'three';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene()
const sizes = {
    width: 800,
    height: 600
}
const canvas = document.querySelector('canvas#three-ex')
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3;
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const mesh_2 = new THREE.Mesh(geometry, material)
scene.add(mesh_2)
mesh_2.position.x = -1.5

const controls = new PointerLockControls(camera, document.body);
controls.addEventListener("lock", function () {
    console.log("we are locked")
})

controls.addEventListener("unlock", function () {
    console.log("we are unlocked")
})

window.requestAnimationFrame(animate)


function animate() {
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
    if (moveForward) controls.moveForward(0.01);
    if (moveBackward) controls.moveForward(-0.01);
    if (moveRight) controls.moveRight(0.01);
    if (moveLeft) controls.moveRight(-0.01);
}

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
