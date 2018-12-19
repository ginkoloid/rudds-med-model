//ps3dView.js
if(!Detector.webgl) Detector.addGetWebGLMessage();

// フィールド
var effect;
var maneger;
var str = location.href;
var container, renderer;
var scene;
var mesh;
var camera;
var light, ambient;
var draw_flag = -1;
var intersects;
var outpos;
var color = "#c2dc94";
var colorPath;
var controls;
var spherewid = 0.01;
var meshSphere;
var peintflag = -1;
var geom = new THREE.Geometry();

// GUIパラメータ
var gui;
var geoObj;
var value_point = 5;
var json_init;

// 動画機能用のフィールド
var canvasStream = null;
var recorder = null;
var chunks = [];
var blobUrl = null;

/**
 * [init is initialize method]
 * @return {void} [void]
 */
function init(){
  /**
   * [container is value of canvas]
   * @type {object}
   */
  container = document.getElementById('box-container');

  /**
   * [renderer is intializing render]
   * @type {THREE}
   */
  renderer = new THREE.WebGLRenderer({ alpha:true,antialias:true,preserveDrawingBuffer:true });


  renderer.setSize(600, 500);
  renderer.setClearColor(0x000000,0);
  //renderer.domElement.style({'position':'relative','z-index':'2'});

  renderer.domElement.style.position = 'relative';
  renderer.domElement.style.zIndex = '1';
  container.appendChild(renderer.domElement);

  /**
   * [scene is scene object]
   * @type {THREE}
   */
  scene = new THREE.Scene();

  /**
   * [camera is camera object]
   * @type {THREE}
   */
    camera = new THREE.PerspectiveCamera(15, 600 / 500);
    camera.position.set(0, 0, 8);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls = new THREE.OrbitControls(camera);
    scene.add(camera);

  /**
   * [light is light object]
   * @type {THREE}
   */
  light = new THREE.DirectionalLight(0xcccccc);
  light.position = new THREE.Vector3(0.577, 0.577, 0.577);
  ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient);

  /**
   * [model_path represents the path to JSON of 3Dmodel]
   * @type {String}
   */
  var model_path = 'models/' + 'share.js';
  loader = new THREE.JSONLoader();

  /**
   * [Reading objects to be displayed (JSON)]
   * @param  {THREE} geometry [geometry]
   * @param  {THREE} mt       [material]
   * @return {void}          [void]
   */
  loader.load(model_path, function ( geometry, mt ) {
    if(Array.isArray(mt))
    {
      mesh = new THREE.Mesh( geometry , mt );
    }
    mesh.scale.x = 0.5;
    mesh.scale.y = 0.5;
    mesh.scale.z = 0.5;
    scene.add( mesh );
  }, '' );

  // (5)表示する物体の作成 (nasu cube)
  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshPhongMaterial({
  //    color: 0xffffff, specular: 0xcccccc, shininess:50, ambient: 0xffffff,
  //    map: THREE.ImageUtils.loadTexture('images/nasu.png') });
  // var mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);


  /**
   * [controls is controller of camera]
   * @type {THREE}
   */
  controls = new THREE.OrbitControls(camera);
  controls.center = new THREE.Vector3(0, 0, 0);
  window.addEventListener("deviceorientation", setOrientationControls, true);


  /**
   * [gui is dat.GUI object]
   * @type {dat}
   */
  gui = new dat.GUI();
  var header = document.getElementById('header');
  header.appendChild(gui.domElement);
  geoObj = new geoCtrl();
  gui.remember(geoObj);
  var scenario = gui.addFolder('Scenario');
  scenario.add( geoObj, 'Camera_x', 0, 50 ).onChange(setCameraScenario);
  scenario.add( geoObj, 'Camera_y', 0, 50 ).onChange(setCameraScenario);
  scenario.add( geoObj, 'Camera_z', 0, 50 ).onChange(setCameraScenario);
  scenario.add( geoObj, 'Scenario').onFinishChange(setScenario);
  // scenario.add( geoObj, 'lookAt').onChange(changeLook);
  // scenario.add( geoObj, 'Rotate_x', -50, 50 ).onChange(setCameraRotate);
  // scenario.add( geoObj, 'Rotate_y', -50, 50 ).onChange(setCameraRotate);
  // scenario.add( geoObj, 'Rotate_z', -50, 50 ).onChange(setCameraRotate);
	var folder = gui.addFolder('Annotation-property');
  folder.add( geoObj, 'radius', 1, 15 ).onChange(setVal);
  folder.addColor(geoObj ,'color').onChange(setColor);

  folder.open();
  scenario.open();
}

// JSON取得用の関数
// function getJSON(){
//   var scinario_path = 'data/' + 'scinario.json';
//   var req = new XMLHttpRequest();
//   var data;
//   req.open("get", scinario_path, true);
//    req.onload = function() {
//      setJSON(this.responseText);
//    };
//    req.send(null);
// }

// function setJSON(sample){
//   console.log(sample);
//   return sample;
// }

/**
 * [Preparation of GUI parameters]
 * @return {void} [void]
 */
var geoCtrl = function(){
    this.Camera_x = 0;
    this.Camera_y = 0;
    this.Camera_z = 8;
    this.Scenario = '';
    // this.lookAt = false;
    // this.Rotate_x = 0;
    // this.Rotate_y = 0;
    // this.Rotate_z = 8;
    // this.explode = function(){
    //   var form = document.createElement("form");
    //   form.setAttribute("method", "post");
    //   form.style.display = "none";
    //   document.body.appendChild(form);
    //
    // };
		this.radius = 5;
    this.color = "#c2dc94";
};

function setVal(){
  value_point = geoObj.radius;
}

function setColor(){
  color = geoObj.color;
}

function setScenario(){
  publishScenario(geoObj.Scenario);
}

// function changeLook(){
//   if(geoObj.lookAt){
//     console.log(camera);
//     // camera.lookAt(new THREE.Vector3(1, 3, 4));
//   }
// }
//
// function setCameraRotate(){
//   var x = geoObj.Rotate_x;
//   var y = geoObj.Rotate_y;
//   var z = geoObj.Rotate_z;
//   this.object.position.add( distance );
//   this.center.add( distance );
//   camera.lookAt(new THREE.Vector3(x, y, z));
//   camera.rotation.y = y;
//   camera.rotation.z = z;
//   publish();
// }

function setCameraScenario(){
  var x = geoObj.Camera_x;
  var y = geoObj.Camera_y;
  var z = geoObj.Camera_z;
  setCameraPosition(x,y,z);
  publish();
}

// VR用の初期化
function initVR(){
  // (1)レンダラの初期化
  container = document.getElementById('box-container');
  renderer = new THREE.WebGLRenderer({ alpha:true,antialias:true,preserveDrawingBuffer:true });
  renderer.setClearColor(0x000000,0);

  // コメントを１番前にする処理
  renderer.domElement.style.position = 'relative';
  renderer.domElement.style.zIndex = '1';
  container.appendChild(renderer.domElement);

  effect = new THREE.StereoEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);

  // (2)シーンの作成
  scene = new THREE.Scene();

  // (3)カメラの作成
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera = new THREE.PerspectiveCamera(75, 0.5*window.innerWidth / window.innerHeight);
  camera.position.set(-3, 0, 0);
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera);

  // (4)ライトの作成
  light = new THREE.DirectionalLight(0xcccccc);
  light.position = new THREE.Vector3(0.577, 0.577, 0.577);
  ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient);

  // (5)表示する物体の読み込み (JSON)
  var model_path = 'models/' + 'share.js';
  loader = new THREE.JSONLoader();
  loader.load(model_path, function ( geometry, mt ) {
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( mt ));
    mesh.scale.x = 0.5;
    mesh.scale.y = 0.5;
    mesh.scale.z = 0.5;
    scene.add( mesh );
  }, '' );

  // (6)カメラコントロールを作成
  controls = new THREE.OrbitControls(camera);
  controls.center = new THREE.Vector3(0, 0, 0);
  window.addEventListener("deviceorientation", setOrientationControls, true);

  fullScreen();
}


// OrbitControlsを使っていない部分をVRで対応させるためのコントローラ
function setOrientationControls(e) {
  if (!e.alpha) {
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  // controls.update();
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}
window.addEventListener('deviceorientation', setOrientationControls, true);


// (7) 値を変更させる処理
var baseTime = +new Date();
function animate(){
  requestAnimationFrame(animate);

  //カメラの状態を更新
  // this.renderer.autoClear = true;
  controls.update();
  //debugCameraPosition();
  render();
  intersects = null;
}


// (8)レンダリング
function render() {

  // webVRのときには画面分割
  if(str.match(/webVR/)){
    effect.render(scene, camera);
    this.renderer.autoClear = false;
  }else{
    renderer.render(scene, camera);
  }
}

//
//ジャイロセンサーでの操作へ変更します。
//
function setOrientationControls(e) {
  if (!e.alpha) {
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();

  element.addEventListener("click", fullscreen, false);

  window.removeEventListener("deviceorientation", setOrientationControls, true);
}

// フルスクリーンへの対応
function fullScreen(){
  if(str.match(/webVR/)){
    var canvas = container.lastElementChild;
    canvas.webkitRequestFullscreen();
  }
}

// リサイズへの対応
// window.addEventListener('resize', function() {
//   renderer.setSize(window.innerWidth-50, window.innerHeight-50);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   if(str.match(/webVR/)){
//     effect.setSize(window.innerWidth,window.innerHeight);
//   }
// }, false );

// ペイント機能(1) スフィア
function getSpherePos(event){
  var rect = event.target.getBoundingClientRect();
  var mouse = new THREE.Vector2();
  var c = color;
  var pointwid = value_point;
  var mouse_x = event.clientX - rect.left;
  var mouse_y = event.clientY - rect.top;

console.log(value_point);
  mouse_x = ( mouse_x / container.lastElementChild.width ) * 2 - 1;
  mouse_y = - ( mouse_y / container.lastElementChild.height ) * 2 + 1;

  var pos = new THREE.Vector3(mouse_x, mouse_y, 1);
  outpos = new THREE.Vector3(mouse_x, mouse_y, 1);

  pos.unproject(camera);

  var raycaster = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());

  intersects = raycaster.intersectObjects( scene.children , true);

  pointwid = pointwid / 100.0;

  if ( intersects.length > 0) {
    console.log("publishPoints");
    console.log(pos);
    console.log(intersects[0].point);
    publishPoints(c, pointwid);
  }else{

    console.log("out of 3D models");
  }

}

// アノテーションの全削除機能の実装
function getClearPos(event){
  publishClearPeints();
}

// ペイント機能(2) キューブ
function getCubePos(event){
    var rect = event.target.getBoundingClientRect();
    var mouse = new THREE.Vector2();
    var c = color;
    var pointwid = value_point;
    var mouse_x = event.clientX - rect.left;
    var mouse_y = event.clientY - rect.top;

    mouse_x = ( mouse_x / container.lastElementChild.width ) * 2 - 1;
    mouse_y = - ( mouse_y / container.lastElementChild.height ) * 2 + 1;

    var pos = new THREE.Vector3(mouse_x, mouse_y, 1);
    pos.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());

    intersects = raycaster.intersectObjects( scene.children , true);

    pointwid = pointwid / 100.0;

    if ( intersects.length > 0) {
      publishCubePoints(c, pointwid);
    }
}

function getLinePos(event){
//   var c = document.getElementById("color-bar").value;
//   var pointwid = document.getElementById("width").value;
//   var temp = mousePoints(event);
//   console.log(temp.mouse_x);
//   console.log(temp.mouse_y);
//   pointwid = pointwid / 100.0;
//
//
// }
//
// function mousePoints(event){
//   var rect = event.target.getBoundingClientRect();
//   var mouse = new THREE.Vector2();
//   var mouse_x = event.clientX - rect.left;
//   var mouse_y = event.clientY - rect.top;
//   var mPoints = {
//     mouse_x : ( mouse_x / container.lastElementChild.width ) * 2 - 1,
//     mouse_y : - ( mouse_y / container.lastElementChild.width ) * 2 + 1
//   };
//
//   return mPoints;
}

//　スクリーンショット
function screenShot() {
  html2canvas(document.body, {
    onrendered: function(canvas) {
      aElem = document.createElement('a');
      aElem.href = canvas.toDataURL("image/png");
      aElem.download = "webgl_screenshot.png";
      aElem.click();
    }
  });
  return false;
}

// 動画キャプチャ
function startVideo(){
  console.log("start");
  // var recorder = new MediaRecorder()
  var canvas = container.lastElementChild;
  if (canvas) {
      canvasStream = canvas.captureStream(10); // 10 fps
  }
  recordVideo();
}

function recordVideo(){
  if (! canvasStream) {
    console.warn('stream not ready');
    return;
  }
  if (recorder) {
    console.warn('already recording');
    return;
  }
  recorder = new MediaRecorder(canvasStream);
  chunks = [];

  recorder.ondataavailable = function(evt) {
    console.log("data available: evt.data.type=" + evt.data.type + " size=" + evt.data.size);
    chunks.push(evt.data);
  };

  recorder.start(1000);
  console.log('start recording');
}


function stopVideo(){
  var canvas = container.lastElementChild;
  console.log("stop");
  stopRecord();

  if (! blobUrl) {
    window.URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  }

  var videoBlob = new Blob(chunks, { type: "video/webm;" });
  blobUrl = window.URL.createObjectURL(videoBlob);
  anchor = document.createElement('a');
  anchor.download = 'recorded.webm';
  anchor.href = blobUrl;
  anchor.click();

  canvasStream = null;
}

function stopRecord(){
  if (recorder) {
    recorder.stop();
    console.log("stop recording");
  }
}

/**
 * [run is start this system]
 * @return {void} [void]
 */
function run(){
  if(str.match(/webVR/)){
    initVR();
  }else{
    init();
  }
  animate();
}

run();
