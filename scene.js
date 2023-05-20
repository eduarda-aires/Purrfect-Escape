// model importer
import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Show the loading screen
document.getElementById("loading-screen").style.visibility = "visible";

setTimeout(function() {
    // Hide the loading screen
    document.getElementById("loading-screen").style.visibility = "hidden";

    // Start your game logic or render loop here
    startGame();
}, 1000);


let sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null, 
    renderer: null,
};
let walls = [];

function initEmptyScene (sceneElements) {

    // Create the 3D scene
    sceneElements.sceneGraph = new THREE.Scene();

    //ceneElements.sceneGraph.rotation.x = Math.PI;

    //helper axis helper 
    let axesHelper = new THREE.AxesHelper( 50 );
    sceneElements.sceneGraph.add( axesHelper );

    // Add camera
    let width = window.innerWidth;
    let height = window.innerHeight;
    //let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    sceneElements.camera = camera;
    camera.position.set(0, 40, 40);
    //camera.position.set(0, 20, 15); 
    camera.up.set(0, 0, 1);
    camera.name = "camera";
    sceneElements.sceneGraph.add(camera);

    

    // Illumination
    let ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
    sceneElements.sceneGraph.add(ambientLight);

    var hemisphericLight = new THREE.HemisphereLight('yellow', 'crimson', 0.1);
    sceneElements.sceneGraph.add(hemisphericLight);

    let spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 0.8);
    spotLight.position.set(0, 30, 0);
    sceneElements.sceneGraph.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    spotLight.name = "light";

    // Renderer
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    sceneElements.renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor('rgb(135, 206, 235)', 1.0);
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //Camera control
    
    //sceneElements.control = new THREE.OrbitControls(camera);
    const control = new OrbitControls( camera, renderer.domElement );
    control.screenSpacePanning = true;

    // Add the rendered image in the HTML DOM
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
let mixer2;
// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // create background
    let bgloader = new THREE.TextureLoader();
    let bgTexture = bgloader.load('./textures/bluegrad.PNG');
    sceneGraph.background = bgTexture;


    const loader = new GLTFLoader();

    // load the player's cat
    loader.load( './models/tuxedoCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                // Set shadow property
                child.castShadow = true;
                child.receiveShadow = true;
            }

        } );
        let cat = gltf.scene.children[0];
        cat.scale.set(0.25, 0.25, 0.25);
        cat.translateX(20);
        cat.translateY(5);
        cat.translateZ(0);
        cat.rotateZ(Math.PI / -2);
        cat.name = "cat";
        
        sceneGraph.add( cat );

        cat.add(sceneElements.camera);


        if (cat) {
        mixer = new THREE.AnimationMixer( cat );
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName( clips, 'IdleNorm' );
        const action = mixer.clipAction( clip );
        action.play();

        mixer2 = new THREE.AnimationMixer( cat );
        const clips2 = gltf.animations;
        const clip2 = THREE.AnimationClip.findByName( clips2, 'WalkCycle' );
        const action2 = mixer2.clipAction( clip2 );
        action2.play();

        }
        
        //let camera = sceneElements.sceneGraph.getObjectByName("camera");
        //cat.add(camera);
        //camera look at cat
        //camera.lookAt(cat.position); // descomentar depois
        //camera.position.set(10, 30, 0);
        /* const cameraOffset = new THREE.Vector3(30, 10, 10); // Adjust as needed
        const cameraRotation = new THREE.Euler(Math.PI / 6, Math.PI, 0); // Adjust as needed
        camera.position.copy(cameraOffset);
        camera.rotation.copy(cameraRotation); */
        

    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    // load powerups

    function createPowa(x, y, z, name) {

        const powaloader = new GLTFLoader();

        loader.load( './models/powerUp/scene.gltf', function ( gltf ) {
            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
                    // Set shadow property
                    child.castShadow = true;
                    //child.receiveShadow = true;
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
    
    const groundtexture = new THREE.TextureLoader().load('./textures/ground.PNG' );
    //REAPEAT TEXTURE
    groundtexture.wrapS = THREE.RepeatWrapping;
    groundtexture.wrapT = THREE.RepeatWrapping;
    groundtexture.repeat.set( 4, 4 );
    const groundmaterial = new THREE.MeshPhongMaterial( { map:groundtexture , side: THREE.DoubleSide} );

    let planeGeometry = new THREE.PlaneGeometry(60, 60);
    let planeMaterial = new THREE.MeshPhongMaterial({ color: 'gray', side: THREE.DoubleSide });
    let planeObject = new THREE.Mesh(planeGeometry, groundmaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    const grasstexture = new THREE.TextureLoader().load('./textures/grass.PNG' );
    //REAPEAT TEXTURE
    grasstexture.wrapS = THREE.RepeatWrapping;
    grasstexture.wrapT = THREE.RepeatWrapping;
    grasstexture.repeat.set( 0.06, 0.06 );
    const grassmaterial = new THREE.MeshPhongMaterial( { map:grasstexture , side: THREE.DoubleSide} );
    grassmaterial.polygonOffset = true;
    grassmaterial.polygonOffsetFactor = -0.1;
    grassmaterial.polygonOffsetUnits = -1;

    // WALLS
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
        //wall.receiveShadow = true;

        wall.translateX(x).translateY(y).translateZ(z);
        wall.rotateY(rotation);
        return wall;

        //walls.push(wall);

        //wall.material.castShadow = true;
        //wall.material.receiveShadow = true;
    }

    // MAZE WALLS 
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
    createWall(10, 0, 10, 0);
    createWall(10, 0, -10, 0);
    createWall(0, 0, 0, 0);
    createWall(0, 0, 10, Math.PI/2);
    createWall(0, 0, 20, Math.PI/2);
    createWall(0, 0, 20, 0);

    createWall(-30, 0, 20, 0);
    createWall(-30, 0, 10, 0);
    createWall(-20, 0, 20, 0);
    createWall(-20, 0, 10, 0);
    createWall(-10, 0, 10, Math.PI/2);
    createWall(-20, 0, 0, 0);
    createWall(-20, 0, -10, 0);
    
    createWall(-20, 0, 0, Math.PI/2);
    createWall(-10, 0, 30, 0);
    createWall(-20, 0 ,-10, Math.PI/2);
    createWall(-20, 0, 10, 0);
    createWall(-10, 0, -20, 0);
    createWall(-10, 0, -20, Math.PI/2);
    createWall(-10, 0, -10, 0);
    createWall(10, 0, -20, 0);
    createWall(20, 0, 20, 0);
    
    
    //MAZE OUTLINE on z = 30
    const wall6 = createWall(0, 0, 30, 0);
    walls.push(wall6);
    const wall7 = createWall(10, 0, 30, 0);
    walls.push(wall7);
    const wall8 = createWall(20, 0, 30, 0);
    walls.push(wall8);
    const wall9 = createWall(-30, 0, 30, 0);
    walls.push(wall9);
    const wall10 = createWall(-20, 0, 30, 0);
    walls.push(wall10);

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

    // show position of all walls
    for (let i = 0; i < walls.length; i++) {
        console.log("wall", i, walls[i].position);
    }

    // Let's create the remaining kittens!
    // Gray Cat
    loader.load( './models/orangeCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                // Set shadow property
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

    // Orange Cat
    loader.load( './models/grayCat/scene.gltf', function ( gltf ) {
        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                // Set shadow property
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
                // Set shadow property
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
                // Set shadow property
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

// Displacement value
var delta = 0.1;
var dispX = 0.2, dispZ = 0.2, dispY = 0.2;
let clock = new THREE.Clock();

function computeFrame(time) {

    let cat = sceneElements.sceneGraph.getObjectByName("cat");
    if (cat) mixer2.update(clock.getDelta());

    // rotate power ups after they load
    let powa1 = sceneElements.sceneGraph.getObjectByName("powa1");
    let powa2 = sceneElements.sceneGraph.getObjectByName("powa2");
    if(powa1) powa1.rotation.z -= 0.05
    if(powa2) powa2.rotation.z -= 0.05

    const moveSpeed = 0.15;
    const xAxis = new THREE.Vector3(1, 0, 0); // Move along the x-axis
    const yAxis = new THREE.Vector3(0, 1, 0); // Move along the z-axis

    
    /* if (keyW) {
    cat.translateOnAxis(yAxis, -moveSpeed);
    //mixer2.update(clock.getDelta());
    //rotate cat to face the right direction
    //cat.rotation.z = Math.PI;
    } */

    let rotationSpeed = 0.05;

    if (keyW) {
        // Calculate the new position of the cat after moving
        const newPosition = cat.position.clone().addScaledVector(yAxis, -moveSpeed);
        console.log("newPosition", newPosition);
    
        // Check if the new position will intersect with any of the wall objects
        const intersectingWallIndex = walls.findIndex((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);
            console.log("wallBoundingBox", wallBoundingBox);
            const catBoundingBox = new THREE.Box3().setFromObject(cat);
            catBoundingBox.translate(newPosition.sub(cat.position));
            return wallBoundingBox.intersectsBox(catBoundingBox);
        });
       
        if (intersectingWallIndex >= 0) {
        } else {
            cat.translateOnAxis(yAxis, -moveSpeed);
        }
    }

    /* if (keyW) {
        // Calculate the new position of the cat after moving
        const newPosition = cat.position.clone().addScaledVector(xAxis, -moveSpeed);
    
        // Check if the new position will intersect with any of the wall objects
        const intersectingWall = walls.find((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);
            const catBoundingBox = new THREE.Box3().setFromObject(cat);
            catBoundingBox.translate(newPosition.sub(cat.position));
            return wallBoundingBox.intersectsBox(catBoundingBox);
        });
        
        // If the new position will intersect with a wall, do not move the cat
        if (intersectingWall) {
            // Do nothing
        } else {
            // If not, move the cat as usual
            cat.translateOnAxis(yAxis, -moveSpeed);
        }
    } */

    /* if (keyW) {
        const newPosition = cat.position.clone().addScaledVector(yAxis, -moveSpeed);
        if (newPosition.z < -25) {
            cat.position.setZ(-25);
        }
        else if (newPosition.z > 25) {
            cat.position.setZ(25);
        }
        else if (newPosition.x < -25) {
            cat.position.setX(-25);
        } else {
            cat.translateOnAxis(yAxis, -moveSpeed);
        }
    } */

    if (keyA) {
        cat.rotation.z += rotationSpeed;
    }
    
    if (keyD) {
        cat.rotation.z -= rotationSpeed;
    }
    
    if (keyS) {
        cat.translateOnAxis(yAxis, moveSpeed);
        // no rotation, just backpeddle
    }
    
    /* if (keyA) {
        cat.translateOnAxis(xAxis, moveSpeed);
        cat.rotation.z = Math.PI * 2;
        
    }

    if (keyD) {
        cat.translateOnAxis(xAxis, -moveSpeed);
        cat.rotation.z = Math.PI;
    }

    if (keyS) {
        cat.translateOnAxis(yAxis, moveSpeed);
        // no rotation, just backpeddle
    }
 */
    // press space to change the camera point of view to first person
    if (keySpace) {
        let camera = sceneElements.sceneGraph.getObjectByName("camera");
        camera.position.set(0, 5, 10); // camera setting to play the game
        // press space again to change the camera point of view to third person
        keySpace = false;
        // press tab to change the camera point of view to third person
    } else if (keyT) {
        let camera = sceneElements.sceneGraph.getObjectByName("camera");
        camera.position.set(30, 50, 15);
    }

    // Rendering
    render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}