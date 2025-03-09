import * as THREE from "../../../lib/three.module.js";

export function loadWall(scene, width, height, position, rotation) {
    const floorGeometry = new THREE.PlaneGeometry(width, height);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaebd7,
        side: THREE.DoubleSide,
    });
    const wall = new THREE.Mesh(floorGeometry, floorMaterial);
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.y = rotation;

    wall.receiveShadow = true;
    scene.add(wall);
    return wall;
}

export function loadFloor(scene, textureLoader, positionY) {
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

export function createWallWithOpenings(scene, width, height, position, rotation) {
    const wallShape = new THREE.Shape();

    const wallWidth = width;
    const wallHeight = height;

    // coordinates of the wall vertices
    wallShape.moveTo(0, 0);
    wallShape.lineTo(0, wallHeight);
    wallShape.lineTo(wallWidth, wallHeight);
    wallShape.lineTo(wallWidth, 0);
    wallShape.lineTo(0, 0);

    // define door opening
    const doorWidth = 4;
    const doorHeight = 6;
    const doorX = width / 2 - doorWidth / 2;
    const doorY = 0;
    const doorHole = new THREE.Path();
    doorHole.moveTo(doorX, doorY);
    doorHole.lineTo(doorX, doorY + doorHeight);
    doorHole.lineTo(doorX + doorWidth, doorY + doorHeight);
    doorHole.lineTo(doorX + doorWidth, doorY);
    doorHole.lineTo(doorX, doorY);
    wallShape.holes.push(doorHole);

    const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: false,
    };
    const wallGeometry = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);

    // create mesh
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfaebd7, side: THREE.DoubleSide, });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    const wallWithDoorFrame = new THREE.Group();
    wallWithDoorFrame.add(wallMesh);

    // add frame to the door
    let frame = addDoorFrame(doorWidth, doorHeight, doorX, doorY, 0.2);
    wallWithDoorFrame.add(frame);

    // set position
    wallWithDoorFrame.position.set(position.x, position.y, position.z);
    wallWithDoorFrame.rotation.y = rotation;

    wallWithDoorFrame.receiveShadow = true;
    scene.add(wallWithDoorFrame);

    return wallMesh;
}

function addDoorFrame(doorWidth, doorHeight, doorX, doorY, wallDepth) {
    const frameThickness = 0.2;
    const frameDepth = wallDepth + 0.1;

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

    // left part of frame
    const leftFrameGeometry = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const leftFrameMesh = new THREE.Mesh(leftFrameGeometry, frameMaterial);
    leftFrameMesh.position.set(doorX - frameThickness / 2, doorY + doorHeight / 2, -wallDepth / 2);

    // right part of frame
    const rightFrameGeometry = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const rightFrameMesh = new THREE.Mesh(rightFrameGeometry, frameMaterial);
    rightFrameMesh.position.set(doorX + doorWidth + frameThickness / 2, doorY + doorHeight / 2, -wallDepth / 2);

    // top part of frame
    const topFrameGeometry = new THREE.BoxGeometry(doorWidth + 2 * frameThickness, frameThickness, frameDepth);
    const topFrameMesh = new THREE.Mesh(topFrameGeometry, frameMaterial);
    topFrameMesh.position.set(doorX + doorWidth / 2, doorY + doorHeight + frameThickness / 2, -wallDepth / 2);
    
    const frame = new THREE.Group();
    frame.add(leftFrameMesh);
    frame.add(rightFrameMesh);
    frame.add(topFrameMesh);
    return frame;
}


