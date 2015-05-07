
var camera, scene, renderer, particles;

var width = window.innerWidth;
var height = window.innerHeight;

var wX = width / 2;
var hX = height / 2;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 75, width / height, 0.5, 1000 );
camera.position.z = 5;

var light = new THREE.PointLight();
light.position.set( 0, 10, 10 );
scene.add( light );

var geometry = new THREE.IcosahedronGeometry();
var gloss = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
var shape = new THREE.Mesh(geometry,gloss);

scene.add(shape);

renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0x000000,1);

document.body.appendChild(renderer.domElement);
controls = new THREE.OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function(){
    width = window.innerWidth;
    height = window.innerHeight;

    wX = width / 2;
    hX = height / 2;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}, false );

//-- particles
    var particlesQty = 3000;
    	particlesGeometry = new THREE.SphereGeometry();

        materialOptions = {
            size: .3,
            transparency: true, 
            opacity: 0.5
        };

        particlesStuff = new THREE.PointCloudMaterial(materialOptions);


    for (var i = 0; i < particlesQty; i++) {     

        var particlesVertex = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
        particlesVertex.x = Math.random() * 2000 - 1000;
        particlesVertex.y = Math.random() * 2000 - 1000;
        particlesVertex.z = Math.random() * 2000 - 1000;

        particlesGeometry.vertices.push(particlesVertex);
    }

    particles = new THREE.PointCloud(particlesGeometry, particlesStuff);
    scene.add(particles);

    scene.fog = new THREE.FogExp2( 0xff00000, 0.0009 ); 



function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera); 
    particles.rotation.x += .0009;
    particles.rotation.y += .0009;
}

render();