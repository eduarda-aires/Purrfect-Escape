"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
//  And from an example by Pedro Iglésias
//
// 		J. Madeira - April 2021


// To store the scene graph, and elements useful to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,  // NEW
    renderer: null,
};


// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

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
    }
}

//////////////////////////////////////////////////////////////////


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(60, 60);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    // WALLS
    const length = 10, width = 5;

    const wall = new THREE.Shape();
    wall.moveTo( 0,0 );
    wall.lineTo( 0, width );
    wall.lineTo( length, width );
    wall.lineTo( length, 0 );
    wall.lineTo( 0, 0 );

    const longwall = new THREE.Shape();
    longwall.moveTo( 0,0 );
    longwall.lineTo( 0, width );
    longwall.lineTo( length*2, width );
    longwall.lineTo( length*2, 0 );
    longwall.lineTo( 0, 0 );

    const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 2,
        bevelSegments: 1
    };

    const wall_geometry = new THREE.ExtrudeGeometry( wall, extrudeSettings );
    const wall_material = new THREE.MeshPhongMaterial( { color: 0x55ff55, map: texture } );

    function createWall(x, y, z, rotation){
        const wall = new THREE.Mesh( wall_geometry, wall_material ) ;
        sceneGraph.add( wall );
        // shadow properties
        wall.castShadow = true;
        wall.receiveShadow = true;
        // position
        wall.translateX(x).translateY(y).translateZ(z);
        wall.rotateY(rotation);

        // wall bounding box
        const wallBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        wallBox.setFromObject(wall);
        wall.userData.box = wallBox;
        console.log(wallBox);
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
    
    createWall(-20, 0, 0, Math.PI/2); // THIS IS A DEADEND
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

    // instantiate a loader
    const loader = new THREE.TextureLoader();

    // Test texture stuff : 

    var canvas = document.createElement( 'CANVAS' );
    canvas.width = 32;
    canvas.height = 32;

    var texture = new THREE.CanvasTexture( canvas );
		texture.repeat.set( 2, 2 );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

    // load a resource
    loader.load(
	
        // resource URL
	'https://imgur.com/a/n99yszb',

	// onLoad callback
	function ( texture ) {
		// in this example we create the material when the texture is loaded
		const material = new THREE.MeshBasicMaterial( {
			map: texture
		} );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
);

    // ************************** //
    // Create a cube
    // ************************** //
    // Cube center is at (0,0,0)
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
    const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cubeObject);

//     // Set position of the cube
//     // The base of the cube will be on the plane 
    cubeObject.position.set(0, 0, 0);
    cubeObject.translateX(20);
    cubeObject.translateY(1);
    cubeObject.translateZ(-4);
    cubeObject.castShadow = true;
    cubeObject.receiveShadow = true;
    cubeObject.name = "cube";

    const camera = sceneElements.sceneGraph.getObjectByName("camera");
    cubeObject.add(camera);

    // cube bounding box
    const cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cubeBB.setFromObject(cubeObject);
    console.log("cube bounding box", cubeBB);

    // function CheckCollisions_() {

    //     if (cubeBB.intersectsBox(wall)) {
    //         console.log("collision");
    //     }
    // }
}

// Displacement value

var delta = 0.1;

var dispX = 0.2, dispZ = 0.2;

function computeFrame(time) {

    // THE SPOT LIGHT

    // Can extract an object from the scene Graph from its name
    const light = sceneElements.sceneGraph.getObjectByName("light");

    // Apply a small displacement

    // if (light.position.x >= 10) {
    //     delta *= -1;
    // } else if (light.position.x <= -10) {
    //     delta *= -1;
    // }
    // light.translateX(delta);

    // CONTROLING THE CUBE WITH THE KEYBOARD

    const cube = sceneElements.sceneGraph.getObjectByName("cube");

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
    }

    // Check collision with the walls
    // CheckCollisions_();

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}