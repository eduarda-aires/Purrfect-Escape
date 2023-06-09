import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


document.getElementById("loading-screen").style.visibility = "visible";
document.getElementById("pawprintw").style.visibility = "hidden";
document.getElementById("pawprintb").style.visibility = "hidden";
document.getElementById("pawprintg").style.visibility = "hidden";
document.getElementById("pawprinto").style.visibility = "hidden";

setTimeout(function() {
    document.getElementById("loading-screen").style.visibility = "hidden";
    document.getElementById("pawprintw").style.visibility = "visible";
    document.getElementById("pawprintb").style.visibility = "visible";
    document.getElementById("pawprintg").style.visibility = "visible";
    document.getElementById("pawprinto").style.visibility = "visible";

}, 2000);


let sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null, 
    renderer: null,
};

let walls = [];
let powerups = [];

function initEmptyScene (sceneElements) {

    sceneElements.sceneGraph = new THREE.Scene();

    /* let axesHelper = new THREE.AxesHelper( 50 );
    sceneElements.sceneGraph.add( axesHelper ); */

    let width = window.innerWidth;
    let height = window.innerHeight;
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    sceneElements.camera = camera;
    camera.position.set(0, 40, 40);
    camera.up.set(0, 0, 1);
    camera.name = "camera";
    sceneElements.sceneGraph.add(camera);


    let ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
    sceneElements.sceneGraph.add(ambientLight);

    var hemisphericLight = new THREE.HemisphereLight('yellow', 'crimson', 0.2);
    sceneElements.sceneGraph.add(hemisphericLight);
    
    let spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 1);
    spotLight.position.set(0, 30, 0);
    sceneElements.sceneGraph.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.name = "light";


    let renderer = new THREE.WebGLRenderer({ antialias: true });
    sceneElements.renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor('rgb(135, 206, 235)', 1.0);
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //Orbit Controls
    const control = new OrbitControls( camera, renderer.domElement );
    control.enablePan = false;
    control.enableRotate = false;
    control.enableZoom = false;
 
    let htmlElement = document.querySelector("#Tag3DScene");
    htmlElement.appendChild(renderer.domElement);
};

function render(sceneElements) {
    sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
};

initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
window.addEventListener('resize', resizeWindow);
requestAnimationFrame(computeFrame);

// Event Listeners
let keyD = false, keyA = false, keyS = false, keyW = false, keySpace = false, keyT = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function resizeWindow(eventParam) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();
    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
        case 32: //space
            keySpace = true;
            break;
        // letter T
        case 84:
            keyT = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
        case 32: //space
            keySpace = false;
            break;
        // letter T
        case 84:
            keyT = false;
            break;
    }
}

let mixer;
let action;
let action2;

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    let bgloader = new THREE.TextureLoader();
    let bgTexture = bgloader.load('./textures/bluegrad.png');
    sceneGraph.background = bgTexture;


    const loader = new GLTFLoader();
    // load the player's cat
    loader.load( './models/tuxedoCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let cat = gltf.scene.children[0];
        cat.scale.set(0.15, 0.15, 0.15);
        cat.translateX(20);
        cat.translateY(5);
        cat.translateZ(0);
        cat.rotateZ(Math.PI / -2);
        cat.name = "cat";
        
        sceneGraph.add( cat );

        cat.add(sceneElements.camera);
        let camera = sceneElements.sceneGraph.getObjectByName("camera");
        camera.position.set(0, 20, 25);     // camera setting to play the game
        camera.rotateX(-Math.PI/0.101);

        if (cat) {
        mixer = new THREE.AnimationMixer( cat );
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName( clips, 'IdleNorm' );
        action = mixer.clipAction( clip );
        action.play();

        const clip2 = THREE.AnimationClip.findByName( clips, 'WalkCycle' );
        action2 = mixer.clipAction( clip2 );
        }

    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );


    function createPowa(x, y, z, name) {

        const powaloader = new GLTFLoader();

        loader.load( './models/powerUp/scene.gltf', function ( gltf ) {
            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    child.castShadow = true;
                }

            } );
            let powa = gltf.scene.children[0];
            powa.scale.set(0.003, 0.003, 0.003);
            powa.name = "powa";
            powa.castShadow = true;
            powa.receiveShadow = true;
            sceneGraph.add( powa );
            powa.position.set(x, y, z);
            powa.name = name;
            return powa;
        }, undefined, function ( error ) {
            console.error( error );
        }
        );
    }

        let powa1 = createPowa(-15, 1, -5, "powa1");
        let powa2 = createPowa(25, 1, 25, "powa2");
        powerups.push(powa1);
        powerups.push(powa2);
    
    const groundtexture = new THREE.TextureLoader().load('./textures/stonyground.png' );
    groundtexture.wrapS = THREE.RepeatWrapping;
    groundtexture.wrapT = THREE.RepeatWrapping;
    groundtexture.repeat.set( 4, 4 );
    let groundmaterial = new THREE.MeshPhongMaterial( { map:groundtexture , side: THREE.DoubleSide} );

    let planeGeometry = new THREE.PlaneGeometry(60, 60);
    let planeMaterial = new THREE.MeshPhongMaterial({ color: 'gray', side: THREE.DoubleSide });
    let planeObject = new THREE.Mesh(planeGeometry, groundmaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    const grasstexture = new THREE.TextureLoader().load('./textures/grassy.png' );
    grasstexture.wrapS = THREE.RepeatWrapping;
    grasstexture.wrapT = THREE.RepeatWrapping;
    grasstexture.repeat.set( 0.06, 0.06 );
    const grassmaterial = new THREE.MeshPhongMaterial( { map:grasstexture , side: THREE.DoubleSide} );
    grassmaterial.polygonOffset = true;
    grassmaterial.polygonOffsetFactor = -0.1;
    grassmaterial.polygonOffsetUnits = -1;

    let length = 10, width = 5;

    let wall = new THREE.Shape();
    wall.moveTo( 0,0 );
    wall.lineTo( 0, width );
    wall.lineTo( length, width );
    wall.lineTo( length, 0 );
    wall.lineTo( 0, 0 );

    let extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 2,
        bevelSegments: 1
    };

    let wall_geometry = new THREE.ExtrudeGeometry( wall, extrudeSettings );
    let wall_material = new THREE.MeshBasicMaterial( { color: 0x55ff55} );

    function createWall(x, y, z, rotation){
        let wall = new THREE.Mesh( wall_geometry, grassmaterial ) ;
        sceneGraph.add( wall );
        wall.castShadow = true;

        wall.translateX(x).translateY(y).translateZ(z);
        wall.rotateY(rotation);
        return wall;
        //wall.material.receiveShadow = true;
    }
    
    const wall1 = createWall(20, 0, -10, 0);
    walls.push(wall1);

    const wall2 = createWall(20, 0, 0, 0);
    walls.push(wall2);

    const wall3 = createWall(20, 0, 10, Math.PI/2);
    walls.push(wall3);

    const wall4 = createWall(10, 0, -10, Math.PI/2);
    walls.push(wall4);

    const wall5 = createWall(10, 0, 10, Math.PI/2);
    walls.push(wall5);

    const wall6 = createWall(10, 0, 10, 0);
    walls.push(wall6);

    const wall7 = createWall(10, 0, -10, 0);
    walls.push(wall7);

    const wall8 = createWall(0, 0, 0, 0);
    walls.push(wall8);

    const wall9 = createWall(0, 0, 10, Math.PI/2);
    walls.push(wall9);

    const wall10 = createWall(0, 0, 20, Math.PI/2);
    walls.push(wall10);

    const wall11 = createWall(0, 0, 20, 0);
    walls.push(wall11);

    const wall12 = createWall(-30, 0, 20, 0);
    walls.push(wall12);

    const wall13 = createWall(-30, 0, 10, 0);
    walls.push(wall13);

    const wall14 = createWall(-20, 0, 20, 0);
    walls.push(wall14);

    const wall15 = createWall(-20, 0, 10, 0);
    walls.push(wall15);

    const wall16 = createWall(-10, 0, 10, Math.PI/2);
    walls.push(wall16);

    const wall17 = createWall(-20, 0, 0, 0);
    walls.push(wall17);

    const wall18 = createWall(-20, 0, -10, 0);
    walls.push(wall18);

    const wall19 = createWall(-20, 0, 0, Math.PI/2);
    walls.push(wall19);

    const wall20 = createWall(-10, 0, 30, 0);
    walls.push(wall20);

    const wall21 = createWall(-20, 0 ,-10, Math.PI/2);
    walls.push(wall21);

    const wall22 = createWall(-20, 0, 10, 0);
    walls.push(wall22);

    const wall23 = createWall(-10, 0, -20, 0);
    walls.push(wall23);

    const wall24 = createWall(-10, 0, -20, Math.PI/2);
    walls.push(wall24);

    const wall25 = createWall(-10, 0, -10, 0);
    walls.push(wall25);

    const wall26 = createWall(10, 0, -20, 0);
    walls.push(wall26);

    const wall27 = createWall(20, 0, 20, 0);
    walls.push(wall27);
    
    //MAZE OUTLINE on z = 30
    const wall28 = createWall(0, 0, 30, 0);
    walls.push(wall28);
    const wall29 = createWall(10, 0, 30, 0);
    walls.push(wall29);
    const wall30 = createWall(20, 0, 30, 0);
    walls.push(wall30);
    const wall31 = createWall(-30, 0, 30, 0);
    walls.push(wall31);
    const wall32 = createWall(-20, 0, 30, 0);
    walls.push(wall32);

    //MAZE OUTLINE on z = -30
    createWall(0, 0, -30, 0);
    createWall(10, 0, -30, 0);
    createWall(20, 0, -30, 0);
    createWall(-30, 0, -30, 0);
    createWall(-20, 0, -30, 0);
    createWall(-10, 0, -30, 0);

    //MAZE OUTLINE on x = 30
    //createWall(30, 0, 0, Math.PI/2); THIS IS THE ENTRANCE - NO WALL
    createWall(30, 0, 10, Math.PI/2);
    createWall(30, 0, 20, Math.PI/2);
    createWall(30, 0, -10, Math.PI/2);
    createWall(30, 0, -20, Math.PI/2);
    createWall(30, 0, 30, Math.PI/2);

    //MAZE OUTLINE on x = -30
    createWall(-30, 0, 0, Math.PI/2);
    createWall(-30, 0, 10, Math.PI/2);
    //createWall(-30, 0, 20, Math.PI/2); THIS IS THE EXIT - NO WALL
    createWall(-30, 0, 30, Math.PI/2);
    createWall(-30, 0, -10, Math.PI/2);
    createWall(-30, 0, -20, Math.PI/2);

    console.log("walls", walls);

    // Let's create the remaining kittens!
    // OrangeCat
    loader.load( './models/orangeCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let oraCat = gltf.scene.children[0];
        oraCat.scale.set(0.7, 0.7, 0.7);
        oraCat.position.set(15, 0.5, -15);
        oraCat.rotateZ(Math.PI/2);
        oraCat.name = "oraCat";
        sceneGraph.add( oraCat );
    }, undefined, function ( error ) {        
        console.error( error );
    } );

    // Gray Cat
    loader.load( './models/grayCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let grayCat = gltf.scene.children[0];
        grayCat.scale.set(0.9, 0.9, 0.9);
        grayCat.position.set(-25, 0, 25);
        grayCat.rotateZ(Math.PI/2);
        grayCat.name = "grayCat";
        sceneGraph.add( grayCat );
    }, undefined, function ( error ) {        
        console.error( error );
    } );

    // Brown Cat
    loader.load( './models/brownCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let broCat = gltf.scene.children[0];
        broCat.scale.set(1.6, 1.6, 1.6);
        broCat.position.set(-15, -0.5, 5);
        broCat.rotateZ(4.7);
        broCat.name = "broCat";
        sceneGraph.add( broCat );
    }, undefined, function ( error ) {        
        console.error( error );
    } );

    // White Cat
    loader.load( './models/whiteCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let whiteCat = gltf.scene.children[0];
        whiteCat.scale.set(1, 1, 1);
        whiteCat.position.set(5, 0.5, 5);
        whiteCat.rotateZ(0);
        whiteCat.name = "whiteCat";
        sceneGraph.add( whiteCat );
    }, undefined, function ( error ) {        
        console.error( error );
    } );
}

var delta = 0.1;
var dispX = 0.2, dispZ = 0.2, dispY = 0.2;
let clock = new THREE.Clock();
let powerUp = sceneElements.sceneGraph.getObjectByName("powa1");

let oraCatFound = false;
let grayCatFound = false;
let broCatFound = false;
let whiteCatFound = false;
let allCatsFound = false;

function computeFrame(time) {

    let cat = sceneElements.sceneGraph.getObjectByName("cat");

    let powa1 = sceneElements.sceneGraph.getObjectByName("powa1");
    let powa2 = sceneElements.sceneGraph.getObjectByName("powa2");
    if(powa1) powa1.rotation.z -= 0.05
    if(powa2) powa2.rotation.z -= 0.05

    const moveSpeed = 0.1;
    let catSpeed = 0.1;
    const xAxis = new THREE.Vector3(1, 0, 0); // Move along the x-axis
    const yAxis = new THREE.Vector3(0, 1, 0); // Move along the z-axis
    
    let rotationSpeed = 0.05;

    if (keyW) {

        const newPosition = cat.position.clone().addScaledVector(yAxis, -moveSpeed);
        
        const powerUpPosition1 = new THREE.Vector3(-15, 1, -5);
        const powerUpPosition2 = new THREE.Vector3(25, 1, 25);

        const oraCatPosition = new THREE.Vector3(15, 0.5, -15);
        const grayCatPosition = new THREE.Vector3(-25, 0, 25);
        const broCatPosition = new THREE.Vector3(-15, -0.5, 5);
        const whiteCatPosition = new THREE.Vector3(5, 0.5, 5);

        const exitPosition = new THREE.Vector3(-25, 0, 15);

        const distanceThreshold = 3; 
        console.log("Cat currently at:", newPosition);

        const direction = yAxis.clone().negate();
        const raycaster = new THREE.Raycaster(cat.position, direction);
        const intersects = raycaster.intersectObjects(walls, true);

        if (intersects.length > 0) {
        cat.position.copy(cat.position);
        }
        else if (newPosition.z < -27) {
            cat.position.setZ(-27);
        }
        else if (newPosition.z > 27) {
            cat.position.setZ(27);
        }
        else if (newPosition.x < -27) {
            cat.position.setX(-27);
        }
        else if (newPosition.x > 27) {
            cat.position.setX(27);
        }
        else if (newPosition.distanceTo(powerUpPosition1) <= distanceThreshold) {
        const powerUp1 = sceneElements.sceneGraph.getObjectByName("powa1");
            if (powerUp1) {
            sceneElements.sceneGraph.remove(powerUp1);
            cat.scale.set(0.08, 0.08, 0.08);    // smol cat
            }
        }
        else if (newPosition.distanceTo(powerUpPosition2) <= distanceThreshold) {
        const powerUp2 = sceneElements.sceneGraph.getObjectByName("powa2");
            if (powerUp2) {
                sceneElements.sceneGraph.remove(powerUp2);
                cat.scale.set(0.15, 0.15, 0.15)   //big cat
            }
        } else if (newPosition.distanceTo(oraCatPosition) <= distanceThreshold) {
            const oraCat = sceneElements.sceneGraph.getObjectByName("oraCat");
            if (oraCat) {
                sceneElements.sceneGraph.remove(oraCat);
                oraCatFound = true;
                // one pawprint disappears
                let pawprinto = document.getElementById("pawprinto");
                pawprinto.style.display = "none";
            }
        } else if (newPosition.distanceTo(grayCatPosition) <= distanceThreshold) {
            const grayCat = sceneElements.sceneGraph.getObjectByName("grayCat");
            if (grayCat) {
                sceneElements.sceneGraph.remove(grayCat);
                grayCatFound = true;
                let pawprintg = document.getElementById("pawprintg");
                pawprintg.style.display = "none";
            }
        } else if (newPosition.distanceTo(broCatPosition) <= distanceThreshold) {
            const broCat = sceneElements.sceneGraph.getObjectByName("broCat");
            if (broCat) {
                sceneElements.sceneGraph.remove(broCat);
                broCatFound = true;
                let pawprintb = document.getElementById("pawprintb");
                pawprintb.style.display = "none";
            }       
        } else if (newPosition.distanceTo(whiteCatPosition) <= distanceThreshold) {
            const whiteCat = sceneElements.sceneGraph.getObjectByName("whiteCat");
            if (whiteCat) {
                sceneElements.sceneGraph.remove(whiteCat);
                whiteCatFound = true;
                let pawprintw = document.getElementById("pawprintw");
                pawprintw.style.display = "none";
            }
        
        } else {
            cat.translateOnAxis(yAxis, -moveSpeed);
        }

        if (oraCatFound && grayCatFound && broCatFound && whiteCatFound) {
            allCatsFound = true;
            console.log("All cats have been found! Search for the exit!");
            const messageContainer = document.getElementById("message-container");
            messageContainer.style.display = "block";
        }

        if ( (allCatsFound) && (cat.position.distanceTo(exitPosition) <= distanceThreshold) ) {
            console.log("CONGRATULATIONS!");
            const congratulationsContainer = document.getElementById("congratulations-container");
            const messageContainer = document.getElementById("message-container");
            congratulationsContainer.style.display = "block";
            messageContainer.style.display = "none";
        }

        const intersectingWallIndex = walls.findIndex((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);
            const catBoundingBox = new THREE.Box3().setFromObject(cat);
            catBoundingBox.translate(newPosition.sub(cat.position));
            return wallBoundingBox.intersectsBox(catBoundingBox);
        });
       
        if (intersectingWallIndex >= 0) {
        } else {
            cat.translateOnAxis(yAxis, -moveSpeed);
        }
 
        if (cat) {
            action.stop();
            action2.play();
        }
    
    } else { 
        if (cat) {
            action2.stop();
            action.play();
        }
    }

    if (keyA) {
        cat.rotation.z += rotationSpeed;
    }
    
    if (keyD) {
        cat.rotation.z -= rotationSpeed;
    }

    if (cat) mixer.update(clock.getDelta());

    // Rendering
    render(sceneElements);
    // Call for the next frame
    requestAnimationFrame(computeFrame);
}