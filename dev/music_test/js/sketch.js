
var camera, scene, renderer;


window.onload = init;
var context;
var bufferLoader;
var analyzer;
var source;
function init() {
 
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'music/Moments.mp3',
      //'../sounds/hyper-reality/laughter.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
  analyzer = context.createAnalyser();
  // source = context.createMediaStreamSource();
  // source.connect(analyser);
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  //var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  //source2.buffer = bufferList[1];

  source1.connect(context.destination);
  //source2.connect(context.destination);
  source1.start(0);
  //source2.start(0);
}



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
    // analyser.fftSize = 256;
    // var bufferLength = analyser.frequencyBinCount;
    // console.log(bufferLength); 
}

render();


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