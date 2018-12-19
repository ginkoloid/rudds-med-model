var root = '/~g1144155/TeraCoder';
var REPLACE_ROOT = /\[###root###\]/g;

document.write((function() {
    /*
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="author" content="KENGO IMAE" />
        <meta name="copyright" content="Copyright (C) 2014 KENGO IMAE" />
        <meta name="author" content="HIROSHI SHIMADA" />
        <meta name="copyleft" content="Copyleft (C) 2017 HIROSHI SHIMADA" />
    	<link rel='stylesheet' href='/stylesheets/style.css' />
    	<link rel='stylesheet' href='/stylesheets/bootstrap.css' />
    	<script type="text/javascript" src="/javascripts/jquery.min.js"></script>
    	<script type="text/javascript" src="/javascripts/bootstrap.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script type="text/javascript" src="/javascripts/three/three.min.js"></script>
        <script type="text/javascript" src="/javascripts/html2canvas.js"></script>
    	<script type="text/javascript" src="/javascripts/Detector.js"></script>
      <script type="text/javascript" src="/javascripts/dat.gui.min.js"></script>
    	<script type="text/javascript" src="/javascripts/controls/OrbitControls.js"></script>
      <script type="text/javascript" src="/javascripts/vr/CardboardEffect.js"></script>
      <script type="text/javascript" src="/javascripts/vr/StereoEffect.js"></script>
      <script type="text/javascript" src="/javascripts/vr/VRControls.js"></script>
      <script type="text/javascript" src="/javascripts/vr/DeviceOrientationControls.js"></script>
      <script type="text/javascript" src="/javascripts/vr/webvr-manager.js"></script>
      <script type="text/javascript" src="/javascripts/vr/webvr-polyfill.js"></script>
        <script type="text/javascript" src="/javascripts/ps3dModel.js"></script>
        <script type="text/javascript" src="/javascripts/ps3dView.js"></script>
        <script type="text/javascript" src="/javascripts/ps3dController.js"></script>
    		*/
}).toString().split('*')[1]);


var initialize = function() {
    var topbar = document.getElementById("topbar");
    topbar.innerHTML = (function() {
        /*
        			<div class="navbar navbar-inverse navbar-fixed-top">
        				<div class="navbar-inner">
        					<div class="container">
        						<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        							<span class="icon-bar"></span>
        							<span class="icon-bar"></span>
        							<span class="icon-bar"></span>
        						</button>
        						<a class="brand" href="#">Pub/Sub-3D <span class="small">Ver0.5α</spam></a>
        						<div class="nav-collapse collapse">
        							<ul class="nav pull-left">
        								<li class="divider-vertical"></li>
        								<li>
        									<li class="dropdown">
        										<a href="#" class="dropdown-toggle" data-toggle="dropdown">
        										File transmission
        										<b class="caret"></b>
        										</a>
        										<ul class="dropdown-menu">
        										<li>
        										<a>
        										<form method="post" enctype="multipart/form-data" action="/upload">
        											<input type="file" name="thumbnail">
        											<input type="submit" class="btn btn-primary" value="Send" />
        										</form>
        										</a>
        										</li>
        										</ul>
        									</li>
        								</li>
        								<li class="dropdown">
        									<a href="#" class="dropdown-toggle" data-toggle="dropdown" onClick="screenShot()" >
        										ScreenShot
        										<b class="caret"></b>
        									</a>
        								</li>
                        <li class="dropdown">
        									<a href="/webVR" class="dropdown-toggle" data-toggle="dropdown" onClick="fullScreen()" >
        										webVR
                            <b class="caret"></b>
                          </a>
        								</li>
                        <li class="dropdown">
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                          Video
                          <b class="caret"></b>
                          </a>
                          <ul class="dropdown-menu">
                          <li>
                          <a>
                          <input type="button" class="btn btn-primary" value="Record" onClick="startVideo()">
                          <input type="button" class="btn btn-primary" value="Stop" onClick="stopVideo()">
                          </a>
                          </li>
                          </ul>
                        </li>
        								<li class="divider-vertical"></li>
        							</ul>
        						</div>
        					</div>
        				</div>
        			</div>
        			*/
    }).toString().split('*')[1].replace(REPLACE_ROOT, root);

    var color = document.getElementById("color");
    color.innerHTML = (function(){
        /*
        <div class="navbar-inner">
          <div class="container">
            <input type="image" id="pencil" src="images/1.png" height="35px" width="35px" onClick="tool(1);" />
            <input type="image" id="eraser" src="images/2.png" height="35px" width="35px" onClick="tool(2);" />
            <input type="image" id="cube" src="images/3.png" height="35px" width="35px" onClick="tool(3);" />
            <input type="image" id="line" src="images/4.png" height="35px" width="35px" onClick="tool(4);" />
            <input type="button" value="リセット" onClick="tool(-1)"/>
          </div>
        </div>
        */
    }).toString().split('*')[1].replace(REPLACE_ROOT, root);

    var footer = document.getElementById("footer");
    footer.innerHTML = (function() {
        /*
        			<div class="navbar navbar-inverse navbar-fixed-bottom">
        				<div class="navbar-inner">
        					<div class="container">
        						<a class="brand" href="#">Comment</a>
        						<div class="nav-collapse collapse">
        							<ul class="nav pull-center">
        								<li class="divider-vertical"></li>
        								<li><div id="input-comments-form">
        									<form action="" method="post" onsubmit="return false;" class="navbar-form">
        										<input type="text" id="comments" class="span7" placeholder="To comment"/>
        										<input type="submit" class="btn btn-primary" onClick="publishComments(target.value,comments.value);" value="Send" />
        									</form>
        								</div></li>
        						</div>
        					</div>
        				</div>
        			</div>
        			*/
    }).toString().split('*')[1].replace(REPLACE_ROOT, root);

    $('.dropdown-toggle').dropdown();

    $('#selectFile').on('click', function() {
        $('#file').trigger('click');
    });

    $('#file').change(function() {
        $('#selectedFile').val($(this).val());
    });

    return;
};
window.addEventListener('load', initialize, false);
