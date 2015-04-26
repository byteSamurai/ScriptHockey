/**
 * Created by: Alfred Feldmeyer
 * Date: 26.04.2015
 * Time: 11:36
 */
var socketio = require('socket.io');

var socketServer = function (app, server) {
    var io = socketio.listen(server);
    require("./server_lib/mouseSync")(io);

};

module.exports.socketServer=socketServer;