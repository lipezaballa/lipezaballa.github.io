import * as THREE from "../../../lib/three.module.js";

export function loadWalls(scene) {
    loadWall(scene, 20.2, 10, { x: 0, y: 0, z: -7.6 }, 0);
    loadWall(scene, 20.2, 10, { x: 0, y: 0, z: 7.6 }, 0);
    loadWall(scene, 15.2, 10, { x: -10.1, y: 0, z: 0 }, Math.PI / 2);

    const door = { x: 0, y: 0, z: 0, width: 2, height: 3 };
    //const wall = loadWall(scene, 15.2, 10, { x: 10.1, y: 0, z: 0 }, Math.PI / 2);
    //createOpening(scene, wall, new THREE.Vector3(door.x, door.y, door.z), { width: door.width, height: door.height })
    scene.add(createWallWithOpenings(scene, 15.2, 10, { x: 10.1, y: -5, z: 7.6 }, Math.PI / 2));


    loadTables(scene);
}

function loadWall(scene, width, height, position, rotation) {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(width, height);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaebd7,
        side: THREE.DoubleSide,
    });
    const wall = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.rotation.x = -Math.PI / 2;
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.y = rotation;

    wall.receiveShadow = true;
    scene.add(wall);
    return wall;
}

export function loadFloor(scene, textureLoader, positionY) {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20.2, 15.2);

    const floorTexture = textureLoader.load(
        "images/room/floor6.jpg",
        function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(8, 4);
        }
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, positionY, 0);

    floor.receiveShadow = true;
    scene.add(floor);
}

function createOpening(scene, wall, position, size) {
    const openingGeometry = new THREE.BoxGeometry(size.width, size.height, wall.geometry.parameters.depth + 0.1);
    const openingMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const opening = new THREE.Mesh(openingGeometry, openingMaterial);
    opening.position.set(position.x, position.y, position.z);
    scene.add(opening);

    // Realizar la sustracción de la pared utilizando CSG
    const wallCSG = new ThreeBSP(wall);
    const openingCSG = new ThreeBSP(opening);
    const newWallCSG = wallCSG.subtract(openingCSG);
    const newWall = newWallCSG.toMesh(wall.material);
    newWall.position.copy(wall.position);
    newWall.rotation.copy(wall.rotation);
    scene.add(newWall);

    // Eliminar la pared original y la abertura auxiliar
    scene.remove(wall);
    scene.remove(opening);

    return newWall;
}

function createWallWithOpenings(scene, width, height, position, rotation) {
    const wallShape = new THREE.Shape();

    // Dimensiones de la pared
    const wallWidth = width;
    const wallHeight = height;

    // Coordenadas de los vértices de la pared
    wallShape.moveTo(0, 0);
    wallShape.lineTo(0, wallHeight);
    wallShape.lineTo(wallWidth, wallHeight);
    wallShape.lineTo(wallWidth, 0);
    wallShape.lineTo(0, 0);

    // Definir la abertura de la puerta
    const doorWidth = 4;
    const doorHeight = 6;
    const doorX = width / 2 - doorWidth / 2; // Posición X de la puerta
    const doorY = 0; // La puerta comienza en la base de la pared
    const doorHole = new THREE.Path();
    doorHole.moveTo(doorX, doorY);
    doorHole.lineTo(doorX, doorY + doorHeight);
    doorHole.lineTo(doorX + doorWidth, doorY + doorHeight);
    doorHole.lineTo(doorX + doorWidth, doorY);
    doorHole.lineTo(doorX, doorY);
    wallShape.holes.push(doorHole);

    // Definir la primera ventana
    /*const windowWidth = 1.5;
    const windowHeight = 1.5;
    const window1X = 3; // Posición X de la primera ventana
    const window1Y = 5; // Posición Y de la primera ventana
    const window1Hole = new THREE.Path();
    window1Hole.moveTo(window1X, window1Y);
    window1Hole.lineTo(window1X, window1Y + windowHeight);
    window1Hole.lineTo(window1X + windowWidth, window1Y + windowHeight);
    window1Hole.lineTo(window1X + windowWidth, window1Y);
    window1Hole.lineTo(window1X, window1Y);
    wallShape.holes.push(window1Hole);

    // Definir la segunda ventana
    const window2X = 10; // Posición X de la segunda ventana
    const window2Y = 5; // Posición Y de la segunda ventana
    const window2Hole = new THREE.Path();
    window2Hole.moveTo(window2X, window2Y);
    window2Hole.lineTo(window2X, window2Y + windowHeight);
    window2Hole.lineTo(window2X + windowWidth, window2Y + windowHeight);
    window2Hole.lineTo(window2X + windowWidth, window2Y);
    window2Hole.lineTo(window2X, window2Y);
    wallShape.holes.push(window2Hole);*/

    // Crear la geometría de la pared con extrusión
    const extrudeSettings = {
        depth: 0.5, // Grosor de la pared
        bevelEnabled: false,
    };
    const wallGeometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);

    // Crear el material y la malla de la pared
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfaebd7, side: THREE.DoubleSide, });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    const wallWithDoorFrame = new THREE.Group();
    wallWithDoorFrame.add(wallMesh);

    let frame = addDoorFrame(doorWidth, doorHeight, doorX, doorY, 0.2);
    wallWithDoorFrame.add(frame);


    wallWithDoorFrame.position.set(position.x, position.y, position.z);
    wallWithDoorFrame.rotation.y = rotation;

    wallWithDoorFrame.receiveShadow = true;
    scene.add(wallWithDoorFrame);

    

    return wallWithDoorFrame;
}

function addDoorFrame(doorWidth, doorHeight, doorX, doorY, wallDepth) {
    const frameThickness = 0.2; // Grosor del marco
    const frameDepth = wallDepth + 0.1; // Profundidad del marco (ligeramente mayor que la pared)

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para el marco

    // Lado izquierdo del marco
    const leftFrameGeometry = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const leftFrameMesh = new THREE.Mesh(leftFrameGeometry, frameMaterial);
    leftFrameMesh.position.set(doorX - frameThickness / 2, doorY + doorHeight / 2, -wallDepth / 2);
    //scene.add(leftFrameMesh);

    // Lado derecho del marco
    const rightFrameGeometry = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const rightFrameMesh = new THREE.Mesh(rightFrameGeometry, frameMaterial);
    rightFrameMesh.position.set(doorX + doorWidth + frameThickness / 2, doorY + doorHeight / 2, -wallDepth / 2);
    //scene.add(rightFrameMesh);

    // Lado superior del marco
    const topFrameGeometry = new THREE.BoxGeometry(doorWidth + 2 * frameThickness, frameThickness, frameDepth);
    const topFrameMesh = new THREE.Mesh(topFrameGeometry, frameMaterial);
    topFrameMesh.position.set(doorX + doorWidth / 2, doorY + doorHeight + frameThickness / 2, -wallDepth / 2);
    
    const frame = new THREE.Group();
    frame.add(leftFrameMesh);
    frame.add(rightFrameMesh);
    frame.add(topFrameMesh);
    return frame;
}

function loadTables(scene) {
    // Parámetros de las mesas
    const tableWidth = 3;
    const tableHeight = 2;
    const tableDepth = 3;
    const legThickness = 0.1;

    // Crear la primera mesa
    createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, { x: 8, y: -5, z: 4.5 });

    // Crear la segunda mesa
    createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, { x: 8, y: -5, z: -4.5 });
}

function createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, position) {
    const tableGroup = new THREE.Group();

    // Crear el tablero de la mesa
    const tabletopGeometry = new THREE.BoxGeometry(tableWidth, legThickness, tableDepth);
    const tabletopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para el tablero
    const tabletopMesh = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    tabletopMesh.position.set(0, tableHeight, 0);
    tableGroup.add(tabletopMesh);

    // Crear una pata de la mesa
    const legGeometry = new THREE.BoxGeometry(legThickness, tableHeight, legThickness);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para las patas

    // Posiciones relativas de las patas
    const legPositions = [
        [-tableWidth / 2 + legThickness / 2, tableHeight / 2, -tableDepth / 2 + legThickness / 2], // Pata frontal izquierda
        [tableWidth / 2 - legThickness / 2, tableHeight / 2, -tableDepth / 2 + legThickness / 2],  // Pata frontal derecha
        [-tableWidth / 2 + legThickness / 2, tableHeight / 2, tableDepth / 2 - legThickness / 2],  // Pata trasera izquierda
        [tableWidth / 2 - legThickness / 2, tableHeight / 2, tableDepth / 2 - legThickness / 2]    // Pata trasera derecha
    ];

    // Crear y posicionar las cuatro patas
    legPositions.forEach(([x, y, z]) => {
        const legMesh = new THREE.Mesh(legGeometry, legMaterial);
        legMesh.position.set(x, y, z);
        tableGroup.add(legMesh);
    });

    // Posicionar la mesa en la escena
    tableGroup.position.set(position.x, position.y, position.z);
    scene.add(tableGroup);
}


