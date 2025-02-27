/**
 *
 * Trabajo AGM #1. Three.js: ArtGallery
 *
 * @author <Felipe Zaballa Martínez>, 2025
 *
 */

import * as THREE from "../lib/three.module.js";
import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
//import { PointerLockControls } from "../lib/PointerLockControls.js";

//global sources
const textureLoader = new THREE.TextureLoader();

// global variables
let renderer, scene, camera, cameraControls;

//objects
let painting1;

// Secuence of actions
init();
//firstPerson();
loadScene();
mouseInteraction();
render();

function init() {
    // render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor( new THREE.Color(0x0000AA) );
    document.getElementById("container").appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0.5, 2, 7);
    cameraControls = new OrbitControls(camera, renderer.domElement);

    //Where to orbit
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

function loadScene() {
    loadFloor();

    loadArtPaitingGroup();
}

function render() {
    requestAnimationFrame(render);
    //updateDirectionCamera();

    //painting.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function loadArtPaitingGroup() {
    createArtPaintingGroup()
        .then((paintingWithFrame) => {
            painting1 = paintingWithFrame;
        })
        .catch((error) => {
            console.error("Error cargando la pintura:", error);
        });
}

function createArtPaintingGroup() {
    return loadPainting().then((painting) => {
        // create frame of painting
        const frame = createFrame(painting.aspectRatio);

        // create group
        const paintingWithFrame = new THREE.Group();
        paintingWithFrame.add(painting.painting);
        paintingWithFrame.add(frame);
        //FIXME, modifify position?

        scene.add(paintingWithFrame);
        return paintingWithFrame;
    });
}

function loadPainting() {
    return new Promise((resolve, reject) => {
        textureLoader.load(
            "images/artPaintings/LasMeninas_Velazquez.jpg",
            function (paintingTexture) {
                // load dimensions of loaded image
                const width = paintingTexture.image.width;
                const height = paintingTexture.image.height;

                // create geometry with image dimensions
                const aspectRatio = width / height;
                const geometry = new THREE.BoxGeometry(
                    2 * aspectRatio,
                    2,
                    0.05
                ); //FIXME, scale 2 by default

                // add material with the image
                const material = new THREE.MeshBasicMaterial({
                    map: paintingTexture,
                });

                // create painting
                const painting = new THREE.Mesh(geometry, material);
                painting.position.set(0, 0, 0);

                resolve({ painting, aspectRatio });
            },
            undefined,
            function (error) {
                reject(error);
            }
        );
    });
}

function createFrame(aspectRatio) {
    // create geometry for the frame
    const frameGeometry = new THREE.BoxGeometry(2.2 * aspectRatio, 2.2, 0.1); // FIXME scale 2.2 by default

    const woodTexture = textureLoader.load("images/wood512.jpg");

    const frameMaterial = new THREE.MeshBasicMaterial({
        map: woodTexture,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // position behind painting
    frame.position.set(0, 0, -0.03);
    return frame;
}

function loadFloor() {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x555555,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -5, -5);
    scene.add(floor);
}

function mouseInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let paintingSeleccionado = false;

    // rotate slithly when mouse over painting
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(painting1); //FIXME

        if (intersects.length > 0) {
            painting1.rotation.y = Math.sin(Date.now() * 0.001) * 0.1; // Rotación ligera
        } else {
            painting1.rotation.y = 0;
        }
    });

    // click event to zoom
    window.addEventListener("click", () => {
        console.log("Clicked");
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(painting1);

        if (intersects.length > 0) {
            console.log("Cuadro clicked");
            if (!paintingSeleccionado) {
                painting1.position.z += 3; // Acercar el painting
                painting1.position.y += 1;
                console.log("zoom");
                //painting.material.map = paintingTexture2; // Cambiar la textura
            } else {
                painting1.position.z -= 3; // Alejar el painting
                painting1.position.y -= 1;
                //painting.material.map = paintingTexture1; // Volver a la textura original
            }
            paintingSeleccionado = !paintingSeleccionado;
        }
    });
}

function firstPerson() {
    const controls = new PointerLockControls(camera, document.body);
    document.addEventListener("click", () => controls.lock()); // Hacer clic para capturar el cursor
    scene.add(controls.getObject());

    // movement variables
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const speed = 0.1;
    const keys = { w: false, a: false, s: false, d: false };

    // keyboard events
    document.addEventListener("keydown", (event) => {
        if (event.key === "w") keys.w = true;
        if (event.key === "a") keys.a = true;
        if (event.key === "s") keys.s = true;
        if (event.key === "d") keys.d = true;
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "w") keys.w = false;
        if (event.key === "a") keys.a = false;
        if (event.key === "s") keys.s = false;
        if (event.key === "d") keys.d = false;
    });
}

function updateDirectionCamera() {
    direction.set(0, 0, 0);
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x -= 1;
    if (keys.d) direction.x += 1;
    direction.normalize();

    // add speed to camera
    velocity.copy(direction).multiplyScalar(speed);
    controls.getObject().position.add(velocity);
}
