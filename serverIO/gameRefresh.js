/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 14:00
 */
var intervalInstance = null;
var PARAMS = require("./../GAME_PARAMETERS");
var REFRESH_RATE_MS = PARAMS.refreshRate;
var coord = require("./coord");

module.exports = function (io, userData) {
    var initialGameData = {
        puck: {
            score: PARAMS.puck.defaultScore,
            speed: PARAMS.puck.defaultSpeed,
            moveTo: coord.deg2rad(PARAMS.puck.defaultMoveTo),
            coord: PARAMS.puck.defaultCoord
        },
        player: {}
    };
    var gameData = {};

    /**
     * Bewegt Puck um einen Schritt
     */
    var movePuck = function () {
        var step = coord.polarToCartesian(gameData.puck.speed, gameData.puck.moveTo);
        gameData.puck.coord.x += step.x;
        gameData.puck.coord.y += step.y;
    };

    return {
        /**
         * Startet gameRefreshing
         */
        start: function () {
            //reset data
            gameData = initialGameData;


            intervalInstance = setInterval(function () {
                movePuck();
                //Sende nur an Spieler (!) Puck und Position des Gegners
                for (var socketID in  userData) {
                    if (userData.hasOwnProperty(socketID)) {
                        userData[socketID].socket.emit("game:refresh",
                            {game: gameData, enemyCoord: userData[socketID].enemyCoord})
                    }
                }
            }, REFRESH_RATE_MS);
        },
        /**
         * Stoppt gameRefreshing
         */
        stop: function () {
            "use strict";
            clearInterval(intervalInstance);
        }
    }
};