/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 14:00
 */
var intervalInstance = null;
var PARAMS = require("./../gameParams")();
var REFRESH_RATE_MS = PARAMS.refreshRate;
var coord = require("./coord");
var extend = require('util')._extend;

module.exports = function (io, userData) {

    var puck = {};
    var puckIsFrozen = false; // Spiel pausiert?
    /**
     * needed Parameter
     */
    var VERT_UNITS = PARAMS.field.height;
    var HORZ_UNITS = PARAMS.field.width;
    var VERT_COLLISION = PARAMS.vertCollVec;
    var HORZ_COLLISION = PARAMS.horzCollVec;
    var PUCK_RADIUS = PARAMS.puck.radius;
    var BATTER_RADIUS = PARAMS.batter.radius;
    /**
     * Bewegt Puck um einen Schritt
     */
    var movePuck = function () {
        detectGoal();
        solvePuckBorderCollisions();
        solveBatterCollisions();
        var step = coord.polarToCartesian(puck.speed, puck.moveTo);
        puck.coord.x += step.x;
        puck.coord.y += step.y;
    };

    /**
     * Löst Tor-Event aus
     */
    var triggerGoal = function (type) {
        gameInstanz.freezePuck();
        //Timeout verhindert mehrer Toor in zu kurzer Zeit und Prell-Pucks
        for (var ID in userData) {
            //Weiter zum nächsten Benutzer
            if (userData.hasOwnProperty(ID) && userData[ID].position != type) {
                continue;
            }
            //Tore eintragen
            if (userData.hasOwnProperty(ID) && userData[ID].position == type) {
                userData[ID].score += puck.score;
                userData[ID].goals += 1;
                break;
            }
        }
        //Aktualisiere Dashboard
        gameInstanz.updateDashboard();
        setTimeout(function () {
            "use strict";
            gameInstanz.resetPuck();
            gameInstanz.releasePuck();
        }, PARAMS.timeoutAfterGoal);
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
     * Erkennt ein Tor
     */
    var detectGoal = function () {
        "use strict";
        if (puckIsFrozen) { // Abbruch bei Pause
            return;
        }

        var start = PARAMS.goal.positionBottom.x; // beide x-Coordinaten sind gleich
        var end = start + PARAMS.goal.width;

        //Oberes Tor
        if (puck.coord.y <= 0
            && puck.coord.x - PUCK_RADIUS / 2 > start
            && puck.coord.x + PUCK_RADIUS / 2 < end) {
            triggerGoal("top");

        } else
        //Unteres Tor
        if ((puck.coord.y + 2 * PUCK_RADIUS) >= VERT_UNITS - PUCK_RADIUS
            && puck.coord.x - PUCK_RADIUS / 2 > start
            && puck.coord.x + PUCK_RADIUS / 2 < end) {
            triggerGoal("bottom");
        }
    };
    /**
     * Löst Banden-Kollisionen auf
     */
    var solvePuckBorderCollisions = function () {

        var puckPos = puck.coord;
        var puckSize = {
            x: PUCK_RADIUS * 2,
            y: PUCK_RADIUS * 2
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

        var batters = [];
        for (var socketID in userData) {
            if (userData.hasOwnProperty(socketID)) {
                batters.push({
                    coord: userData[socketID].coord
                })
            }
        }

        batters.forEach(function (e) {
            var xDist = e.coord.x - puck.coord.x - PUCK_RADIUS + BATTER_RADIUS;
            var yDist = e.coord.y - puck.coord.y - PUCK_RADIUS + BATTER_RADIUS;
            var polarCoord = coord.cartesianToPolar(xDist, yDist);
            var radiusSum = PUCK_RADIUS + BATTER_RADIUS;

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
    var gameInstanz = {
        /**
         * Startet gameRefreshing
         */
        start: function () {
            //reset data
            gameInstanz.resetPuck();

            //Setzte Scores und goals zurück
            gameInstanz.resetPlayer();

            //Dashboard zeichnen
            gameInstanz.updateDashboard();

            intervalInstance = setInterval(function () {
                if (puckIsFrozen !== true) {
                    movePuck();
                }
                //Sende nur an Spieler (!) Puck und Position des Gegners
                for (var socketID in  userData) {
                    if (userData.hasOwnProperty(socketID)) {
                        userData[socketID].socket.emit("game:refresh",
                            {puck: puck, enemyCoord: userData[socketID].enemyCoord})
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
        },
        freezePuck: function () {
            "use strict";
            puckIsFrozen = true;
        },
        releasePuck: function () {
            puckIsFrozen = false;
        },
        /**
         * Aktualsiert das Dashboard
         */
        updateDashboard: function () {
            //Benachrichtige Spieler

            var dashboardData = [];

            for (var socketID in  userData) {
                if (userData.hasOwnProperty(socketID)) {
                    dashboardData.push({
                        socketID: socketID,
                        name: userData[socketID].name,
                        goals: userData[socketID].goals,
                        score: userData[socketID].score
                    });
                }
            }
            dashboardData.forEach(function (e) {
                userData[e.socketID].socket.emit("game:goal",
                    dashboardData
                )
            });
        },
        resetPuck: function () {
            "use strict";
            PARAMS = require("../gameParams")();
            var initialPuckData = {
                score: PARAMS.puck.defaultScore,
                speed: PARAMS.puck.defaultSpeed,
                moveTo: coord.deg2rad(PARAMS.puck.defaultMoveTo),
                coord: PARAMS.puck.defaultCoord
            };

            puck = extend({}, initialPuckData);
        },
        resetPlayer: function () {
            "use strict";

            for (var ID in  userData) {
                if (userData.hasOwnProperty(ID)) {
                    userData[ID].goals = 0;
                    userData[ID].score = 0;
                }
            }
        }
    };

    return gameInstanz;
};