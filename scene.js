let sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null, 
    renderer: null,
};

let helper = {

    initEmptyScene: function (sceneElements) {

        // Create the 3D scene
        sceneElements.sceneGraph = new THREE.Scene();

        // Add camera
        let width = window.innerWidth;
        let height = window.innerHeight;
        let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        //camera.position.set(10, 0, 0); -- camera setting to play the game
        camera.position.set(30, 50, 15); // -- camera setting to see the scene from above
        camera.lookAt(0, 0, 0);
        camera.name = "camera";
        sceneElements.sceneGraph.add(camera);

        
        //Camera control
        sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true;

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

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // Add the rendered image in the HTML DOM
        let htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};

helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// Event Listeners
window.addEventListener('resize', resizeWindow);

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

    let planeGeometry = new THREE.PlaneGeometry(60, 60);
    let planeMaterial = new THREE.MeshPhongMaterial({ color: 'gray', side: THREE.DoubleSide });
    let planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    // WALLS
    let length = 10, width = 5;

    let wall = new THREE.Shape();
    wall.moveTo( 0,0 );
    wall.lineTo( 0, width );
    wall.lineTo( length, width );
    wall.lineTo( length, 0 );
    wall.lineTo( 0, 0 );

    let longwall = new THREE.Shape();
    longwall.moveTo( 0,0 );
    longwall.lineTo( 0, width );
    longwall.lineTo( length*2, width );
    longwall.lineTo( length*2, 0 );
    longwall.lineTo( 0, 0 );

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
    let wall_material = new THREE.MeshPhongMaterial( { color: 0x55ff55, map: texture } );

    function createWall(x, y, z, rotation){
        let wall = new THREE.Mesh( wall_geometry, wall_material ) ;
        sceneGraph.add( wall );
        wall.castShadow = true;
        wall.receiveShadow = true;

        wall.translateX(x).translateY(y).translateZ(z);
        wall.rotateY(rotation);

        // wall bounding box
        let wallBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
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

    // instantiate a loader
    let loader = new THREE.TextureLoader();

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
		let material = new THREE.MeshBasicMaterial( {
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
    // create cube - SOON TO BE A CAT! 
    let cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    let cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
    let cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cubeObject);
    cubeObject.position.set(0, 0, 0);
    cubeObject.translateX(20);
    cubeObject.translateY(1);
    cubeObject.translateZ(-4);
    cubeObject.castShadow = true;
    cubeObject.receiveShadow = true;
    cubeObject.name = "cube";

    let camera = sceneElements.sceneGraph.getObjectByName("camera");
    cubeObject.add(camera);

    // cube bounding box
    let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cubeBB.setFromObject(cubeObject);
    console.log("cube bounding box", cubeBB);

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

    createCube(15, 1, -15)
    createCube(-15, 1, 5)
    createCube(5, 1, 5)
    createCube(-25, 1, 25)


    // create the tori - SOON TO BE POWERUPS!
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

}

// Displacement value
var delta = 0.1;
var dispX = 0.2, dispZ = 0.2;

function computeFrame(time) {

    let torus1Object = sceneElements.sceneGraph.getObjectByName("torus1");
    let torus2Object = sceneElements.sceneGraph.getObjectByName("torus2");
    torus1Object.rotateX(0.03);
    torus2Object.rotateX(0.03);

    // CONTROLING THE CUBE WITH THE KEYBOARD
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
    }

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
    helper.render(sceneElements);

    //Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}