// Academy of Art University
// WNM 498 Generative Art & Creative Code
//
// Ryan Berkey
// ryan@rybotron.com
//

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var theta = 0;
var cubesr = 0;
var camerasr = 0;
var lightr = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


var light = new THREE.PointLight(0xffffff);
light.position.set(0,0,5);
scene.add(light);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 15;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x333F47, 1);

document.body.appendChild( renderer.domElement );

// add THREE Mouse Camera Orbit Controls to the scene
//controls = new THREE.OrbitControls(camera, renderer.domElement);


window.addEventListener( 'resize', function(){
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	camera.lookat(cube.position);


	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );


function render() {
	requestAnimationFrame( render );

	theta += .025;
	camerasr += .011;
	cubesr += .01;
	lightr += .0105;


	cube.position.x = camerasr * Math.sin(theta);
	cube.position.y = camerasr * Math.cos(theta);
	//camera.position.x = camerasr * Math.sin(theta);
	//camera.position.y = camerasr * Math.cos(theta);
	light.position.x = camerasr * Math.sin(theta);
	light.position.y = camerasr * Math.cos(theta);


	renderer.render( scene, camera );
	
	// Update the controls each time through the loop
	//controls.update();
}
render();


