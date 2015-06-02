/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 14:00
 */
var intervalInstance = null;
var REFRESH_RATE_MS = 50;

module.exports = function (io, userData) {
    var initialGameData = {
        puck: {
            speed: 10,
            moveTo: 45,
            coord: {
                x: 0,
                y: 0
            }
        },
        player: {}
    };
    var gameData = {};


    return {
        start: function () {
            //reset data
            gameData = initialGameData;


            intervalInstance = setInterval(function () {
                //Test
                gameData.puck.coord.x++;
                gameData.puck.coord.y++;

                //Sende nur an Spieler (!) Puck und Position des Gegners
                for (var socketID in  userData) {
                    if (userData.hasOwnProperty(socketID)) {
                        userData[socketID].socket.emit("game:refresh",
                            {game: gameData, enemyCoord: userData[socketID].enemyCoord})
                    }
                }
            }, REFRESH_RATE_MS);
        },
        stop: function () {
            "use strict";
            clearInterval(intervalInstance);
        }
    }
};