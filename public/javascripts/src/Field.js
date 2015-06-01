/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666666;
const REFRESH_RATE_MS = 30;
const VERT_UNITS = 1000;
const HORZ_UNITS = VERT_UNITS * RATIO;
const VEC_BOTTOM_TOP = Math.PI; //rad
const VEC_LEFT_RIGHT = Math.PI * 0.5; // rad
const SPEED_INCREASE_STEP = 2;

let singleton = Symbol();
let singletonEnforcer = Symbol();

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */
class Field {
    constructor(enforcer) {

        "use strict";
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this._gameObjects = new Map();
        this._initialGameObjectSpecs = new Map();
        this._ID = "field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");
        this._playInstance = null;

        this._calcRatioSize();

        $(window).resize(
            $.throttle(REFRESH_RATE_MS, ()=> {
                this.build();
            })
        );
    }

    /**
     * Spielfeld sollte nur eine Instanz sein
     * @returns {*}
     */
    static get instance() {
        if (this[singleton] === undefined) {
            this[singleton] = new Field(singletonEnforcer);
        }
        return this[singleton];
    }

    /**
     * Wandel Darstellungseinheiten in Pixel um
     * @param {{x: number, y: number} | number} unit
     * @returns {{x: number, y: number} | number}
     */
    static units2pixel(unit) {
        "use strict";
        if (typeof unit !== "number" && (typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x))) {
            throw new Error("units2pixel must get a object as parameter with x and y as a Number");
        }
        let field = Field.instance;

        if (typeof unit == "number") {
            return unit / HORZ_UNITS * field.width;
        } else {
            let vertUnitRatio = unit.y / VERT_UNITS;
            let horUnitRatio = unit.x / HORZ_UNITS;

            return {
                x: field.width * horUnitRatio,
                y: field.height * vertUnitRatio
            };
        }
    }

    /**
     * Wandelt Piel in Darstellungseinheiten um
     * @param {{x: number, y: number} | number} pixel
     * @returns {{x: number, y: number} | number}
     */
    static pixel2units(pixel) {
        "use strict";
        if (typeof pixel !== "number" && (typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x))) {
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }
        let field = Field.instance;


        if (typeof pixel == "number") {
            return pixel / field.width * HORZ_UNITS;
        } else {
            let heightRatio = pixel.y / field.height;
            let widthRatio = pixel.x / field.width;

            return {
                x: widthRatio * HORZ_UNITS,
                y: heightRatio * VERT_UNITS
            };
        }
    }

    /**
     * Höhe in Units
     * @returns {number}
     */
    static get unitHeight() {
        "use strict";
        return VERT_UNITS;
    }

    /**
     * Weite in Units
     * @returns {number}
     */
    static get unitWidth() {
        "use strict";
        return HORZ_UNITS;
    }

    /**
     * Aktualisierungsrate des Spielfelds
     */
    static get refreshRate() {
        "use strict";
        return REFRESH_RATE_MS;
    }

    /**
     * Weite in Pixel
     * @returns {number}
     */
    get width() {
        "use strict";
        return this._width;
    }

    /**
     * Höhe in Pixel
     * @returns {number}
     */
    get height() {
        "use strict";
        return this._height;
    }

    /**
     * Liefert repräsentatives DOM-Element als Jquery
     * @returns {*|jQuery|HTMLElement}
     */
    get html() {
        "use strict";
        return this._fieldHTML;
    }

    /**
     * Berechnet die Breite des Feldes
     * @private
     */
    _calcRatioSize() {
        "use strict";
        this._height = $("body").height();
        this._width = this._height * RATIO;
    }

    /**
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        //Entferne altes Spielfeld
        if (this._fieldHTML !== null) {
            $("#" + this._ID).remove();
        }

        $("body").append(this._fieldHTML);
        this._fieldHTML.css({
            height: this._height,
            width: this._width,
            marginLeft: this._width * -.5 //4 center-alignment
        });

        this._gameObjects.forEach((e)=> {
            $("#" + this._ID).append(e.html);
        });
    }

    /**
     * Zeichnet alle Gameobjects ein
     */
    play() {
        "use strict";
        this._playInstance = window.setInterval(()=> {
            //Berechne Position aller Objekte
            this._gameObjects.forEach((e)=> {
                e.calcPosition();
            });
            this.detectGoalCollision();
            this.solvePuckBorderCollisions();
            this.solveBatterCollisions();

            $(window).trigger("game:tick");

        }, REFRESH_RATE_MS);
    }

    /**
     * Stoppt Spiel
     */
    stop() {
        "use strict";
        window.clearInterval(this._playInstance);
    }

    /**
     * Setzt Spielelemente auf Ausgangszustand zurück
     */
    reset() {
        "use strict";
        let puck = this._gameObjects.get("puck");
        puck.speed = 0;
        puck.resetScore();
        this._gameObjects.forEach((e)=> {
            e.coord.unit = this._initialGameObjectSpecs.get(e.ID).pos;
            e.setPosition();
        });
    }

    /**
     * Fügt neue Spielelemente hinzu
     * @param gameObject
     */
    deployGameObject(gameObject) {
        "use strict";
        let GameObject = require("./GameObject");

        if (!gameObject instanceof GameObject) {
            throw new Error("Must be a gameobject");
        }

        gameObject.setPosition();
        this._gameObjects.set(gameObject.ID, gameObject);
        this._initialGameObjectSpecs.set(gameObject.ID, {
            pos: {
                x: gameObject.coord.unit.x,
                y: gameObject.coord.unit.y
            }
        });
    }

    /**
     * Fügt neues Dashboard hinzu
     * @param dashboard
     */
    deployDashboard(dashboard){
        "use strict";
        let Dashboard = require("./Dashboard");

        if (!dashboard instanceof Dashboard) {
            throw new Error("Must be a dashboard");
        }

        $("#" + this._ID).append(dashboard.html);
    }

    /**
     * Löst Wandkollisionen auf
     */
    solvePuckBorderCollisions() {
        let Coord = require("./Coord");
        let Puck = require("./Puck");

        if (!this._gameObjects.has("puck")) {
            throw new Error("No Puck at Game!")
        }

        var puck = this._gameObjects.get("puck");

        if (!puck instanceof Puck) { //korrekte Instanz
            return
        }

        let ePos = puck.coord.unit;
        let eSize = puck.size.unit;
        var wallDirection;

        //Right border
        if (ePos.x + eSize.x > HORZ_UNITS) {
            puck.coord.unit = {
                x: HORZ_UNITS - puck.size.unit.x,
                y: puck.coord.unit.y
            };
            wallDirection = VEC_LEFT_RIGHT;
        } else
        // Left border?
        if (ePos.x < 0) {
            puck.coord.unit = {
                x: 0,
                y: puck.coord.unit.y
            };
            wallDirection = VEC_LEFT_RIGHT;
        }

        //Bottom border?
        if (ePos.y + eSize.y > VERT_UNITS) {
            puck.coord.unit = {
                x: puck.coord.unit.x,
                y: VERT_UNITS - puck.size.unit.y
            };
            wallDirection = VEC_BOTTOM_TOP;
        } else
        //Top border?
        if (ePos.y < 0) {
            puck.coord.unit = {
                x: puck.coord.unit.x,
                y: 0
            };
            wallDirection = VEC_BOTTOM_TOP;
        }

        if (wallDirection != undefined) {
            puck.moveTo = Field.collisionDirection(puck.moveTo, wallDirection);
            puck.setPosition();
        }
    }

    /**
     * Löst Schläger-Kollisionen auf
     */
    solveBatterCollisions() {
        "use strict";
        var Puck = require("./Puck");
        var Batter = require("./Batter");
        var Coord = require("./Coord");

        let puck = this._gameObjects.get("puck");

        let batters = [];
        let batterBottom = this._gameObjects.get("batter-bottom");
        let batterTop = this._gameObjects.get("batter-top");

        if (batterBottom !== undefined) {
            batters.push(batterBottom)
        }
        if (batterTop !== undefined) {
            batters.push(batterTop)
        }

        batters.forEach((e)=> {
            let xDist = e.centerCoord.unit.x - puck.centerCoord.unit.x;
            let yDist = e.centerCoord.unit.y - puck.centerCoord.unit.y;
            let polarCoord = Coord.cartesianToPolar(xDist, yDist);
            let radiusSum = Puck.radius + Batter.radius;
            //Bounced!
            if (polarCoord.distance < radiusSum) {
                //Schiebe Puck an Rand von Batter
                polarCoord.distance -= radiusSum;
                let batterBorderCoord = Coord.polarToCartesian(polarCoord.distance, polarCoord.angle);
                puck.coord.add(batterBorderCoord);
                puck.setPosition();
                //Drehe um 180° zum zentrum
                puck.moveTo = (polarCoord.angle + Math.PI) % (2 * Math.PI);
                puck.speed += SPEED_INCREASE_STEP;
                //speed+direction -> puck ... batter "stoppen"
                //puck.speed = e.speed;
                //puck.moveTo = e.moveTo;
                //e.moveTo = 0;
                puck.addScore();
                console.info("Puck ist nun " + puck.score + " wert");
            }
        });
    }

    /**
     * Berechnet Austrittswinkel
     * @param originAngle
     * @param collidingAngle
     * @returns {number} rad des neuen Winkels
     */
    static collisionDirection(originAngle, collidingAngle) {
        "use strict";
        let fullCircleRad = 2 * Math.PI;
        return (fullCircleRad + originAngle + 2 * collidingAngle - 2 * originAngle) % fullCircleRad;
    }

    /**
     * Erkenne Tor
     */
    detectGoalCollision() {
        let Puck = require("./Puck");
        let puck = this._gameObjects.get("puck");

        [
            this._gameObjects.get("goal-top"),
            this._gameObjects.get("goal-bottom")
        ].forEach(
            (e)=> {
                "use strict";
                let start = e.coord.unit.x;
                let end = start + e.width;
                //Oberes Tor
                if (puck.coord.unit.y <= 0
                    && puck.coord.unit.x - Puck.radius / 2 > start
                    && puck.coord.unit.x + Puck.radius / 2 < end) {
                    this.stop();
                    $(window).trigger("game:goal", {
                        player: "top",
                        score: puck.score
                    })
                }

                if ((puck.coord.unit.y + 2 * Puck.radius) >= VERT_UNITS - Puck.radius
                    && puck.coord.unit.x - Puck.radius / 2 > start
                    && puck.coord.unit.x + Puck.radius / 2 < end) {
                    this.stop();
                    $(window).trigger("game:goal", {
                        player: "bottom",
                        score: puck.score
                    })
                }
            }
        )
    }
}

module.exports = Field;