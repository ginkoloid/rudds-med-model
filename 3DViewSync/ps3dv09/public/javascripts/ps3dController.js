//ps3dController.js

var container = document.getElementById('box-container');
var canvas = container.lastElementChild;
var toolflags = -1;

var drag = false;
document.addEventListener("mousedown", function( event ) {
  if(toolflags == -1 || toolflags == 1){
    drag = true;
  }
}, false);

document.addEventListener("mouseup", function( event ) {
  drag = false;
}, false);

document.addEventListener("mousemove", function( event ) {
  if(drag){
    publish();
    if(toolflags != -1){
      if(toolflags == 1){
        getSpherePos(event);
      }
    }
  }
}, false);


container.addEventListener("mousewheel", function( event ) {
  publish();
},false);


container.addEventListener("mouseover", function( event ) {
  controls.enabled = true;
  if(toolflags != -1){
    controls.enabled = false;
  }
}, false);

container.addEventListener("mouseout", function( event ) {
  controls.enabled = false;
}, false);

container.addEventListener("mousedown", function(event) {
  event.preventDefault();
  if(toolflags == 1){
    hogehoge=1;
    getSpherePos(event);
  }else if(toolflags == 2){
    getClearPos(event);
  }else if(toolflags == 3){
    getCubePos(event);
  }else if(toolflags == 4){
    getLinePos(event);
  }
}, false);

container.addEventListener("touchstart", function(event){
  event.preventDefault();

  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
}, false);

/**
 * select tools
 * @param  {Integer} btnNum [function number]
 * @return {void}
 */
function tool(btnNum){
  var pen = document.getElementById("pencil");
  var era = document.getElementById("eraser");
  var cube = document.getElementById("cube");
  var line = document.getElementById("line");
  if(btnNum == 1){
    toolflags = btnNum;
    pen.className = 'active';
    era.className = '';
    cube.className = '';
    line.classNae = '';
  }else if(btnNum == 2){
    toolflags = btnNum;
    era.className = 'active';
    pen.className = '';
    cube.className = '';
    line.classNae = '';
  }else if(btnNum == 3){
    toolflags = btnNum;
    cube.className = 'active';
    era.className = '';
    pen.className = '';
    line.classNae = '';
  }else if(btnNum == 4){
    toolflags = btnNum;
    line.className = 'active';
    pen.className = '';
    era.className = '';
    cube.className = '';
  }

  if(btnNum == -1){
    toolflags = btnNum;
    pen.className = '';
    era.className = '';
    cube.className = '';
    line.classNae = '';
  }
}
