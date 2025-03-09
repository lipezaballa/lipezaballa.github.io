import * as THREE from "../../../lib/three.module.js";
import { setUpFocalLighting, setUpMainFocalLighting } from "../illumination.js";
import { FontLoader } from "../../../lib/FontLoader.module.js";
import { TextGeometry } from "../../../lib/TextGeometry.module.js";

//global sources
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load("images/wood512.jpg");

//objects
const paintingsLoaded = [];
const texturesLoaded = [];
let mainPaintingLoaded;
const selectedPaintings = new Map();
const texturesRenacimiento = ['images/artPaintings/Renacimiento/AdanYEva_Tiziano.jpg', 'images/artPaintings/Renacimiento/ElExpolio_ElGreco.jpg', 'images/artPaintings/Renacimiento/LaVeronica_ElGreco.jpg', 'images/artPaintings/Renacimiento/MadonnaSixtina_Sanzio.jpg', 'images/artPaintings/Renacimiento/MonaLisa_DaVinci.jpg', 'images/artPaintings/Renacimiento/TorreBabel_Brueghel.jpg', 'images/artPaintings/Renacimiento/VirgenDeLaRueca_DaVinci.jpg', 'images/artPaintings/Renacimiento/VistaDeToledo_ElGreco.jpg'];
const texturesBarroco = ['images/artPaintings/Barroco/Calvario_Ribera.jpg','images/artPaintings/Barroco/LaRondaDeNoche_Rembrandt.jpg','images/artPaintings/Barroco/LasMeninas_Velazquez.jpg','images/artPaintings/Barroco/LasTresGraciasRubens.jpg','images/artPaintings/Barroco/Magdalena_LaTour.jpg','images/artPaintings/Barroco/MuchachaCarta_Vermeer.jpg','images/artPaintings/Barroco/SansonYDalila_Rubens.jpg','images/artPaintings/Barroco/Uvas_Murillo.jpg'];
const texturesRealismo = ['images/artPaintings/Realismo/AsesinatoMarat_Baudry.jpg','images/artPaintings/Realismo/Coriolano_Leroux.jpg','images/artPaintings/Realismo/ElAventador_Millet.jpg','images/artPaintings/Realismo/LaHermanaMayor_Bouguereau.jpg','images/artPaintings/Realismo/LaLavandera_Daumier.jpg','images/artPaintings/Realismo/octubre_Lepage.jpg','images/artPaintings/Realismo/RetraroVictorHugo_Bonnat.jpg','images/artPaintings/Realismo/SombrasProyectadas_Friant.jpg'];
const periodPosters = [];
const periodsMap = new Map();
periodsMap.set('Renacimiento', texturesRenacimiento);
periodsMap.set('Barroco', texturesBarroco);
periodsMap.set('Realismo', texturesRealismo);

export function getPaintings() {
    return paintingsLoaded;
}

export function getMainPainting() {
    return mainPaintingLoaded;
}

export function updateMainPaintingRotation() {
    if (mainPaintingLoaded != null) {
        mainPaintingLoaded.rotation.y += 0.01;
    }
}

export function mouseInteraction(camera) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Update coordenates
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // click event
    window.addEventListener("click", () => {
        if (paintingsLoaded.length === 0) return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintingsLoaded, true);

        if (intersects.length > 0) {
            // get object
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintingsLoaded.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }

            // search the object where to load the texture
            let paintingObject = null;
            paintingGroup.traverse((child) => {
                if (child.name === 'painting') {
                    paintingObject = child;
                }
            });

            if (paintingObject && paintingObject.material && paintingObject.material.map) {

                mainPaintingLoaded.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.name == 'painting') {
                        if (child.material && child.material.map) {
                            // Modify texture of main painting
                            child.material.map = paintingObject.material.map;
                            child.material.needsUpdate = true;
                        } else {
                            console.warn('El hijo no tiene material o mapa de textura.');
                        }
                    }
                });
            } else {
                console.warn("No se encontró la textura en la pintura seleccionada.");
            }
        }

        const intersectsPeriodPosters = raycaster.intersectObjects(periodPosters, true);
        if (intersectsPeriodPosters.length > 0) {
            let period = intersectsPeriodPosters[0].object;
            while (period.parent && !periodPosters.includes(period)) {
                period = period.parent;
            }

            if (period) {
                //obtain period textures
                let texturesToLoad = periodsMap.get(period.originalText);
                
                // update all textures
                texturesLoaded.forEach((texture, index) => {
                    updateTexture(texture, index, texturesToLoad);
                });

                mainPaintingLoaded.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.name == 'painting') {
                        if (child.material && child.material.map) {
                            updateTexture(child, 0, texturesToLoad);
                        } else {
                            console.warn('El hijo no tiene material o mapa de textura.');
                        }
                    }
                });

            }
        }
    });
}

function updateTexture(texture, index, texturesToLoad) {
    // remove actual texture
    removeTexture(texture);
    // load new one
    const textureLoaded = new THREE.TextureLoader().load(texturesToLoad[index]);
    texture.material.map = textureLoaded;
    // update texture
    texture.material.needsUpdate = true;
}

export function loadPaintings(scene) {
    loadFrontWallPaintings(scene);
    loadBackWallPaintings(scene);
    loadLeftWallPaintings(scene);

    loadArtPaintingGroup(scene, 
        texturesRenacimiento[0],
        3,
        {
            x: 0,
            y: -1,
            z: 0,
        },
        0,
        true
    );
}

export function createTexts(scene) {
    createText(scene,'Renacimiento', { x: 10, y: 3, z: -6 }, {x: 1.8, y: 0.2, z: -0.03}, 3.8);
    createText(scene,'Barroco', { x: 10, y: 3, z: -1 }, {x: 1, y: 0.2, z: -0.03}, 2.5);
    createText(scene,'Realismo', { x: 10, y: 3, z: 3 }, {x: 1, y: 0.2, z: -0.03}, 3);
}

function loadFrontWallPaintings(scene) {
    loadArtPaintingGroup(scene, 
        texturesRenacimiento[0],
        4,
        {
            x: -6,
            y: 0,
            z: -7.5,
        },
        0,
        false
    );
    loadArtPaintingGroup(scene, 
        texturesRenacimiento[1],
        3,
        {
            x: -1.5,
            y: 0,
            z: -7.5,
        },
        0,
        false
    );

    loadArtPaintingGroup(scene, 
        texturesRenacimiento[2],
        5,
        {
            x: 4,
            y: 0,
            z: -7.5,
        },
        0,
        false
    );
}

function loadBackWallPaintings(scene) {
    loadArtPaintingGroup(scene, 
        texturesRenacimiento[3],
        3,
        {
            x: -6,
            y: 0,
            z: 7.5,
        },
        Math.PI,
        false
    );
    loadArtPaintingGroup(scene, 
        texturesRenacimiento[4],
        5,
        {
            x: -2,
            y: 0,
            z: 7.5,
        },
        Math.PI,
        false
    );

    loadArtPaintingGroup(scene, 
        texturesRenacimiento[5],
        4,
        {
            x: 4,
            y: 0,
            z: 7.5,
        },
        Math.PI,
        false
    );
}

function loadLeftWallPaintings (scene) {
    loadArtPaintingGroup(scene, 
        texturesRenacimiento[6],
        4,
        {
            x: -10,
            y: 1,
            z: 3.5,
        },
        Math.PI / 2,
        false
    );

    loadArtPaintingGroup(scene, 
        texturesRenacimiento[7],
        4,
        {
            x: -10,
            y: 1,
            z: -3.5,
        },
        Math.PI / 2,
        false
    );
}

function loadArtPaintingGroup(scene, imagePath, scale, position, rotateY, main) {
    createArtPaintingGroup(scene, imagePath, scale, position, rotateY, main)
        .then((paintingWithFrame) => {
            
            if (main) {
                mainPaintingLoaded = paintingWithFrame;
                setUpMainFocalLighting(scene, paintingWithFrame);
            } else{
                paintingsLoaded.push(paintingWithFrame);
                setUpFocalLighting(scene, paintingWithFrame, scale);
            }
            
            // apply shadows
            paintingWithFrame.traverse(function (object) {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
        })
        .catch((error) => {
            console.error("Error cargando la pintura:", error);
        });
}

function createArtPaintingGroup(scene, imagePath, scale, position, rotateY, main) {
    return loadPainting(imagePath, scale, main).then((painting) => {
        let scaleFrame = 1.1 * scale;
        // create frame of painting
        const frame = createFrame(painting.aspectRatio, scaleFrame);
        frame.name = "frame";

        // create group
        const paintingWithFrame = new THREE.Group();
        paintingWithFrame.add(painting.painting);
        paintingWithFrame.add(frame);

        //add position
        paintingWithFrame.position.set(position.x, position.y, position.z);

        //rotate
        paintingWithFrame.rotateY(rotateY);

        paintingWithFrame.receiveShadow = true;

        scene.add(paintingWithFrame);
        return paintingWithFrame;
    });
}

function loadPainting(imagePath, scale, main) {
    return new Promise((resolve, reject) => {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            imagePath,
            function (paintingTexture) {
                // load dimensions of loaded image
                const width = paintingTexture.image.width;
                const height = paintingTexture.image.height;

                // create geometry with image dimensions
                const aspectRatio = width / height;
                const geometry = new THREE.BoxGeometry(
                    scale * aspectRatio,
                    scale,
                    0.05
                );

                // add material with the image
                const material = new THREE.MeshStandardMaterial({
                    map: paintingTexture,
                });

                // create painting
                const painting = new THREE.Mesh(geometry, material);
                painting.position.set(0, 0, 0);
                painting.name = "painting";

                if (!main) {
                    texturesLoaded.push(painting);
                }

                resolve({ painting, aspectRatio });
            },
            undefined,
            function (error) {
                reject(error);
            }
        );
    });
}

function createFrame(aspectRatio, scaleFrame) {
    // create geometry for the frame
    const frameGeometry = new THREE.BoxGeometry(
        scaleFrame * aspectRatio,
        scaleFrame,
        0.1
    );

    const frameMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // position behind painting
    frame.position.set(0, 0, -0.03);
    return frame;
}

function createText(scene, word, position, dimensionFrame, size) {
    // load font and create text
    const loader = new FontLoader();
    loader.load('fonts/optimer_bold.typeface.json', function (font) {
    const textGeometry = new TextGeometry(word, {
        font: font,
        size: 0.4,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // create geometry for the frame
    const frameGeometry = new THREE.BoxGeometry(
        size,
        1,
        0.1
    );

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Color marrón para el marco
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // position behind painting
    frame.position.set(dimensionFrame.x, dimensionFrame.y, dimensionFrame.z);
    
    // create group and set in scene
    let textGroup = new THREE.Group();
    textGroup.add(textMesh);
    textGroup.add(frame);

    textGroup.position.set(position.x, position.y, position.z);
    textGroup.rotation.y = -Math.PI / 2;
    textGroup.originalText = word;
    scene.add(textGroup);
    periodPosters.push(textGroup);
});
}

function removeTexture(mesh) {
    if (mesh.material.map) {
        // release the texture of memory
        mesh.material.map.dispose();
        mesh.material.map = null;
    }
}