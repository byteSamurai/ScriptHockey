module.exports = function (io) {

    var userData = {};

    io.sockets.on("connection", function (socket) {




        //    io.emit("userAmount", ++userAmount);
        //
        /**
         * Neuer SPieler wird angemeldet
         */
        socket.on("player:new", function (data, callback) {
            //existiert schon?
            var playerName = data.name;

            for (var ID in userData) {
                "use strict";
                if (userData[ID].name === playerName) {
                    callback({
                        status: "player:nameTaken",
                        msg: "Name bereits vorhanden....sry"
                    });
                    return;
                }
            }
            //genügend Spieler vorhanden?
            userData[socket.id] = {};
            userData[socket.id].name = playerName;
            callback({
                status: "player:ok"
            });

            //userData[socket.id] = data;

            //if (userData.length) {
            //
            //}


            //io.emit("userPositions", userData);
        });

        /**
         *
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

        /**
         * Bei Verbindungstrennung
         */
        socket.on('disconnect', function () {
            delete userData[socket.id];
        });
    });
};
