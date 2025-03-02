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
const paintings = [];
const selectedPaintings = new Map();
let painting1;

// Secuence of actions
init();
//firstPerson();
loadScene();
setupLighting();
mouseInteraction();
render();

function init() {
    // render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor( new THREE.Color(0x0000AA) );
    document.getElementById("container").appendChild(renderer.domElement);
    renderer.antialias = true;
    renderer.shadowMap.enabled = true;

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
    camera.position.set(0.5, 1, 7);
    cameraControls = new OrbitControls(camera, renderer.domElement);

    //Where to orbit
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

function loadScene() {
    loadFloor(-5);
    //loadFloor(5);
    loadWalls();
    loadArtPaitingGroup("images/artPaintings/LasMeninas_Velazquez.jpg", 3, {
        x: -6,
        y: 0,
        z: -7.5,
    });
    loadArtPaitingGroup("images/artPaintings/MonaLisa_DaVinci.jpg", 2, {
        x: -2,
        y: 0,
        z: -7.5,
    });

    loadArtPaitingGroup("images/artPaintings/LaRondaDeNoche_Rembrandt.jpg", 5, {
        x: 4,
        y: 0,
        z: -7.5,
    });
}

function render() {
    requestAnimationFrame(render);
    //updateDirectionCamera();

    //painting.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function loadArtPaitingGroup(imagePath, scale, position) {
    createArtPaintingGroup(imagePath, scale, position)
        .then((paintingWithFrame) => {
            //return paintingWithFrame;
            console.log("Adding painting");
            paintings.push(paintingWithFrame);
            painting1 = paintingWithFrame;
            setUpFocalLighting(paintingWithFrame);
        })
        .catch((error) => {
            console.error("Error cargando la pintura:", error);
        });
}

function createArtPaintingGroup(imagePath, scale, position) {
    return loadPainting(imagePath, scale).then((painting) => {
        let scaleFrame = 1.1 * scale;
        // create frame of painting
        const frame = createFrame(painting.aspectRatio, scaleFrame);

        // create group
        const paintingWithFrame = new THREE.Group();
        paintingWithFrame.add(painting.painting);
        paintingWithFrame.add(frame);

        //add position
        paintingWithFrame.position.set(position.x, position.y, position.z);

        paintingWithFrame.castShadow = true;
        paintingWithFrame.receiveShadow = true;

        scene.add(paintingWithFrame);
        return paintingWithFrame;
    });
}

function loadPainting(imagePath, scale) {
    return new Promise((resolve, reject) => {
        textureLoader.load(
            imagePath,
            function (paintingTexture) {
                // load dimensions of loaded image
                const width = paintingTexture.image.width;
                const height = paintingTexture.image.height;

                // create geometry with image dimensions
                const aspectRatio = width / height;
                const geometry = new THREE.BoxGeometry(
                    scale * aspectRatio,
                    scale,
                    0.05
                ); //FIXME, scale 2 by default

                // add material with the image
                const material = new THREE.MeshStandardMaterial({
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

function createFrame(aspectRatio, scaleFrame) {
    // create geometry for the frame
    const frameGeometry = new THREE.BoxGeometry(
        scaleFrame * aspectRatio,
        scaleFrame,
        0.1
    ); // FIXME scale 2.2 by default

    const woodTexture = textureLoader.load("images/wood512.jpg");

    const frameMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // position behind painting
    frame.position.set(0, 0, -0.03);
    return frame;
}

function loadFloor(positionY) {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20.2, 15.2);

    const woodTexture = textureLoader.load(
        "images/room/floor6.jpg",
        function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(8, 4);
        }
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, positionY, 0);

    floor.receiveShadow = true;
    scene.add(floor);
}

function loadWalls() {
    loadWall(20.2, 10, { x: 0, y: 0, z: -7.6 }, 0);
    loadWall(20.2, 10, { x: 0, y: 0, z: 7.6 }, 0);
    loadWall(15.2, 10, { x: 10.1, y: 0, z: 0 }, Math.PI / 2);
    loadWall(15.2, 10, { x: -10.1, y: 0, z: 0 }, Math.PI / 2);
}
function loadWall(width, height, position, rotation) {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(width, height);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaebd7,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.rotation.x = -Math.PI / 2;
    floor.position.set(position.x, position.y, position.z);
    floor.rotation.y = rotation;

    floor.receiveShadow = true;
    scene.add(floor);
}

function mouseInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let paintingSeleccionado = false;

    // rotate slithly when mouse over painting
    /*window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (paintings.length === 0) return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintings, true);

        paintings.forEach((painting) => {
            painting.rotation.y = 0;
        });

        if (intersects.length > 0) {
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintings.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }
            paintingGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.1; // Rotación ligera
        }
    });*/

    // click event to zoom
    window.addEventListener("click", () => {
        console.log("Clicked");
        if (paintings.length === 0) return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintings, true);

        if (intersects.length > 0) {
            console.log("Cuadro clicked");
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintings.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }

            //check if painting already selected
            const paintingSelected =
                selectedPaintings.get(paintingGroup) || false;

            if (!paintingSelected) {
                paintingGroup.position.z += 3; // Acercar el painting
                paintingGroup.position.y += 1;
                console.log("zoom");
                //painting.material.map = paintingTexture2; // Cambiar la textura
            } else {
                paintingGroup.position.z -= 3; // Alejar el painting
                paintingGroup.position.y -= 1;
                //painting.material.map = paintingTexture1; // Volver a la textura original
            }

            //save selection
            selectedPaintings.set(paintingGroup, !paintingSelected);
        }
    });
}

function setupLighting() {
    console.log("light " + paintings.length);
    // Luz ambiental tenue para iluminar toda la escena sin sombras fuertes
    //const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Color gris tenue, intensidad baja
    //scene.add(ambientLight);

    //FIXME, quit
    /*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 0); // Posición arriba
    scene.add(directionalLight);*/

    //Room light
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100); // Color blanco, intensidad 1, alcance de 100 unidades
    pointLight.position.set(0, 5, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Foco para cada cuadro
    /*paintings.forEach((painting) => {
        console.log("Calculating light");
        const spotlight = new THREE.SpotLight(0xffffff, 1.5); // Luz blanca, intensidad 1.5
        spotlight.position.set(
            painting.position.x,
            painting.position.y + 2,
            painting.position.z + 1
        );
        spotlight.target = painting; // Apuntar directamente al cuadro

        spotlight.angle = Math.PI / 6; // Ángulo del foco (ajústalo según necesites)
        spotlight.penumbra = 0.3; // Difuminado de los bordes de la luz
        spotlight.decay = 2; // Atenuación de la luz con la distancia
        spotlight.distance = 10; // Máxima distancia de iluminación

        scene.add(spotlight);
    });*/
}
function setUpFocalLighting(painting) {
    console.log("focal light");
    const spotlight = new THREE.SpotLight(0xffffff, 1.5); // Luz blanca, intensidad 1.5
    spotlight.position.set(
        painting.position.x,
        painting.position.y + 5,
        painting.position.z + 1
    );
    spotlight.target = painting; // Apuntar directamente al cuadro

    spotlight.angle = Math.PI / 6; // Ángulo del foco (ajústalo según necesites)
    spotlight.penumbra = 0.3; // Difuminado de los bordes de la luz
    spotlight.decay = 2; // Atenuación de la luz con la distancia
    spotlight.distance = 10; // Máxima distancia de iluminación
    spotlight.castShadow = true;

    scene.add(spotlight);
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
