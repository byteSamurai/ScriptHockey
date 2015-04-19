/**
 * Created by: Alfred Feldmeyer
 * Date: 13.04.2015
 * Time: 17:08
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port=3000;
var ip = require("ip");

server.listen(port);
console.log("\033[44m Server started and listen under\t http://"+ip.address()+":"+port+"   \033[49m");

//Statische Verzeichnisse
app.use('/vendors', express.static(__dirname + '/vendors'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/font', express.static(__dirname + '/font'));
app.use('/css', express.static(__dirname + '/css'));

//Deliver Index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


require("./server_lib/mouseSync")(io);






