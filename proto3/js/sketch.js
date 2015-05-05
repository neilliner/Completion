var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var theta = 0;
var cubesr = 0;
var camerasr = 0;
var lightr = 0;

var stuff = [];

var madestuff = [];



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var camerab = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var light = new THREE.PointLight(0xffffff);
light.position.set(0,0,5);
scene.add(light);


var steps =  100 ;
var stheta = 0;
var sradius = 0;
var spositionx, spositiony, spositionz;


var points = [];

var spiral = new THREE.SplineCurve( points );

for (var i = 0; i < steps; i++) {

	spositionx = (.5 * i) * Math.sin(.25 * i);
	spositiony = (.5 * i) * Math.cos(.25 * i);

	points.push( new THREE.Vector2( spositionx, spositiony) ); 
};

var lookhere = new THREE.Vector3( 0, 0,0) ;

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );

//spiral lines
var lmaterial = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } );

var path = new THREE.Path( spiral.getPoints( 100 ) );

var sgeometry = path.createPointsGeometry( 100 );


// Create the final Object3d to add to the scene
var splineObject = new THREE.Line( sgeometry, lmaterial );
scene.add( splineObject );


var cube = new THREE.Mesh( geometry, material );
scene.add( cube );




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
	//camera.lookat(cube.position);


	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

renderer.domElement.addEventListener( 'click', onclick, false );

var mandala_radius = 1;
var mandala_detail = 0;

function render() {
	requestAnimationFrame( render );

	var limit = camera.position.z;

	if (limit <= 50 ) {

	theta += .025;
	cubesr += .025;
	camerasr = cubesr + 5;
	lightr += .0105;


	cube.position.x = cubesr * Math.sin(theta);
	cube.position.z = cubesr * Math.cos(theta);
	camera.position.x = camerasr * Math.sin(theta );
	camera.position.z = camerasr * Math.cos(theta );
	light.position.x = camerasr * Math.sin(theta);
	light.position.z = camerasr * Math.cos(theta);
	camera.lookAt(cube.position);
	renderer.render( scene, camera );	
		
	}

	else{

		camerab.position.x = 0;
		camerab.position.z = 0;
		camerab.position.y = 150;
		
		camerab.lookAt(lookhere);
		renderer.render( scene, camerab );
	};

	
	//mandala_radius += 0.5;
	//mandala_detail += 0.5;

	
	// Update the controls each time through the loop
	//controls.update();
}
render();

function makestuff(){
	for (var i = 0; i < stuff.length; i++) {
		//var mandala_geometry = new THREE.IcosahedronGeometry( mandala_radius, mandala_detail );
		var randY = Math.floor((Math.random() * 10)) - 5 ;
		var mandala_geometry = new THREE.DodecahedronGeometry( Math.floor((Math.random() * 2)), Math.floor((Math.random() * 3)) );
	    var cubes = new THREE.Mesh( mandala_geometry, material );
			cubes.position.x = cube.position.x; 
			cubes.position.y = cube.position.y + randY; 
			cubes.position.z = cube.position.z;
		
		var cubesb = new THREE.Mesh( mandala_geometry, material );
			cubesb.position.x = -cube.position.x; 
			cubesb.position.y = cube.position.y + randY; 
			cubesb.position.z = -cube.position.z;

		var cubesc = new THREE.Mesh( mandala_geometry, material );
			cubesc.position.x = -cube.position.x; 
			cubesc.position.y = cube.position.y + randY; 
			cubesc.position.z = cube.position.z;

		var cubesd = new THREE.Mesh( mandala_geometry, material );
			cubesd.position.x =  cube.position.x;  
			cubesd.position.y = cube.position.y + randY; 
			cubesd.position.z = -cube.position.z;	


		scene.add( cubes, cubesb, cubesc, cubesd );
		
	};
}

function onclick( event ) {

				event.preventDefault();

				var ax = cube.position.x;
				var ay = cube.position.y;
				var az = cube.position.z;

				stuff.push( new THREE.Vector3( ax, ay, az) );

				makestuff();

};



