//
/**
* Module dependencies.
*/

var express = require('express');
//var routes = require('./routes');
var routes = {
	index  : require('./routes/index'),
	upload : require('./routes/upload'),
	webVR : require('./routes/webVR')
};
var user = require('./routes/user');
var path = require('path');
var socketio = require('socket.io');
var fs = require("fs");

/**
 * [http is variable for http communication]
 * @type {undefined}
 */
var http = require('http');
var app = express();
/**
 * [server is creating http connection server]
 * @type {undefined}
 */
var server = http.createServer(app);

/**
 * [https is variable for https communication]
 * @type {undefined}
 */
var https = require('https');
var options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt')
};
// var server = https.createServer(options,app);

/**
 * all environments
 * @type {String}
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/', routes.index.index);
app.get('/webVR', routes.webVR.webVR);
app.post('/upload', routes.upload.post);

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

/**
 * [Setting of Socket.io]
 * @type {Event}
 */
var io = socketio.listen(server);
/**
 * [Depending on the topic received by the server, the part that changes behavior]
 * @param  {Event} socket [socket connection]
 * @return {void}        [void]
 */
io.sockets.on('connection', function(socket)
{
	initConnect();

	socket.on("Pub", function (data)
	{
		publishMessage(data);
	});

	socket.on("publishStringData", function (jsonData)
	{
		publishStringData(jsonData);
	});

	socket.on("publishPoints", function(jsonData)
	{
		publishPoints(jsonData);
	});

	socket.on("publishOutPoints", function(jsonData)
	{
		publishOutPoints(jsonData);
	});

	socket.on("publishClearPeints", function()
	{
		publishClearPeints();
	});

	socket.on("publishCubePoints", function(jsonData)
	{
		publishCubePoints(jsonData);
	});

	socket.on("publishreload", function(flag)
	{
		publishreload(flag);
	});

	socket.on('disconnect', function() {
    console.log('途切れました');
  });
});


//以下pub/sub処理
var redis = require('redis');
var publisher = redis.createClient(6379, 'localhost');
var subscriber = redis.createClient(6379, 'localhost');

/**
 * [publishMessage is publishing function]
 * @param  {String} data [pubish Message]
 * @return {void}      [void]
 */
function publishMessage(data)
{
	publisher.publish('share', data);
	publisher.lrange("comments", 0, -1, function(err, list) {
		io.sockets.emit("getStringData", list);
	});
}

/**
 * [initConnect is Processing at the time of client's initial connection]
 * @return {void} [void]
 */
function initConnect(){
	publisher.lrange("comments", 0, -1, function(err, list) {
		io.sockets.emit("getStringData", list);
	});

	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getSpherePoints", list);
	});

	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getSphereOutPoints", list);
	});

	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getCubePoints", list);
	});
}

/**
 * Process to subscribe function
 */
subscriber.subscribe('share');
subscriber.on('message', function(channel, data)
{
	io.sockets.emit("Sub", data);
});

/**
 * [publishStringData is Publish comments and Scenario data]
 * @param  {Strign} jsonData [Comments and String data of Scenario]
 * @return {void}          [void]
 */
function publishStringData(jsonData)
{
	publisher.rpush("comments",jsonData);
	publisher.lrange("comments", 0, -1, function(err, list) {
		io.sockets.emit("getStringData", list);
	});
}


/**
 * [publishPoints is Processing to publish 3D annotation function]
 * @param  {String} jsonData [3D annotation]
 * @return {void}          [void]
 */
function publishPoints(jsonData)
{
	publisher.rpush("mode",jsonData);
	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getSpherePoints", list);
	});
}

/**
 * [publishPoints is Processing to publish 3D annotation of Coordinate]
 * @param  {String} jsonData [3D annotation Data of Point]
 * @return {void}          [void]
 */
function publishOutPoints(jsonData)
{
	publisher.rpush("mode",jsonData);
	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getSphereOutPoints", list);
	});
}

/**
 * [publishPoints is Processing to publish 3D annotation of Cube Coordinate]
 * @param  {String} jsonData [3D annotation Data of Cube]
 * @return {void}          [void]
 */
function publishCubePoints(jsonData){
	publisher.rpush("mode",jsonData);
	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getCubePoints", list);
	});
}

/**
 * [publishPoints is Processing of deleting and publishing 3D annotation data]
 * @param  {String} jsonData [3D annotation Data of Cube]
 * @return {void}          [void]
 */
function publishClearPeints()
{
	publisher.lrange("mode", 0, -1, function(err, list) {
		io.sockets.emit("getClearPeints", list);
	});
	publisher.del("mode");
}
