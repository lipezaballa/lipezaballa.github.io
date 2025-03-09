import * as THREE from "../../../lib/three.module.js";


export function loadTable(scene) {
    // circular surface
    const ratioTable = 2;
    const thicknessTable = 0.2;
    const segmentsTable = 32;
    const geometryTable = new THREE.CylinderGeometry(
        ratioTable,
        ratioTable,
        thicknessTable,
        segmentsTable
    );
    const materialTable = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const tableTop = new THREE.Mesh(geometryTable, materialTable);
    tableTop.position.set(0, 3, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    // legs of the table
    const heightLeg = 2;
    const ratioLeg = 0.1;
    const segmentsLeg = 16;
    const geometryLeg = new THREE.CylinderGeometry(
        ratioLeg,
        ratioLeg,
        heightLeg,
        segmentsLeg
    );
    const materialLeg = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    function createLeg(angulo) {
        const leg = new THREE.Mesh(geometryLeg, materialLeg);
        const x = (ratioTable - ratioLeg) * Math.cos(angulo);
        const z = (ratioTable - ratioLeg) * Math.sin(angulo);
        leg.position.set(x, 2, z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        return leg;
    }

    const numberLegs = 4;
    const angleBetweenLegs = (2 * Math.PI) / numberLegs;

    const legs = [];
    for (let i = 0; i < numberLegs; i++) {
        const angle = i * angleBetweenLegs;
        const leg = createLeg(angle);
        legs.push(leg);
    }

    const table = new THREE.Group();
    table.add(tableTop);
    legs.forEach((pata) => table.add(pata));

    table.position.set(0, -6, 0);
    table.castShadow = true;
    table.receiveShadow = true;

    scene.add(table);
}

export function loadChairs(scene) {
    scene.add(loadChair({ x: -8, y: -5, z: -4.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: 1.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: -1.5 }));
    scene.add(loadChair({ x: -8, y: -5, z: 4.5 }));
}

function loadChair(position) {
    // Create surface
    const geomterySeat = new THREE.BoxGeometry(2, 0.2, 2);
    const materialSeat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const seat = new THREE.Mesh(geomterySeat, materialSeat);
    seat.position.set(0, 1, 0);

    // Create chair back
    const geometryBack = new THREE.BoxGeometry(2, 2, 0.2);
    const materialBack = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
    });
    const back = new THREE.Mesh(geometryBack, materialBack);
    back.position.set(0, 2, -0.9);

    // create legs of chair
    const geometryLeg = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const materialLeg = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const leg1 = new THREE.Mesh(geometryLeg, materialLeg);
    leg1.position.set(0.9, 0.5, 0.9);

    const leg2 = leg1.clone();
    leg2.position.set(-0.9, 0.5, 0.9);

    const leg3 = leg1.clone();
    leg3.position.set(0.9, 0.5, -0.9);

    const leg4 = leg1.clone();
    leg4.position.set(-0.9, 0.5, -0.9);

    const chair = new THREE.Group();
    chair.add(seat);
    chair.add(back);
    chair.add(leg1);
    chair.add(leg2);
    chair.add(leg3);
    chair.add(leg4);

    chair.rotation.y = Math.PI / 2;
    chair.position.set(position.x, position.y, position.z);

    // apply shadows
    chair.traverse(function (object) {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    return chair;
}

export function loadTables(scene) {
    const tableWidth = 3;
    const tableHeight = 2;
    const tableDepth = 3;
    const legThickness = 0.1;

    createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, { x: 8, y: -5, z: 4.5 });

    createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, { x: 8, y: -5, z: -4.5 });
}

function createTable(scene, tableWidth, tableHeight, tableDepth, legThickness, position) {
    const tableGroup = new THREE.Group();

    // create the table top
    const tabletopGeometry = new THREE.BoxGeometry(tableWidth, legThickness, tableDepth);
    const tabletopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para el tablero
    const tabletopMesh = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    tabletopMesh.position.set(0, tableHeight, 0);
    tableGroup.add(tabletopMesh);

    // create table legs
    const legGeometry = new THREE.BoxGeometry(legThickness, tableHeight, legThickness);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para las patas

    // relative positions of legs
    const legPositions = [
        [-tableWidth / 2 + legThickness / 2, tableHeight / 2, -tableDepth / 2 + legThickness / 2],
        [tableWidth / 2 - legThickness / 2, tableHeight / 2, -tableDepth / 2 + legThickness / 2],
        [-tableWidth / 2 + legThickness / 2, tableHeight / 2, tableDepth / 2 - legThickness / 2],
        [tableWidth / 2 - legThickness / 2, tableHeight / 2, tableDepth / 2 - legThickness / 2]
    ];

    // place the legs
    legPositions.forEach(([x, y, z]) => {
        const legMesh = new THREE.Mesh(legGeometry, legMaterial);
        legMesh.position.set(x, y, z);
        tableGroup.add(legMesh);
    });

    // set position of the group
    tableGroup.position.set(position.x, position.y, position.z);

    // apply shadows
    tableGroup.traverse(function (object) {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    scene.add(tableGroup);
}