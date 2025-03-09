/**
 *
 * Trabajo AGM #1. Three.js: ArtGallery
 *
 * @author <Felipe Zaballa Martínez>, 2025
 *
 */

import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.module.js";
import {loadFloor, loadWall, createWallWithOpenings } from "./scene/objects/room.js";
import { loadTable, loadChairs, loadTables } from "./scene/objects/furniture.js";
import { loadPaintings, createTexts, getPaintings, updateMainPaintingRotation, mouseInteraction } from "./scene/objects/paintings.js";
import {GUI} from "../lib/lil-gui.module.min.js";


//global sources
const textureLoader = new THREE.TextureLoader();

// global variables
let renderer, scene, camera, cameraControls, effectController;

let wall1, wall2, wall3, wall4;

//objects
let paintings = [];

// Secuence of actions
init();
loadScene();
setupLighting();
mouseInteraction(camera);
setupGUI();
render();

function init() {
    // render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    loadFloor(scene, textureLoader, -5);
    loadWalls(scene);
    loadChairs(scene);
    loadTable(scene);
    loadTables(scene);
    loadPaintings(scene);
    paintings = getPaintings();
    createTexts(scene);
}

function render() {
    requestAnimationFrame(render);

    updateMainPaintingRotation();
    
    renderer.render(scene, camera);
}

function loadWalls(scene) {
    wall1 = loadWall(scene, 20.2, 10, { x: 0, y: 0, z: -7.6 }, 0);
    wall2 = loadWall(scene, 20.2, 10, { x: 0, y: 0, z: 7.6 }, 0);
    wall3 = loadWall(scene, 15.2, 10, { x: -10.1, y: 0, z: 0 }, Math.PI / 2);

    const door = { x: 0, y: 0, z: 0, width: 2, height: 3 };
    wall4 = createWallWithOpenings(scene, 15.2, 10, { x: 10.1, y: -5, z: 7.6 }, Math.PI / 2);
}

function setupLighting() {

    const ambiental = new THREE.AmbientLight(0x222222, 1);
    scene.add(ambiental);

    //Room light
    const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight.position.set(0, 5, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);
}

function setupGUI()
{
	// Definicion de los controles
	effectController = {
		colorWall: "rgb(150,150,150)"
	};

	// Creacion interfaz
	const gui = new GUI();

	// Construccion del menu
	const h = gui.addFolder("Control museo");
    h.addColor(effectController, "colorWall")
     .name("Color paredes")
     .onChange(c=>{
        wall1.material.setValues({color:c});
        wall2.material.setValues({color:c});
        wall3.material.setValues({color:c});
        wall4.material.setValues({color:c});
    });
}