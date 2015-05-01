
var camera, scene, renderer;

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

function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);   
}

render();