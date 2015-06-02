module.exports = function (io) {

    var userData = {};
    var gameIsRunning = false;
    var gameRefresh = require("./gameRefresh")(io, userData);


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
                if (userData.hasOwnProperty(ID) &&
                    userData[ID].name === playerName && socket.id !== ID) {

                    callback({
                        status: "player:nameTaken",
                        msg: "Name bereits vorhanden....sry"
                    });
                    return;
                }
            }
            //noch platz?
            if (Object.keys(userData).length < 2) {
                userData[socket.id] = {
                    name: playerName,
                    socket: socket
                };
                callback({
                    status: "player:nameok"
                });
            } else {
                callback({
                    status: "player:full"
                })
            }
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

            } else {
                //läuft bereits ein Spiel?
                if (gameIsRunning) {
                    callback({
                        status: "player:full"
                    });
                    return;
                }

                var i = parseInt(Math.random() * 10); // Hälften werden zufällig verteilt
                for (var ID in userData) {
                    var pos = ++i % 2 ? "top" : "bottom";
                    if (userData.hasOwnProperty(ID)) {
                        userData[ID].socket.emit("game:start", {playerPos: pos});
                    }
                }
                gameRefresh.start();
                gameIsRunning = true;
            }

        });

        socket.on("player:IMoved", function (data) {
            var socketIDs = Object.keys(userData);
            var curSocketID = socketIDs[socketIDs.indexOf(socket.id)];
            var enemySocketID = socketIDs[(socketIDs.indexOf(socket.id) + 1) % 2];

            if (userData.hasOwnProperty(curSocketID) && userData.hasOwnProperty(enemySocketID)) { // Wenn Spieler im Spiel
                userData[curSocketID].coord = data.coord;
                userData[enemySocketID].enemyCoord = data.coord;
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
            gameRefresh.stop();
            gameIsRunning = false;
            delete userData[socket.id];
        });
    });
};
