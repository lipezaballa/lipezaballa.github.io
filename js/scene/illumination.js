import * as THREE from "../../lib/three.module.js";

export function setUpFocalLighting(scene, painting, scale) {
    const spotlight = new THREE.SpotLight(0xffffff, 0.8);

    // set values of parameters to allocate the focal lights with a better angle 
    let moveX = 0;
    let moveZ = 0;
    if (painting.rotation.y == 0) {
        moveZ = 2;
    } else if (painting.rotation.y == Math.PI / 2) {
        moveX = 2;
    } else {
        moveZ = -2;
    }

    // set position
    spotlight.position.set(
        painting.position.x + moveX,
        painting.position.y + 2.5 + scale/2,
        painting.position.z + moveZ
    );

    // set target to the painting
    spotlight.target = painting;

    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    spotlight.decay = 0.5;
    spotlight.distance = 10;
    spotlight.castShadow = true;

    scene.add(spotlight);
}

export function setUpMainFocalLighting(scene, painting) {
    scene.add(setUpMainFocalLight(painting, { x: 0, y: 0, z: -2 }));
    scene.add(setUpMainFocalLight(painting, { x: 0, y: 0, z: 2 }));
    scene.add(setUpMainFocalLight(painting, { x: 2, y: 0, z: 0 }));
    scene.add(setUpMainFocalLight(painting, { x: -2, y: 0, z: 0 }));
}

function setUpMainFocalLight(painting, position) {
    const spotlight = new THREE.SpotLight(0xffffff, 1.5);
    spotlight.position.set(
        painting.position.x + position.x,
        painting.position.y + 2,
        painting.position.z + position.z
    );
    spotlight.target = painting;

    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    spotlight.decay = 1;
    spotlight.distance = 15;
    spotlight.castShadow = true;

    return spotlight;
}