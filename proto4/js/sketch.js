
//global vars

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var theta = 0;

//scene
var scene = new THREE.Scene();


//cameras
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


//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x333F47, 1);
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



function render() {
	requestAnimationFrame( render );

	var limit = cameraA.position.z;



//inner light position and movement
	lightsAR += .0125; 
    lightsAT += .0125*Math.PI;

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


	theta += .025;
	cubesr += .025;
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
		theta += .025;
		cubesr += .025;
		cube.position.x = cubesr * Math.sin(theta);
		cube.position.z = cubesr * Math.cos(theta);

		
		
		controls.update();
		
		renderer.render( scene, cameraB );
	};

	

}
render();

function Addgeometry(){
	//for (var i = 0; i < stuff.length; i++) {
		//var mandala_geometry = new THREE.IcosahedronGeometry( mandala_radius, mandala_detail );
		var randY = Math.floor((Math.random() * 10)) - 5 ;
		var randColor = new THREE.Color(Math.random(),Math.random(),Math.random());
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


		scene.add( cubes, cubesb, cubesc, cubesd );
		
	//};
}

function onclick( event ) {

				event.preventDefault();

				var ax = cube.position.x;
				var ay = cube.position.y;
				var az = cube.position.z;

				Pointer.push( new THREE.Vector3( ax, ay, az) );
				Addgeometry();

};



