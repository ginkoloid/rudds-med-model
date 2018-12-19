//ps3dModel.js
var uniqueId = uniqueID();

// ペイントの前画面削除用のフィールド
var preSpheres=[];
var preCubes=[];
var pointsData=[];

//var s = io.connect(); //リモートサーバー用
var s = io.connect('http://localhost:3000'); //ローカルサーバー用

//サーバから受け取るイベント
s.on("connect", function (aList) { getStringData(aList); });  // 接続時
s.on("disconnect", function (client) {});  // 切断時
s.on("Sub", function (data) { update(data); });//Sub時
s.on("getStringData", function (aList) { getStringData(aList); });//getStringData()時

//getSpherePoint()時
s.on("getSpherePoints", function (aList) {
  getSpherePoints(aList);
});
s.on("getSphereOutPoints", function (aList) {
  getSphereOutPoints(aList);
});
s.on("getCubePoints", function (aList) {
  getCubePoints(aList);
});
s.on("getClearPeints", function(aList){
  getClearPeints(aList);
});

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
  // debugCameraPosition(); //カメラ座標確認用
}

// クライアントから"Sphere"の座標を送信
function publishPoints(scolor, wid)
{
  var data = JSON.stringify({
    mode : "shpere",
    x : intersects[0].point.x,
    y : intersects[0].point.y,
    z : intersects[0].point.z,
    color : scolor,
    width : wid,
  });

  s.emit("publishPoints", data);
}

function publishOutPoints(scolor,wid)
{
  var data = JSON.stringify({
    mode : "shpere",
    x : outpos.x,
    y : outpos.y,
    z : outpos.z,
    color : scolor,
    width : wid,
  });
  s.emit("publishOutPoints", data);
}

// 削除の際のpublish処理
function publishClearPeints(){
  s.emit("publishClearPeints");
}

function getClearPeints(list){
  for(var i in preSpheres){
    scene.remove(preSpheres[i]);
  }
  for(var j in preCubes){
    scene.remove(preCubes[j]);
  }
  preSpheres=[];
  preCubes=[];
}

function publishCubePoints(scolor,wid){
  var data = JSON.stringify({
    mode : "cube",
    x : intersects[0].point.x,
    y : intersects[0].point.y,
    z : intersects[0].point.z,
    color : scolor,
    width : wid,
  });

  s.emit("publishCubePoints", data);
}

//"カメラ座標"の更新用関数
function update(value)
{
  // 座標位置を更新する
  // アノテーションの際にはその場所を更新
  var data = JSON.parse(value);
  if(data.hasOwnProperty("id")){
    var id = data.id;
    var x = data.x;
    var y = data.y;
    var z = data.z;
    if(id != uniqueId){
      this.setCameraPosition(x,y,z);
    }
  }
}

//　球の座標取得
function getSpherePoints(list){
  //　カラーバーからの色の取得
  for(var a=0; a<preSpheres.length; a++){
    scene.remove(preSpheres[a]);
  }
  preSpheres=[];

  for(var i=0; i<list.length; i++)
  {
    var data = JSON.parse(list[i]);
    drawSpheres(data);
    pointsData.push(data);
  }
}

function getSphereOutPoints(list){
  for(var a=0; a<preSpheres.length; a++){
    scene.remove(preSpheres[a]);
  }
  preSpheres=[];

  for(var i=0; i<list.length; i++)
  {
    var data = JSON.parse(list[i]);
    drawSpheres(data);
    pointsData.push(data);
  }
}

function drawSpheres(data){
  console.log(data);
  var newSphere;
  var sphereGeometry;
  var sphereMaterial;
  var spheresPos;
  var c;
  var wid;
  console.log("out s");
  console.log(data);
  var type = data.mode;
  if(type == "shpere"){
    c = data.color;
    wid = data.width;

    sphereGeometry = new THREE.SphereGeometry( wid, 32, 32 );

    sphereMaterial = new THREE.MeshBasicMaterial( { color: c } );

    newSphere = new THREE.Mesh( sphereGeometry,sphereMaterial );

    spheresPos = newSphere.position;

    spheresPos.x = data.x;
    spheresPos.y = data.y;
    spheresPos.z = data.z;

    newSphere.material.color.set(c);
    newSphere.position.copy(spheresPos);

    scene.add(newSphere);
    preSpheres.push(newSphere);
    newSphere = 0;
  }
}

function getCubePoints(list){
  for(var a=0; a<preCubes.length; a++){
    scene.remove(preCubes[a]);
  }
  preCubes=[];

  for(var i=0; i<list.length; i++)
  {
    var data = JSON.parse(list[i]);
    drawCubes(data);
  }
}

function drawCubes(data){
  var newCube;
  var cubeGeometry;
  var cubeMaterial;
  var cubePos;
  var c;
  var wid;

  var type = data.mode;

  if(type == "cube"){
    c = data.color;
    wid = data.width;

    cubeGeometry = new THREE.BoxGeometry( wid, wid, wid );
    cubeMaterial = new THREE.MeshBasicMaterial( { color: c } );
    newCube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cubePos = newCube.position;

    cubePos.x = data.x;
    cubePos.y = data.y;
    cubePos.z = data.z;

    newCube.material.color.set(c);
    newCube.position.copy(cubePos);

    scene.add(newCube);
    preCubes.push(newCube);
    newCube = 0;
  }
}

//コメント投票用の関数(入力用)
function publishComments(tar,com)
{
  console.log("haitteru");
  if($("#comments").val() === "")
  {
    $("#comments").val("コメント");
    return;
  }
  $("#comments").val(""); //空白にする
  var jsonData = JSON.stringify({
    comments : com,
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  });

  s.emit("publishStringData", jsonData); //サーバへ送信
}

//コメント投票用の関数(シナリオ用)
function publishScenario(com)
{
  console.log("haitteru");
  if($("#comments").val() === "")
  {
    $("#comments").val("コメント");
    return;
  }
  $("#comments").val(""); //空白にする

  var jsonData = JSON.stringify({
    comments : com,
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  });

  s.emit("publishStringData", jsonData); //サーバへ送信
}

// コメントの取得
function getStringData(list)
{
  $("#window-of-comments-table").empty(); //コメントを初期化する
  $("#display-comments-area").empty(); //コメント描画を初期化する
  $("#window-of-comments-table").prepend("</tbody>");

  // 初期起動の際に読み込みの順序としてlistの中身がundefinedになる
  // ためその対策
  console.log(list);
  if(list !== undefined)
  {
    for(var i=0; i<list.length;i++)
    {

      var jsonData = JSON.parse(list[i]);
      var comments = jsonData.comments;
      var x = jsonData.x | 0;
      var y = jsonData.y | 0;
      var z = jsonData.z | 0;

      var self = camera.position;
      var r = 4;
      var MIN_X = 235;
      var MIN_Y = 350;
      var SCALE = 50;

      if(distance(Math.abs(self.x - x), Math.abs(self.y - y) , Math.abs(self.z - z)) <= r)
      {

        $("#window-of-comments-table").prepend("<tr><td class='comments-contents'>"+comments+"</td><td width='80'>("+x+","+y+","+z+")</td></tr>");

        // 円の空間
        var draw_x = MIN_X+(jsonData.x-camera.position.x)*SCALE;
        var draw_y = MIN_Y+(jsonData.y-camera.position.y)*SCALE;

        $("#display-comments-area").prepend("<div id='comments-font' style='position relative; z-index: 2; top:"+draw_y+"px; left:"+draw_x+"px;'>"+comments+"</div>");

        if(str.match(/webVR/))
        {
          var draw_xr = draw_x + 0.5*window.innerWidth;
          if(0.5*window.innerWidth < draw_xr){
            $("#display-comments-area").prepend("<div id='comments-font-r' style='position relative; z-index: 2; top:"+draw_y+"px; left:"+draw_xr+"px;'>"+comments+"</div>");
        }
      }
    }
  }
    $("#window-of-comments-table").prepend("<tbody>");
  }
}

//カメラ座標を設定する
function setCameraPosition(x,y,z)
{
  // console.log("updata():"+uniqueId);
  camera.position.set(x,y,z);
}

//カメラの視点位置を表示する
function debugCameraPosition()
{
  console.log(
    camera.position.x+
    ' '+camera.position.y+
    ' '+camera.position.z);
  }

  function uniqueID()
  {
    var randam = Math.floor(Math.random()*1000);
    var date = new Date();
    var time = date.getTime();
    return randam + time.toString();
  }

  function distance(x,y,z){
    var d;
    d = Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
    return d;
  }
