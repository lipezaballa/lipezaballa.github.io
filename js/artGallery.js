/**
 * Escena.js
 *
 * Seminario AGM #1. Escena basica en three.js:
 * Transformaciones, animacion basica y modelos importados
 *
 * @author <rvivo@upv.es>, 2023
 *
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import { GLTFLoader } from "../lib/GLTFLoader.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
//import { PointerLockControls } from "../lib/PointerLockControls.js";

//generic variables
const textureLoader = new THREE.TextureLoader();

// Variables de consenso
let renderer, scene, camera, cameraControls;

//objects
let painting1;

// Otras globales
let esferaCubo;
let angulo = 0;

// Acciones
init();
//firstPerson();
loadScene();
//const painting1 = loadArtPainting();
mouseInteraction();
render();

function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor( new THREE.Color(0x0000AA) );
    document.getElementById("container").appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Camara
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

    loadArtPainting()
        .then((paintingWithFrame) => {
            painting1 = paintingWithFrame;
            console.log(paintingWithFrame); // Accedes al grupo con el cuadro y el marco
            // Puedes interactuar con el objeto paintingWithFrame aquí
        })
        .catch((error) => {
            console.error("Error cargando la pintura:", error);
        });
}

function render() {
    requestAnimationFrame(render);
    //updateDirectionCamera();

    //painting.rotation.y += 0.01;
    renderer.render(scene, camera);
}

/*function loadArtPainting() {
    const painting = loadPainting();
    /*setTimeout(() => {
        console.log("timeout finished");
    }, 2000);
    const frame = createFrame();

    // Crear un grupo para juntar el cuadro y el marco
    const paintingWithFrame = new THREE.Group();
    paintingWithFrame.add(painting); // Agregar el cuadro al grupo
    paintingWithFrame.add(frame); // Agregar el marco al grupo

    scene.add(paintingWithFrame);
    return paintingWithFrame;
}*/

function loadArtPainting() {
    return loadPainting().then((painting) => {
        console.log("aspectRatioFuera: " + painting.aspectRatio);
        const frame = createFrame(painting.aspectRatio);

        // Crear un grupo para juntar el cuadro y el marco
        const paintingWithFrame = new THREE.Group();
        paintingWithFrame.add(painting.painting); // Agregar el cuadro al grupo
        paintingWithFrame.add(frame); // Agregar el marco al grupo

        scene.add(paintingWithFrame);
        return paintingWithFrame;
    });

    const painting = loadPainting();
    /*setTimeout(() => {
        console.log("timeout finished");
    }, 2000);*/
    const frame = createFrame();

    // Crear un grupo para juntar el cuadro y el marco
    const paintingWithFrame = new THREE.Group();
    paintingWithFrame.add(painting); // Agregar el cuadro al grupo
    paintingWithFrame.add(frame); // Agregar el marco al grupo

    scene.add(paintingWithFrame);
    return paintingWithFrame;
}

function loadPainting() {
    // Load texture painting
    /*const paintingTexture = textureLoader.load(
        "images/artPaintings/LasMeninas_Velazquez.jpg"
    );

    // Create geometry painting
    const geometry = new THREE.BoxGeometry(2, 1.5, 0.05);
    const material = new THREE.MeshBasicMaterial({ map: paintingTexture });
    const painting = new THREE.Mesh(geometry, material);
    painting.position.set(0, 0, 0);
    //scene.add(painting);*/

    return new Promise((resolve, reject) => {
        textureLoader.load(
            "images/artPaintings/LasMeninas_Velazquez.jpg",
            function (paintingTexture) {
                // Cuando la textura se haya cargado, obtenemos sus dimensiones
                const width = paintingTexture.image.width; // Ancho de la imagen
                const height = paintingTexture.image.height; // Alto de la imagen
                console.log("width: " + width);
                console.log("height: " + height);

                // Crear la geometría del cuadro usando las dimensiones de la imagen
                const aspectRatio = width / height;
                const geometry = new THREE.BoxGeometry(
                    2 * aspectRatio,
                    2,
                    0.05
                ); // Escala de 2 para el tamaño
                const material = new THREE.MeshBasicMaterial({
                    map: paintingTexture,
                });
                // Crear el objeto del cuadro
                const painting = new THREE.Mesh(geometry, material);
                painting.position.set(0, 0, 0); // Ajustar la posición según se necesite
                //scene.add(painting);

                console.log("aspectRatioDentro: " + aspectRatio);

                resolve({ painting, aspectRatio });
            },
            undefined, // Opcional: puedes agregar un manejador de progreso si lo deseas
            function (error) {
                reject(error); // Si ocurre un error al cargar la textura, rechazar la promesa
            }
        );
    });
}

/*function loadPainting() {
    // Load texture painting
    /*const paintingTexture = textureLoader.load(
        "images/artPaintings/LasMeninas_Velazquez.jpg"
    );

    // Create geometry painting
    const geometry = new THREE.BoxGeometry(2, 1.5, 0.05);
    const material = new THREE.MeshBasicMaterial({ map: paintingTexture });
    const painting = new THREE.Mesh(geometry, material);
    painting.position.set(0, 0, 0);
    //scene.add(painting);

    let artPainting;

    // Cargar la textura de la pintura
    textureLoader.load(
        "images/artPaintings/LasMeninas_Velazquez.jpg",
        function (paintingTexture) {
            // Cuando la textura se haya cargado, obtenemos sus dimensiones
            const width = paintingTexture.image.width; // Ancho de la imagen
            const height = paintingTexture.image.height; // Alto de la imagen
            console.log("width: " + width);
            console.log("height: " + height);

            // Crear la geometría del cuadro usando las dimensiones de la imagen
            const aspectRatio = width / height;
            const geometry = new THREE.BoxGeometry(2 * aspectRatio, 2, 0.05); // Escala de 2 para el tamaño
            const material = new THREE.MeshBasicMaterial({
                map: paintingTexture,
            });

            // Crear el objeto del cuadro
            const painting = new THREE.Mesh(geometry, material);
            painting.position.set(0, 0, 0); // Ajustar la posición según se necesite
            //scene.add(painting);

            artPainting = painting;
        }
    );
    return artPainting;
}*/

function createFrame(aspectRatio) {
    // Create geometry for the frame (larger box surrounding the painting)
    const frameGeometry = new THREE.BoxGeometry(2.2 * aspectRatio, 2.2, 0.1); // Slightly larger

    const woodTexture = textureLoader.load("images/wood512.jpg");

    const frameMaterial = new THREE.MeshBasicMaterial({
        map: woodTexture,
        //color: 0x8b4513, // Color madera (Brown, similar a la madera)
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0, -0.03); // Position the frame slightly behind the painting
    return frame;
}

function loadFloor() {
    // Crear el suelo
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x555555,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Ponerlo plano en el suelo
    floor.position.set(0, -5, -5);
    scene.add(floor);
}

function mouseInteraction() {
    // Interacción con el mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let paintingSeleccionado = false;

    // Evento de movimiento del mouse
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(painting1);

        if (intersects.length > 0) {
            painting1.rotation.y = Math.sin(Date.now() * 0.001) * 0.1; // Rotación ligera
        } else {
            painting1.rotation.y = 0;
        }
    });

    // Evento de clic para hacer zoom
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
    // Controles First-Person
    const controls = new PointerLockControls(camera, document.body);
    document.addEventListener("click", () => controls.lock()); // Hacer clic para capturar el cursor
    scene.add(controls.getObject());

    // Variables de movimiento
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const speed = 0.1;
    const keys = { w: false, a: false, s: false, d: false };

    // Eventos del teclado
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
    // Actualizar dirección de movimiento
    direction.set(0, 0, 0);
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x -= 1;
    if (keys.d) direction.x += 1;
    direction.normalize();

    // Aplicar velocidad a la cámara
    velocity.copy(direction).multiplyScalar(speed);
    controls.getObject().position.add(velocity);
}
