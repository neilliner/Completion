//global vars

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var theta = 0;

var startButtonClicked = false;

//music global vars

window.onload = init;
var context;
var bufferLoader;
var analyser;
var dataArray;
var source;
var soundLoaded = false; 

var drawing = false;
var finishDrawingTime;
var isFirsTimeDrawing = true;

//************ jQuery**************
$.noConflict();
jQuery( document ).ready(function( $ ) {
	
    $(".button").click(function(){
   		if(!drawing){
   			if(!isFirsTimeDrawing){
   				source.stop();
   				console.log("STOP!!");
   				soundLoaded = false;
   				scene.children.splice(6,scene.children.length-6);

   				restartDrawing();
   			}
		    startButtonClicked = true;
		    $("#hero").addClass("disappear");
    		context = new AudioContext();
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 1;
			var bufferLength = analyser.frequencyBinCount;
			dataArray = new Uint8Array(bufferLength);

			bufferLoader = new BufferLoader(
			context,
			[
			'audio/Bloom.mp3',
			'audio/Drowning.mp3',
			'audio/Wildfire.mp3',
			],
			finishedLoading
			);

			bufferLoader.load();
			analyzer = context.createAnalyser();
			drawing = true;
		}
    });
});

//****************************** music functions ******************************

function init() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// context = new AudioContext();

	// analyser = context.createAnalyser();
	// analyser.smoothingTimeConstant = 1;
	// var bufferLength = analyser.frequencyBinCount;
	// dataArray = new Uint8Array(bufferLength);

	// bufferLoader = new BufferLoader(
	// context,
	// [
	// 'audio/Bloom.mp3',
	// 'audio/Drowning.mp3',
	// 'audio/Wildfire.mp3',
	// ],
	// finishedLoading
	// );

	// bufferLoader.load();

	// analyzer = context.createAnalyser();

	//****************************** collada ******************************

// manager = new THREE.LoadingManager();
// manager.onProgress = function ( item, loaded, total ){
// 	console.log( item, loaded, total );
// }


// var loader = new THREE.ColladaLoader();
// loader.load( 'models/drop.dae', function( collada ){
// 	//console.log(collada.dae.scene.scene.position);
// 	//console.log(collada.dae.scene.scene);
// 	console.log(collada.dae);
// 	//dae = collada.children[0].children[0];	
// 	//dae = collada.dae.scene.scene;
// 	//dae.scale.set( .005, .005, .005);		
// 	scene.add(collada.scene);
// });

	// dae.position.x = cube.position.x; 
	// dae.position.y = cube.position.y + randY; 
	// dae.position.z = cube.position.z;
}

function finishedLoading(bufferList) {
	songNumber = Math.floor((Math.random() * 3))
	source = context.createBufferSource();
	source.buffer = bufferList[songNumber];
	console.log("Track Number : " + songNumber);

	source.connect(context.destination);
	source.connect(analyser);

	source.loop = true;
	source.start();

    soundLoaded = true;	
}

//********** BufferLoader Class **********

function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
	// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function(buffer) {
			if (!buffer) {
				alert('error decoding file data: ' + url);
				return;
			}
			loader.bufferList[index] = buffer;
			if (++loader.loadCount == loader.urlList.length)
				loader.onload(loader.bufferList);
			},
			function(error) {
				console.error('decodeAudioData error', error);
			}
		);
	}

	request.onerror = function() {
		alert('BufferLoader: XHR error');
	}

	request.send();
}

BufferLoader.prototype.load = function() {
	for (var i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i);
}

//****************************** end of music functions ******************************

// Helper function map()
function map(inputValue, actualMin, actualMax, newMin, newMax) {
	return (inputValue - actualMin) / (actualMax - actualMin) * (newMax - newMin) + newMin;
}

// to clear all shapes
// window.onkeydown = function(e){
// 	if(e.keyCode === 32){ // temporarily set to spacebar
//    		e.preventDefault();
//    		console.log("spacebar pressed");
//    		scene.children.splice(6,scene.children.length-6);
//    	}
// }

//scene
var scene = new THREE.Scene();

//cameras
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 1000 );
camera.position.z = -424;

//this is the follow camera
var cameraA = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
var camerasr = 0;

//this is top view camera
var cameraB = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
cameraB.position.x = 0;
cameraB.position.z = 0;
cameraB.position.y = 75;

var center = new THREE.Vector3( 0, 0,0) ;

//gemometry
//this is the look at cube
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, opacity: .5 , transparent: true, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
var cube = new THREE.Mesh( geometry, material );
		
// this the radius for the cube this determins the distance from the center
var cubesr = 0;

scene.add( cube );

//this the holder arrays for made geomtry
var Pointer = [];
var Madegeomtry = [];

//Spiral geometrt
var steps =  200 ;
var Stheta = 0;
var spiralr = 0;
var Spositionx, Spositiony, Spositionz;
// array for spiral points
var points = [];

var spiral = new THREE.SplineCurve3( points );
  
	// for loop to genrate the spiral points
for (var i = 0; i < steps; i++) {

	Spositionx = (.25 * i) * Math.sin(.25 * i);
	Spositionz = (.25 * i) * Math.cos(.25 * i);
	Spositiony = 0;
	
	points.push( new THREE.Vector3( Spositionx, Spositiony, Spositionz) ); 
};

//spiral lines
var lmaterial = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } );
var Sgeometry = new THREE.Geometry();	
	Sgeometry.vertices = spiral.getPoints( 200 );

// Create the final Object3d to add to the scene
var splineObject = new THREE.Line( Sgeometry, lmaterial );
	scene.add( splineObject );

// Lights
//Inner Array of lights	
var lightsAR = 0;
var lightsAT = 0;
var lightA = 4;
var LightsA = [];

// forloop to make lights 	
for (var i = 0; i < lightA; i++) {
	var randColors = new THREE.Color(Math.random(),Math.random(),Math.random());
	var light = new THREE.PointLight( randColors , 1 );
	light.position.y= 10; 
	LightsA.push(light);
	scene.add( light );
};

//outer array of lights

var lightsBR = 0;
var lightsBT = 0;
var lightB = 4;
var LightsB = [];

// forloop to make lights 	
for (var i = 0; i < lightB; i++) {
	var randColors = new THREE.Color(Math.random(),Math.random(),Math.random());
	var light = new THREE.PointLight( randColors , 1 );
	light.position.y= 10; 
	LightsB.push(light);
	//scene.add( light );
};

//-- particles
var particlesQty = 3000;

particlesGeometry = new THREE.SphereGeometry(2000, 50, 50);

materialOptions = {
    size: 1.0,
    transparency: true, 
    opacity: 0.5
};

particlesStuff = new THREE.PointCloudMaterial(materialOptions);

for (var i = 0; i < particlesQty; i++) {   

	var particlesVertex = new THREE.Vector3();

    particlesVertex.x = Math.random() * 2000 - 1000;
    particlesVertex.y = Math.random() * 1000 - 500;
    particlesVertex.z = Math.random() * 1000 - 500;

    particlesGeometry.vertices.push(particlesVertex);
}

particles = new THREE.PointCloud( particlesGeometry, particlesStuff ); // geometry, material
particles.rotation.x = 90;
particles.rotation.z = 90;
scene.add(particles);

scene.fog = new THREE.FogExp2( 0x00cfff, 0.009 ); // color of the particle
//-- particle


//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1);
document.body.appendChild( renderer.domElement );


window.addEventListener( 'resize', function(){
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	cameraA.aspect = window.innerWidth / window.innerHeight;
	cameraA.updateProjectionMatrix();
	//camera.lookat(cube.position);
	cameraB.aspect = window.innerWidth / window.innerHeight;
	cameraB.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

renderer.domElement.addEventListener( 'click', onclick, false );


// add THREE Mouse Camera Orbit Controls to the scene
var controls = new THREE.OrbitControls(cameraB, renderer.domElement);
controls.maxDistance = 100;

//***************** render() ************************
function render() {
	requestAnimationFrame( render );

	if(!startButtonClicked){
		particles.rotation.x += .0009;
    	particles.rotation.y += .0009;
    	renderer.render(scene,camera);
	}
	else{

		var limit = cameraA.position.z;

		if(soundLoaded){
			analyser.getByteTimeDomainData(dataArray);
			
			if((context.currentTime - finishDrawingTime) > 10){ 
				//console.log(context.currentTime);
				drawing = false;

				jQuery("#hero").removeClass("disappear");
			}
		}
		//inner light position and movement
		lightsAR += .0075; 
		lightsAT += .00755*Math.PI;

		for (var i = 0; i < LightsA.length; i++) {
			
			if( i == 0 ){
				LightsA[i].position.x = lightsAR * Math.sin(lightsAT );
				LightsA[i].position.z = lightsAR * Math.cos(lightsAT );
			}

			else if( i == 1 ){
				LightsA[i].position.x = lightsAR * Math.sin(lightsAT + (Math.PI/2) );
				LightsA[i].position.z = lightsAR * Math.cos(lightsAT + (Math.PI/2) );
			}

			else if( i == 2 ){
				LightsA[i].position.x = lightsAR * Math.sin(lightsAT + (Math.PI) );
				LightsA[i].position.z = lightsAR * Math.cos(lightsAT + (Math.PI) );
			}


			else{
				LightsA[i].position.x = lightsAR * Math.sin(lightsAT + ((3*Math.PI) / 2) );
				LightsA[i].position.z = lightsAR * Math.cos(lightsAT + ((3*Math.PI) / 2) );
			}
		};	

		if (limit <= 50 ) {

			theta += .0125;
			cubesr += .0125;
			camerasr = cubesr + 10;

			cube.position.x = cubesr * Math.sin(theta);
			cube.position.z = cubesr * Math.cos(theta);
			cameraA.position.x = cubesr * Math.sin(theta + .2 );
			cameraA.position.z = cubesr * Math.cos(theta + .2 );

			cameraA.position.y = .5;
			cameraA.lookAt(cube.position);
			renderer.render( scene, cameraA );	
			
		}

		else{

			//isFinishDrawing = true;
			if(typeof finishDrawingTime === 'undefined'){
				finishDrawingTime = context.currentTime;
				isFirsTimeDrawing = false;
				console.log(finishDrawingTime);
			}

			theta += .025;
			cubesr += .025;
			cube.position.x = cubesr * Math.sin(theta);
			cube.position.z = cubesr * Math.cos(theta);
			
			controls.update();
		
			renderer.render( scene, cameraB );
		}

	//***********-------make sound frequencies triggering the size of shapes-------***********
		// if(scene.children.length > 7){
		// 	for(var i = 7;i < scene.children.length; i++){
		// 		if(dataArray[Math.floor(map(i,7,scene.children.length,0,1023))] > 220){
		// 			scene.children[i].scale.x = map(dataArray[Math.floor(map(i,7,scene.children.length,0,1023))],128,255,.005,.01);
		// 			scene.children[i].scale.y = map(dataArray[Math.floor(map(i,7,scene.children.length,0,1023))],128,255,.005,.01);
		// 			scene.children[i].scale.z = map(dataArray[Math.floor(map(i,7,scene.children.length,0,1023))],128,255,.005,.01);
		// 		}
		// 	}
		// }
	}
}
render();

function restartDrawing(){

	//reset all things here.

}

function onclick( event ) {

	event.preventDefault();

	var ax = cube.position.x;
	var ay = cube.position.y;
	var az = cube.position.z;

	Pointer.push( new THREE.Vector3( ax, ay, az) );
	genFourShapes(Math.floor((Math.random() * 6) + 1));
};

function genFourShapes(shape){

	console.log("Gen Shape: " + shape);
	var randY = Math.floor((Math.random() * 10)) - 5 ;
	var randColor = new THREE.Color(Math.random(),Math.random(),Math.random());
	var randSize = Math.random() / 50;
	
	switch(shape){
	
	case 1:
	
		var loader = new THREE.ColladaLoader();
		
		loader.load( 'models/drop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){
				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = theta + Math.PI/2 ;
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/drop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = theta - Math.PI/2  ;
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/drop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = -theta - (3*Math.PI)/2 ;
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/drop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = -theta - Math.PI/2;
		
		scene.add(collada.scene);
		});
		
	break;
	
	case 2:
		
		var loader = new THREE.ColladaLoader();
		
		loader.load( 'models/loop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){
				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize * 100;
		collada.scene.scale.y = randSize * 100;
		collada.scene.scale.z = randSize * 100;
		
		// do the rotation here (maybe not y)
		collada.scene.rotation.z = Math.PI/2;
		collada.scene.rotation.y = theta + Math.PI/2;
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/loop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize * 100;
		collada.scene.scale.y = randSize * 100;
		collada.scene.scale.z = randSize * 100;
		
		// do the rotation here (maybe not y)
		collada.scene.rotation.z =  Math.PI/2;
		collada.scene.rotation.y = theta - Math.PI/2;
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/loop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize * 100;
		collada.scene.scale.y = randSize * 100;
		collada.scene.scale.z = randSize * 100;
		
		// do the rotation here (maybe not y)
		collada.scene.rotation.z =  Math.PI/2;
		collada.scene.rotation.y = -theta - (3*Math.PI/2);
		
		
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/loop.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize * 100;
		collada.scene.scale.y = randSize * 100;
		collada.scene.scale.z = randSize * 100;
		
		// do the rotation here (maybe not y)
		collada.scene.rotation.z = Math.PI/2;
		collada.scene.rotation.y = -theta - Math.PI/2;
		
		scene.add(collada.scene);
		});
		
	break;
	
	case 3:
	
		var loader = new THREE.ColladaLoader();
		
		loader.load( 'models/petal.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){
				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = theta - Math.PI/2;
		collada.scene.rotation.z = Math.PI/2;
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/petal.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = theta + Math.PI/2;
		collada.scene.rotation.z = Math.PI/2;
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/petal.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = -cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = - theta + (3*Math.PI/2);
		collada.scene.rotation.z = Math.PI/2;
		scene.add(collada.scene);
		});
		
		var loader = new THREE.ColladaLoader();
		loader.load( 'models/petal.dae', function( collada ){
		
		collada.scene.traverse( function ( child ){
			if ( child instanceof THREE.Mesh ){

				child.material.color = randColor;
				child.material.shininess = 100;
			}
		});
		
		collada.scene.position.x = cube.position.x;			
		collada.scene.position.y = cube.position.y + randY; 
		collada.scene.position.z = -cube.position.z;
		
		collada.scene.scale.x = randSize;
		collada.scene.scale.y = randSize;
		collada.scene.scale.z = randSize;
		
		// do the rotation here
		collada.scene.rotation.y = -theta + Math.PI/2;
		collada.scene.rotation.z = Math.PI/2;
		scene.add(collada.scene);
		});
		
	break;
	
	case 4:
	
		var mandala_geometry = new THREE.DodecahedronGeometry( Math.floor((Math.random() * 2)), Math.floor((Math.random() * 3)) );
	    var mandala_material = new THREE.MeshPhongMaterial( { color: randColor, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
	    var cubes = new THREE.Mesh( mandala_geometry, mandala_material );
			cubes.position.x = cube.position.x; 
			cubes.position.y = cube.position.y + randY; 
			cubes.position.z = cube.position.z;
		
		var cubesb = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesb.position.x = -cube.position.x; 
			cubesb.position.y = cube.position.y + randY; 
			cubesb.position.z = -cube.position.z;

		var cubesc = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesc.position.x = -cube.position.x; 
			cubesc.position.y = cube.position.y + randY; 
			cubesc.position.z = cube.position.z;

		var cubesd = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesd.position.x =  cube.position.x;  
			cubesd.position.y = cube.position.y + randY; 
			cubesd.position.z = -cube.position.z;

		scene.add(cubes,cubesb,cubesc,cubesd);
		
	break;
	
	case 5:
	
		var mandala_geometry = new THREE.TorusGeometry(Math.floor((Math.random() * 5)) + 2,Math.random(),20,20);
	    var mandala_material = new THREE.MeshPhongMaterial( { color: randColor, specular: 0x009900, shininess: 30 } );
	    var cubes = new THREE.Mesh( mandala_geometry, mandala_material );
			cubes.position.x = cube.position.x; 
			cubes.position.y = cube.position.y + randY; 
			cubes.position.z = cube.position.z;
			cubes.rotation.x = 1.6;
		
		var cubesb = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesb.position.x = -cube.position.x; 
			cubesb.position.y = cube.position.y + randY; 
			cubesb.position.z = -cube.position.z;
			cubesb.rotation.x = 1.6;

		var cubesc = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesc.position.x = -cube.position.x; 
			cubesc.position.y = cube.position.y + randY; 
			cubesc.position.z = cube.position.z;
			cubesc.rotation.x = 1.6;

		var cubesd = new THREE.Mesh( mandala_geometry, mandala_material );
			cubesd.position.x =  cube.position.x;  
			cubesd.position.y = cube.position.y + randY; 
			cubesd.position.z = -cube.position.z;
			cubesd.rotation.x = 1.6;

		scene.add(cubes,cubesb,cubesc,cubesd);
		
	break;
	
		case 6:
	
		var mandala_geometry = new THREE.TorusGeometry(cube.position.x,cube.position.x/4);
	    var mandala_material = new THREE.MeshPhongMaterial( { color: randColor, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
	    var cubes = new THREE.Mesh( mandala_geometry, mandala_material );
			cubes.position.x = 0;
			cubes.position.y = -20; 
			cubes.position.z = 0;
			cubes.rotation.x = 1.6;

		scene.add(cubes);
		
	break;
	
	}
	
}



