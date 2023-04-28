// model importer
import * as THREE from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null, 
    renderer: null,
};

function initEmptyScene (sceneElements) {

    // Create the 3D scene
    sceneElements.sceneGraph = new THREE.Scene();

    //helper axis helper 
    let axesHelper = new THREE.AxesHelper( 50 );
    sceneElements.sceneGraph.add( axesHelper );

    // Add camera
    let width = window.innerWidth;
    let height = window.innerHeight;
    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    sceneElements.camera = camera;
    camera.position.set(0, 50, 50); //-- camera setting to play the game
    //camera.position.set(30, 50, 15); // -- camera setting to see the scene from above
    //camera.lookAt(0, 0, 0);
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

    // Setup shadow properties for the spotlight
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    spotLight.name = "light";

    // Create renderer (with shadow map)
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


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // create background
    let bgloader = new THREE.TextureLoader();
    let bgTexture = bgloader.load('./textures/bluegrad.png');
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
        cat.scale.set(0.2, 0.2, 0.2);
        cat.translateX(20);
        cat.translateY(5);
        cat.translateZ(0);
        cat.rotateZ(Math.PI / -2);
        cat.name = "cat";
        
        sceneGraph.add( cat );
        
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
    
    const groundtexture = new THREE.TextureLoader().load('./textures/ground.png' );
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

    const grasstexture = new THREE.TextureLoader().load('./textures/grass.png' );
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

        //wall.material.castShadow = true;
        //wall.material.receiveShadow = true;
    }

    // MAZE WALLS 
    createWall(20, 0, -10, 0);
    createWall(20, 0, 0, 0);
    createWall(20, 0, 10, Math.PI/2);
    createWall(10, 0, -10, Math.PI/2);
    createWall(10, 0, 10, Math.PI/2);
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
    createWall(0, 0, 30, 0);
    createWall(10, 0, 30, 0);
    createWall(20, 0, 30, 0);
    createWall(-30, 0, 30, 0);
    createWall(-20, 0, 30, 0);

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

    //let camera = sceneElements.sceneGraph.getObjectByName("camera");
    //cubeObject.add(camera);

    // cube bounding box
    /*let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cubeBB.setFromObject(cubeObject);
    console.log("cube bounding box", cubeBB); */

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

    // create the remaining cubes - SOON TO BE CATS!
    function createCube (x, y, z) {
        let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        let cubeMaterial = new THREE.MeshPhongMaterial({ color: 'blue' });
        let cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
        sceneGraph.add(cubeObject);
        cubeObject.position.set(x, y, z);
        cubeObject.castShadow = true;
        cubeObject.receiveShadow = true;
        cubeObject.name = "cube";
    }
    createCube(-15, 1, 5)
    createCube(5, 1, 5)

    // create the powerups 


    
    /* // create the tori - SOON TO BE POWERUPS!
    function createTorus(x, y, z, name) {
        let torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        let torusMaterial = new THREE.MeshPhongMaterial({ color: 'yellow' });
        let torusObject = new THREE.Mesh(torusGeometry, torusMaterial);
        sceneGraph.add(torusObject);
        torusObject.position.set(x, y, z);
        torusObject.castShadow = true;
        torusObject.receiveShadow = true;
        torusObject.name = name;
        return torusObject;
    }

    var torus1 = createTorus(-15, 3, -5, "torus1");
    var torus2 = createTorus(25, 3, 25, "torus2");
 */
}

// Displacement value
var delta = 0.1;
var dispX = 0.2, dispZ = 0.2, dispY = 0.2;

function computeFrame(time) {

    /* let torus1Object = sceneElements.sceneGraph.getObjectByName("torus1");
    let torus2Object = sceneElements.sceneGraph.getObjectByName("torus2");
    torus1Object.rotateX(0.03);
    torus2Object.rotateX(0.03); */

    // rotate power ups after they load
    let powa1 = sceneElements.sceneGraph.getObjectByName("powa1");
    let powa2 = sceneElements.sceneGraph.getObjectByName("powa2");
    if(powa1) powa1.rotation.z -= 0.05
    if(powa2) powa2.rotation.z -= 0.05

    const moveSpeed = 0.15;
    const xAxis = new THREE.Vector3(1, 0, 0); // Move along the x-axis
    const yAxis = new THREE.Vector3(0, 1, 0); // Move along the z-axis

    let cat = sceneElements.sceneGraph.getObjectByName("cat");

    if (keyD) {
    cat.translateOnAxis(xAxis, -moveSpeed);
    //rotate cat to face the right direction
    //cat.rotation.z = Math.PI/2;
    }
    if (keyW) {
    cat.translateOnAxis(yAxis, -moveSpeed);
    //rotate cat to face the right direction
    //cat.rotation.z = Math.PI;
    }
    if (keyA) {
    cat.translateOnAxis(xAxis, moveSpeed);
    //rotate cat to face the right direction
    //cat.rotation.z = -Math.PI/2;
    }
    if (keyS) {
    cat.translateOnAxis(yAxis, moveSpeed);
    //rotate cat to face the right direction
    //cat.rotation.z = 0;
    }

    /* // CONTROLING THE CUBE WITH THE KEYBOARD
    let cube = sceneElements.sceneGraph.getObjectByName("cube");
    if (keyD) {
        cube.translateZ(-dispZ);
    }
    if (keyW) {
         cube.translateX(-dispX);
    }
    if (keyA) {
         cube.translateZ(dispZ);
    }
    if (keyS) {
         cube.translateX(dispX);
    } */

    // press space to change the camera point of view to first person
    if (keySpace) {
        let camera = sceneElements.sceneGraph.getObjectByName("camera");
        camera.position.set(10, 9, 0); // camera setting to play the game
        // press space again to change the camera point of view to third person
        keySpace = false;
        // press tab to change the camera point of view to third person
    } else if (keyT) {
        let camera = sceneElements.sceneGraph.getObjectByName("camera");
        camera.position.set(30, 50, 15);
    }

    // TO DO:
    // Check collision with the walls
    // CheckCollisions_();

    // Rendering
    render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}