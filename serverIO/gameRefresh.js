/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 14:00
 */
var intervalInstance = null;
var PARAMS = require("./../gameParams");
var REFRESH_RATE_MS = PARAMS.refreshRate;
var coord = require("./coord");
var extend = require('util')._extend;

module.exports = function (io, userData) {
    var initialGameData = {
        puck: {
            score: PARAMS.puck.defaultScore,
            speed: PARAMS.puck.defaultSpeed,
            moveTo: coord.deg2rad(PARAMS.puck.defaultMoveTo),
            coord: PARAMS.puck.defaultCoord,
            centerCoord: function () {
                return {
                    x: gameData.puck.coord.x - PARAMS.puck.radius,
                    y: gameData.puck.coord.y - PARAMS.puck.radius,
                }
            }
        },
        player: {}
    };
    var gameData = {};
    /**
     * needed Parameter
     */
    var VERT_UNITS = PARAMS.field.height;
    var HORZ_UNITS = PARAMS.field.width;
    var VERT_COLLISION = PARAMS.vertCollVec;
    var HORZ_COLLISION = PARAMS.horzCollVec;

    /**
     * Bewegt Puck um einen Schritt
     */
    var movePuck = function () {
        solvePuckBorderCollisions();
        solveBatterCollisions();
        var step = coord.polarToCartesian(gameData.puck.speed, gameData.puck.moveTo);
        gameData.puck.coord.x += step.x;
        gameData.puck.coord.y += step.y;


    };

    /**
     * Ermittelt Ausfallswinkel anhand von
     * UrsprungsWinkel und Collisionswinkel
     * @param originAngle
     * @param collidingAngle
     * @returns {number}
     */
    var collisionDirection = function (originAngle, collidingAngle) {
        "use strict";
        var fullCircleRad = 2 * Math.PI;
        return (fullCircleRad + originAngle + 2 * collidingAngle - 2 * originAngle) % fullCircleRad;
    };

    /**
     * Löst Banden-Kollisionen auf
     */
    var solvePuckBorderCollisions = function () {
        var puck = gameData.puck;
        var puckPos = puck.coord;
        var puckSize = {
            x: PARAMS.puck.radius * 2,
            y: PARAMS.puck.radius * 2
        };
        var wallDirection;

        //Right border
        if (puckPos.x + puckSize.x > HORZ_UNITS) {
            puck.coord = {
                x: HORZ_UNITS - puckSize.x,
                y: puck.coord.y
            };
            wallDirection = VERT_COLLISION;
        } else
        // Left border?
        if (puckPos.x < 0) {
            puck.coord = {
                x: 0,
                y: puck.coord.y
            };
            wallDirection = VERT_COLLISION;
        }

        //Bottom border?
        if (puckPos.y + puckSize.y > VERT_UNITS) {
            puck.coord = {
                x: puck.coord.x,
                y: VERT_UNITS - puckSize.y
            };
            wallDirection = HORZ_COLLISION;
        } else
        //Top border?
        if (puckPos.y < 0) {
            puck.coord = {
                x: puck.coord.x,
                y: 0
            };
            wallDirection = HORZ_COLLISION;
        }

        if (wallDirection != undefined) {
            puck.moveTo = collisionDirection(puck.moveTo, wallDirection);
            puck.speed -= PARAMS.puck.speedIncreaseStep / 2;
            puck.speed = puck.speed <= 0 ? 2 : puck.speed;
        }
    };
    /**
     * Löst Schläger-Kollisionen auf
     */
    var solveBatterCollisions = function () {
        "use strict";
        var puck = gameData.puck;

        var batters = [];
        for (var socketID in userData) {
            if (userData.hasOwnProperty(socketID)) {
                batters.push({
                    coord: userData[socketID].coord
                })
            }
        }

        batters.forEach(function (e) {
            var xDist = e.coord.x - puck.coord.x - PARAMS.puck.radius + PARAMS.batter.radius;
            var yDist = e.coord.y - puck.coord.y - PARAMS.puck.radius + PARAMS.batter.radius;
            var polarCoord = coord.cartesianToPolar(xDist, yDist);
            var radiusSum = PARAMS.puck.radius + PARAMS.batter.radius;

            //Bounced!
            if (polarCoord.distance < radiusSum) {

                //Schiebe Puck an Rand von Batter
                polarCoord.distance -= radiusSum;
                var batterBorderCoord = coord.polarToCartesian(polarCoord.distance, polarCoord.angle);
                puck.coord.x += batterBorderCoord.x;
                puck.coord.y += batterBorderCoord.y;

                //Drehe um 180° zum zentrum
                puck.moveTo = (polarCoord.angle + Math.PI) % (2 * Math.PI);

                puck.speed += PARAMS.puck.speedIncreaseStep;
                puck.speed = puck.speed > PARAMS.puck.maxSpeed ? PARAMS.puck.maxSpeed : puck.speed;

                puck.score += PARAMS.puck.scoreIncreaseStep;
            }
        });
    };
    return {
        /**
         * Startet gameRefreshing
         */
        start: function () {
            //reset data
            gameData = extend({}, initialGameData);


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