module.exports = function (io) {

    var userData = {};

    io.sockets.on("connection", function (socket) {

        /**
         * Neuer Spieler wird angemeldet
         */
        socket.on("player:new", function (data, callback) {
            //existiert schon?
            var playerName = data.name;

            for (var ID in userData) {
                "use strict";
                // Wenn name schon vorhanden und nicht der eigene
                if (userData[ID].name === playerName && socket.id !== ID) {
                    callback({
                        status: "player:nameTaken",
                        msg: "Name bereits vorhanden....sry"
                    });
                    return;
                }
            }
            //genügend Spieler vorhanden?
            userData[socket.id] = {
                name: playerName,
                socket: socket
            };
            callback({
                status: "player:ok"
            });
        });

        /**
         * Anzahl der Spieler auf dem Server
         */
        socket.on("player:amount", function (data, callback) {
            "use strict";
            if (Object.keys(userData).length < 2) {
                callback({
                    status: "player:waiting"
                });
                return;
            }
            if (Object.keys(userData).length > 2) {
                callback({
                    status: "player:full"
                });
                return;
            }
            if (Object.keys(userData).length == 2) {
                io.emit("game:start");
                return;
            }
        });

        socket.on("player:IMoved", function (data) {
            //Sende anderem Spieler Event
            for (var socketID in userData) {
                if (socketID != socket.id) {
                    userData[socketID].socket.emit("player:enemyMoved", {coord: data.coord});
                    return;
                }
            }
        });

        /**
         * Bei Verbindungstrennung
         */
        socket.on('disconnect', function () {
            if (userData[socket.id]) { // Wenn Spieler bereits angemeldet war
                var spielername = userData[socket.id].name;
                io.emit("game:stop", {msg: "Spieler " + spielername + " hat das Spiel verlassen"});
            }
            delete userData[socket.id];
        });
    });
};
