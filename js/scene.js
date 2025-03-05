import * as THREE from "../lib/three.module.js";

export function loadWalls(scene) {
    loadWall(scene, 20.2, 10, { x: 0, y: 0, z: -7.6 }, 0);
    loadWall(scene, 20.2, 10, { x: 0, y: 0, z: 7.6 }, 0);
    loadWall(scene, 15.2, 10, { x: 10.1, y: 0, z: 0 }, Math.PI / 2);
    loadWall(scene, 15.2, 10, { x: -10.1, y: 0, z: 0 }, Math.PI / 2);
}

function loadWall(scene, width, height, position, rotation) {
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
