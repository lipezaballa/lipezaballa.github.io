import * as THREE from "../../lib/three.module.js";

export function setUpFocalLighting(scene, painting) {
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
    spotlight.decay = 1; // Atenuación de la luz con la distancia
    spotlight.distance = 15; // Máxima distancia de iluminación
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