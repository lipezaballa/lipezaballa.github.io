import * as THREE from "../../lib/three.module.js";

export function setUpFocalLighting(scene, painting, scale) {
    console.log("focal light, ", painting.rotation.y);
    console.log(", ", Math.PI);
    console.log(", ", Math.PI / 2);
    const spotlight = new THREE.SpotLight(0xffffff, 0.8); // Luz blanca, intensidad 1.5

    let moveX = 0;
    let moveZ = 0;
    if (painting.rotation.y == 0) {
        moveZ = 2;
        console.log("light front");
    } else if (painting.rotation.y == Math.PI / 2) {
        moveX = 2;
        console.log("light left");
    } else {
        moveZ = -2;
        console.log("light back");
    }


    spotlight.position.set(
        painting.position.x + moveX,
        painting.position.y + 2.5 + scale/2,
        painting.position.z + moveZ
    );
    spotlight.target = painting; // Apuntar directamente al cuadro

    spotlight.angle = Math.PI / 6; // Ángulo del foco (ajústalo según necesites)
    spotlight.penumbra = 0.3; // Difuminado de los bordes de la luz
    spotlight.decay = 0.5; // Atenuación de la luz con la distancia
    spotlight.distance = 10; // Máxima distancia de iluminación
    spotlight.castShadow = true;

    scene.add(spotlight);
}

export function setUpMainFocalLighting(scene, painting) {
    console.log("main focal light");
    scene.add(setUpMainFocalLight(painting, { x: 0, y: 0, z: -2 }));
    scene.add(setUpMainFocalLight(painting, { x: 0, y: 0, z: 2 }));
    scene.add(setUpMainFocalLight(painting, { x: 2, y: 0, z: 0 }));
    scene.add(setUpMainFocalLight(painting, { x: -2, y: 0, z: 0 }));

    /*setUpMainFocalLight(painting, { x: 0, y: 0, z: -2 });
    setUpMainFocalLight(painting, { x: 0, y: 0, z: 2 });
    setUpMainFocalLight(painting, { x: 2, y: 0, z: 0 });
    setUpMainFocalLight(painting, { x: -2, y: 0, z: 0 });*/
}

function setUpMainFocalLight(painting, position) {
    const spotlight = new THREE.SpotLight(0xffffff, 1.5); // Luz blanca, intensidad 1.5
    spotlight.position.set(
        painting.position.x + position.x,
        painting.position.y + 2,
        painting.position.z + position.z
    );
    spotlight.target = painting; // Apuntar directamente al cuadro

    spotlight.angle = Math.PI / 6; // Ángulo del foco (ajústalo según necesites)
    spotlight.penumbra = 0.3; // Difuminado de los bordes de la luz
    spotlight.decay = 1; // Atenuación de la luz con la distancia
    spotlight.distance = 15; // Máxima distancia de iluminación
    spotlight.castShadow = true;

    return spotlight;
    //scene.add(spotlight);
}