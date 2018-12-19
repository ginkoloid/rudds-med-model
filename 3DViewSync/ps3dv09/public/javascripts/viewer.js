  //viewer.js
  var uniqueId = uniqueID();

  //var s = io.connect(); //リモートサーバー用
  var s = io.connect('http://localhost:3000'); //ローカルサーバー用

  //サーバから受け取るイベント
  s.on("connect", function () {});  // 接続時
  s.on("disconnect", function (client) {});  // 切断時
  s.on("Sub", function (data) { update(data); });//Sub時

  //クライアントから"カメラ座標"送信
  function publish()
  {
		//座標位置を送信する
		//console.log("publish():"+uniqueId);
		var data = JSON.stringify({
			id: uniqueId,
			x : camera.position.x,
			y : camera.position.y,
			z : camera.position.z
		});
		s.emit("Pub", data); //サーバへ送信
		debugCameraPosition(); //カメラ座標確認用
  }

  //"カメラ座標"の更新用関数
  function update (value,color,size)
  {
    	//座標位置を更新する
		var data = JSON.parse(value);
		var id = data.id;
		var x = data.x;
		var y = data.y;
		var z = data.z;
		if(id != uniqueId){
    		//console.log("updata():"+uniqueId);
			camera.position.set(x,y,z);
		}
  }

  if(!Detector.webgl) Detector.addGetWebGLMessage();

  // (1)レンダラの初期化
  var container = document.getElementById('container');
  var renderer = new THREE.WebGLRenderer({ alpha:true,antialias:true,preserveDrawingBuffer:true });
  renderer.setSize(window.innerWidth-50, window.innerHeight-50);
  renderer.setClearColor(0x000000,0);
  container.appendChild(renderer.domElement);

  // (2)シーンの作成
  var scene = new THREE.Scene();

  // (3)カメラの作成
  var camera = new THREE.PerspectiveCamera(
      15, window.innerWidth / window.innerHeight);
  camera.position = new THREE.Vector3(0, 0, 8);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  // (4)ライトの作成
  var light = new THREE.DirectionalLight(0xcccccc);
  light.position = new THREE.Vector3(0.577, 0.577, 0.577);
  var ambient = new THREE.AmbientLight(0x333333);
  scene.add(light);
  scene.add(ambient);

  // VRの場合
  if(str.match(/webVR/)){
    effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth-50, window.innerHeight-50);
    // effect = new THREE.StereoEffect(renderer);
  }

/*
  // (5)表示する物体の読み込み (JSON)
  var model_path = 'models/' + 'suzanne.js';
  loader = new THREE.JSONLoader();
  loader.load(model_path, function ( geometry, mt ) {
    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( mt ));
    mesh.scale.x = 0.5;
    mesh.scale.y = 0.5;
    mesh.scale.z = 0.5;
    scene.add( mesh );
  }, '' );
*/


  // (5)表示する物体の作成
  // var geometry = new THREE.CubeGeometry(1, 1, 1);
  // var material = new THREE.MeshPhongMaterial({
  //   color: 0xffffff, specular: 0xcccccc, shininess:50, ambient: 0xffffff,
  //   map: THREE.ImageUtils.loadTexture('images/nasu.png') });
  // var mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);


  // (6)カメラコントロールを作成
  var controls = new THREE.OrbitControls(camera);
  controls.center = new THREE.Vector3(0, 0, 0);

  // (7)レンダリング
  var baseTime = +new Date;
  function render() {
    requestAnimationFrame(render);

    //カメラの状態を更新
    controls.update();

    //mesh.rotation.y = 0.3 * (+new Date - baseTime) / 1000;
    //debugCameraPosition();

    renderer.render(scene, camera);
  };
  render();

  // リサイズへの対応
  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth-50, window.innerHeight-50);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, false );

  // ドラッグへの対応
  var drag = false;
  document.addEventListener("mousedown", function( event ) {
    drag = true;
  }, false);

  document.addEventListener("mouseup", function( event ) {
    drag = false;
  }, false);

  document.addEventListener("mousemove", function( event ) {
    if(drag){ publish(); }
  }, false);

  // 3D空間へのマウスオーバー・アウト
  document.getElementById('container').addEventListener("mouseover", function( event ) {
  	controls.enabled = true;
  }, false);

  document.getElementById('container').addEventListener("mouseout", function( event ) {
  	controls.enabled = false;
  }, false);


  //カメラの視点位置を表示する
  function debugCameraPosition()
  {
     console.log(
     camera.position.x+
     ' '+camera.position.y+
     ' '+camera.position.z);
  }

  function uniqueID(){
	  var randam = Math.floor(Math.random()*1000);
	  var date = new Date();
	  var time = date.getTime();
	  return randam + time.toString();
  }
