import * as THREE from "../../../lib/three.module.js";


export function loadTable(scene) {
    // Crear el tablero de la mesa (superficie circular)
    const radioTablero = 2; // Radio del tablero
    const grosorTablero = 0.2; // Grosor del tablero
    const segmentosTablero = 32; // Número de segmentos para suavizar el círculo
    const geometriaTablero = new THREE.CylinderGeometry(
        radioTablero,
        radioTablero,
        grosorTablero,
        segmentosTablero
    );
    const materialTablero = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Color marrón
    const tablero = new THREE.Mesh(geometriaTablero, materialTablero);
    tablero.position.set(0, 3, 0); // Posicionar el tablero a una altura de 1 unidad

    // Crear una pata de la mesa
    const alturaPata = 2; // Altura de las patas
    const radioPata = 0.1; // Radio de las patas
    const segmentosPata = 16; // Número de segmentos para suavizar las patas
    const geometriaPata = new THREE.CylinderGeometry(
        radioPata,
        radioPata,
        alturaPata,
        segmentosPata
    );
    const materialPata = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    // Función para crear y posicionar una pata en la circunferencia del tablero
    function crearPata(angulo) {
        const pata = new THREE.Mesh(geometriaPata, materialPata);
        const x = (radioTablero - radioPata) * Math.cos(angulo);
        const z = (radioTablero - radioPata) * Math.sin(angulo);
        pata.position.set(x, 2, z);
        return pata;
    }

    // Número de patas y ángulo entre ellas
    const numeroPatas = 4;
    const anguloEntrePatas = (2 * Math.PI) / numeroPatas;

    // Crear y posicionar las patas
    const patas = [];
    for (let i = 0; i < numeroPatas; i++) {
        const angulo = i * anguloEntrePatas;
        const pata = crearPata(angulo);
        patas.push(pata);
    }

    // Crear un grupo para la mesa
    const mesa = new THREE.Group();
    mesa.add(tablero);
    patas.forEach((pata) => mesa.add(pata));

    mesa.position.set(0, -5, 0);

    // Añadir la mesa a la escena
    scene.add(mesa);
}

export function loadChairs(scene) {
    // Añadir la silla a la escena
    scene.add(loadChair({ x: -8, y: -5, z: -4.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: 1.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: -1.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: 4.5 }));


    /*loadChair({ x: -8, y: -5, z: -4.5 });
    loadChair({ x: -8, y: -5, z: 1.5 });
    loadChair({ x: -8, y: -5, z: -1.5 });
    loadChair({ x: -8, y: -5, z: 4.5 });*/
}

function loadChair(position) {
    // Crear el asiento
    const geometriaAsiento = new THREE.BoxGeometry(2, 0.2, 2);
    const materialAsiento = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Color marrón
    const asiento = new THREE.Mesh(geometriaAsiento, materialAsiento);
    asiento.position.set(0, 1, 0);

    // Crear el respaldo
    const geometriaRespaldo = new THREE.BoxGeometry(2, 2, 0.2);
    const materialRespaldo = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
    });
    const respaldo = new THREE.Mesh(geometriaRespaldo, materialRespaldo);
    respaldo.position.set(0, 2, -0.9);

    // Crear una pata
    const geometriaPata = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const materialPata = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const pata1 = new THREE.Mesh(geometriaPata, materialPata);
    pata1.position.set(0.9, 0.5, 0.9);

    // Clonar las otras tres patas
    const pata2 = pata1.clone();
    pata2.position.set(-0.9, 0.5, 0.9);

    const pata3 = pata1.clone();
    pata3.position.set(0.9, 0.5, -0.9);

    const pata4 = pata1.clone();
    pata4.position.set(-0.9, 0.5, -0.9);

    // Crear un grupo para la silla
    const silla = new THREE.Group();
    silla.add(asiento);
    silla.add(respaldo);
    silla.add(pata1);
    silla.add(pata2);
    silla.add(pata3);
    silla.add(pata4);

    silla.rotation.y = Math.PI / 2;
    silla.position.set(position.x, position.y, position.z);

    return silla;
}

/*function loadChair2() {
    // Crear el asiento circular
    const radioAsiento = 1; // Radio del asiento
    const segmentosAsiento = 32; // Número de segmentos para suavizar el círculo
    const geometriaAsiento = new THREE.CircleGeometry(
        radioAsiento,
        segmentosAsiento
    );
    const materialAsiento = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Color marrón
    const asiento = new THREE.Mesh(geometriaAsiento, materialAsiento);
    asiento.rotation.x = -Math.PI / 2; // Orientar el asiento horizontalmente
    asiento.position.set(0, 1.5, 0); // Posicionar el asiento

    // Crear el respaldo curvado
    const radioRespaldo = 1; // Radio de la curva del respaldo
    const segmentosRespaldo = 32; // Número de segmentos para suavizar la curva
    const geometriaRespaldo = new THREE.CylinderGeometry(
        radioRespaldo,
        radioRespaldo,
        0.2,
        segmentosRespaldo,
        1,
        true
    );
    const materialRespaldo = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
    });
    const respaldo = new THREE.Mesh(geometriaRespaldo, materialRespaldo);
    respaldo.rotation.x = -Math.PI / 2; // Orientar la curva del respaldo
    respaldo.position.set(0, 2.5, -0.9); // Posicionar el respaldo detrás del asiento

    // Crear las patas
    const alturaPata = 2; // Altura de las patas
    const radioPata = 0.1; // Radio de las patas
    const segmentosPata = 16; // Número de segmentos para suavizar las patas
    const materialPata = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    // Función para crear una pata en una posición específica
    function crearPata(x, z) {
        const geometriaPata = new THREE.CylinderGeometry(
            radioPata,
            radioPata,
            alturaPata,
            segmentosPata
        );
        const pata = new THREE.Mesh(geometriaPata, materialPata);
        pata.rotation.z = Math.PI / 2; // Orientar la pata verticalmente
        pata.position.set(x, alturaPata / 2, z);
        return pata;
    }

    // Crear las cuatro patas
    const pata1 = crearPata(0.9, 0.9);
    const pata2 = crearPata(-0.9, 0.9);
    const pata3 = crearPata(0.9, -0.9);
    const pata4 = crearPata(-0.9, -0.9);

    // Crear un grupo para la silla
    const silla = new THREE.Group();
    silla.add(asiento);
    silla.add(respaldo);
    silla.add(pata1);
    silla.add(pata2);
    silla.add(pata3);
    silla.add(pata4);

    // Añadir la silla a la escena
    scene.add(silla);
}*/