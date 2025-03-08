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
const periodPosters = [];
const periodsMap = new Map();
periodsMap.set('Renacimiento', texturesRenacimiento);
periodsMap.set('Barroco', texturesBarroco);

export function getPaintings() {
    return paintingsLoaded;
}

export function getMainPainting() {
    console.log("mainPaintedLoaded: ", mainPaintingLoaded);
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

    // Actualizar las coordenadas del ratón al moverlo
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Evento de clic para seleccionar la pintura
    window.addEventListener("click", () => {
        if (paintingsLoaded.length === 0) return;

        // Configurar el raycaster según la posición actual del ratón y la cámara
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintingsLoaded, true);

        if (intersects.length > 0) {
            // Obtener el objeto de la pintura seleccionada
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintingsLoaded.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }

            // Buscar el objeto painting dentro del grupo
            let paintingObject = null;
            paintingGroup.traverse((child) => {
                console.log("Child: ", child.name);
                if (child.name === 'painting') { // Asegúrate de que el objeto tenga el nombre 'painting'
                    paintingObject = child;
                    console.log("painted");
                }
            });

            if (paintingObject && paintingObject.material && paintingObject.material.map) {
                // Supongamos que 'paintingWithFrame' es tu objeto Group que contiene múltiples hijos

                mainPaintingLoaded.traverse((child) => {
                    console.log("child 2: ", child.name);
                    if (child instanceof THREE.Mesh && child.name == 'painting') {
                        // Verificamos si el hijo es una malla
                        if (child.material && child.material.map) {
                            // Accedemos y modificamos la textura del material
                            child.material.map = paintingObject.material.map; // 'nuevaTextura' es una instancia de THREE.Texture
                            child.material.needsUpdate = true; // Indicamos que el material necesita ser actualizado
                        } else {
                            console.warn('El hijo no tiene material o mapa de textura.');
                        }
                    }
                });



                
                // Asignar la textura al material del mainPainting
                //mainPaintingLoaded.material.map = paintingObject.material.map;
                //mainPaintingLoaded.material.needsUpdate = true; // Marcar que el material necesita actualización
            } else {
                console.warn("No se encontró la textura en la pintura seleccionada.");
            }


            // Obtener la textura del material de la pintura seleccionada
            /*const selectedTexture = paintingGroup.material.map;

            if (selectedTexture) {
                // Asignar la textura al material del mainPainting
                mainPainting.material.map = selectedTexture;
                mainPainting.material.needsUpdate = true; // Marcar que el material necesita actualización
            } else {
                console.warn("La pintura seleccionada no tiene una textura asignada.");
            }*/
        }

        const intersectsPeriodPosters = raycaster.intersectObjects(periodPosters, true);
        if (intersectsPeriodPosters.length > 0) {
            // Obtener el objeto de la pintura seleccionada
            let period = intersectsPeriodPosters[0].object;
            while (period.parent && !periodPosters.includes(period)) {
                period = period.parent;
            }

            if (period) {
                //obtain period textures
                let texturesToLoad = periodsMap.get(period.originalText);
                console.log("Texture load: ", period.originalText);
                
            // Iterar sobre cada cuadro y actualizar su textura
            texturesLoaded.forEach((texture, index) => {
                updateTexture(texture, index, texturesToLoad);
            });

            mainPaintingLoaded.traverse((child) => {
                console.log("child 2: ", child.name);
                if (child instanceof THREE.Mesh && child.name == 'painting') {
                    // Verificamos si el hijo es una malla
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
    console.log("Removing texture");
                // Eliminar la textura actual
                removeTexture(texture);
                // Cargar la nueva textura
                const textureLoaded = new THREE.TextureLoader().load(texturesToLoad[index]);
                // Asignar la nueva textura al material del cuadro
                texture.material.map = textureLoaded;
                // Actualizar el material para reflejar el cambio
                texture.material.needsUpdate = true;
}

/*export function mouseInteraction(camera) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let paintingSeleccionado = false;

    // rotate slithly when mouse over painting
    /*window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (paintings.length === 0) return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintings, true);

        paintings.forEach((painting) => {
            painting.rotation.y = 0;
        });

        if (intersects.length > 0) {
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintings.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }
            paintingGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.1; // Rotación ligera
        }
    });

    // click event to zoom
    window.addEventListener("click", () => {
        console.log("Clicked");
        if (paintingsLoaded.length === 0) return;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(paintingsLoaded, true);

        if (intersects.length > 0) {
            console.log("Cuadro clicked");
            let paintingGroup = intersects[0].object;
            while (paintingGroup.parent && !paintingsLoaded.includes(paintingGroup)) {
                paintingGroup = paintingGroup.parent;
            }

            mainPaintingLoaded = paintingGroup;
            /*if (paintingGroup == mainPaintingLoaded) {
                console.log("It is the main");
                return;
            }

            //check if painting already selected
            const paintingSelected =
                selectedPaintings.get(paintingGroup) || false;

            if (!paintingSelected) {
                paintingGroup.position.z += 3; // Acercar el painting
                paintingGroup.position.y += 1;
                console.log("zoom");
                //painting.material.map = paintingTexture2; // Cambiar la textura
            } else {
                paintingGroup.position.z -= 3; // Alejar el painting
                paintingGroup.position.y -= 1;
                //painting.material.map = paintingTexture1; // Volver a la textura original
            }

            //save selection
            selectedPaintings.set(paintingGroup, !paintingSelected);
        }
    });
}*/

export function loadPaintings(scene) {
    loadFrontWallPaintings(scene);
    loadBackWallPaintings(scene);
    loadLeftWallPaintings(scene);
    //loadRightWallPaintings(scene);

    loadArtPaintingGroup(scene, 
        texturesRenacimiento[0],
        3,
        {
            x: 0,
            y: 1,
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

function loadRightWallPaintings(scene) {
    /*loadArtPaintingGroup(scene, 
        "images/artPaintings/LaRondaDeNoche_Rembrandt.jpg",
        8,
        {
            x: 10,
            y: 0,
            z: 0,
        },
        -Math.PI / 2,
        false
    );*/

    /*loadArtPaintingGroup(scene, 
        "images/artPaintings/LaRondaDeNoche_Rembrandt.jpg",
        2,
        {
            x: 10,
            y: 0,
            z: 3.5,
        },
        -Math.PI / 2,
        false
    );

    loadArtPaintingGroup(scene, 
        "images/artPaintings/LaRondaDeNoche_Rembrandt.jpg",
        2,
        {
            x: 10,
            y: 0,
            z: -3.5,
        },
        -Math.PI / 2,
        false
    );

    loadArtPaintingGroup(scene, 
        "images/artPaintings/LaRondaDeNoche_Rembrandt.jpg",
        2,
        {
            x: 10,
            y: 0,
            z: -7,
        },
        -Math.PI / 2,
        false
    );*/
}

function loadArtPaintingGroup(scene, imagePath, scale, position, rotateY, main) {
    createArtPaintingGroup(scene, imagePath, scale, position, rotateY, main)
        .then((paintingWithFrame) => {
            //return paintingWithFrame;
            console.log("Adding painting");
            
            if (main) {
                mainPaintingLoaded = paintingWithFrame;
                setUpMainFocalLighting(scene, paintingWithFrame);
            } else{
                paintingsLoaded.push(paintingWithFrame);
                setUpFocalLighting(scene, paintingWithFrame);
            }
            
            
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

        //paintingWithFrame.castShadow = true;
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
                ); //FIXME, scale 2 by default

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
                
                console.log("Texture loaded");

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
    ); // FIXME scale 2.2 by default

    const frameMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // position behind painting
    frame.position.set(0, 0, -0.03);
    return frame;
}

/*export function loadMirror (scene, aspectRatio, position) {
    const geometry = new THREE.PlaneGeometry(aspectRatio* 1024, 1024); // Define las dimensiones del espejo
    const reflector = new THREE.Reflector(geometry, {
        clipBias: 0.003, // Ajusta la precisión del reflejo
        textureWidth: aspectRatio * 1024, // Ancho de la textura del reflejo
        textureHeight: 1024, // Alto de la textura del reflejo
        color: 0x777777 // Color del espejo
    });
    reflector.position.set(0, 0, 0); // Posiciona el espejo en la escena

    const frame = createFrame(painting.aspectRatio, scaleFrame);

    // create group
    const mirrorWithFrame = new THREE.Group();
    mirrorWithFrame.add(reflector);
    mirrorWithFrame.add(frame);

    //add position
    mirrorWithFrame.position.set(position.x, position.y, position.z);

    mirrorWithFrame.castShadow = true;
    mirrorWithFrame.receiveShadow = true;

    scene.add(mirrorWithFrame);
}*/

function createText(scene, word, position, dimensionFrame, size) {
    // Cargar la fuente y crear el texto
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
        

    // Posicionar el texto en la escena

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

// Función para eliminar la textura de un objeto
function removeTexture(mesh) {
    if (mesh.material.map) {
        // Liberar la textura de la memoria
        mesh.material.map.dispose();
        // Establecer la propiedad map a null
        mesh.material.map = null;
    }
}