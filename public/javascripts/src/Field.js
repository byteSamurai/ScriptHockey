/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666666;
const REFRESH_RATE_MS = 500;
const VERT_UNITS = 1000;
const HORZ_UNITS = VERT_UNITS * RATIO;
const VEC_BOTTOM_TOP = Math.PI; //rad
const VEC_LEFT_RIGHT = Math.PI * 0.5; // rad

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
        this._ID = "field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");

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
        window.setInterval(()=> {
            //Berechne Position aller Objekte
            this._gameObjects.forEach((e)=> {
                e.calcPosition();
            });

            this.solvePuckBorderCollisions();
            this.solveBatterCollisions();

            $(window).trigger("game:tick");

        }, REFRESH_RATE_MS);
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
    }

    /**
     * Löst Wandkollisionen auf
     */
    solvePuckBorderCollisions() {
        var Coord = require("./Coord");
        var Puck = require("./Puck");

        if (!this._gameObjects.has("puck")) {
            throw new Error("No Puck at Game!")
        }

        var puck = this._gameObjects.get("puck");

        if (!puck instanceof Puck) { //korrekte Instanz
            return
        }
        //Überlauf rechts
        let ePos = puck.coord.unit;
        let eSize = puck.size.unit;

        //Right border
        if (ePos.x + eSize.x > HORZ_UNITS) {
            puck.coord = new Coord(HORZ_UNITS - puck.size.unit.x, puck.coord.unit.y);
            puck.setPosition();
            puck.moveTo = Field.collisionDirection(puck.moveTo, VEC_LEFT_RIGHT);
        } else
        // Left border?
        if (ePos.x < 0) {
            puck.coord = new Coord(0, puck.coord.unit.y);
            puck.setPosition();
            puck.moveTo = Field.collisionDirection(puck.moveTo, VEC_LEFT_RIGHT);
        }

        //Bottom border
        if (ePos.y + eSize.y > VERT_UNITS) {
            puck.coord = new Coord(puck.coord.unit.x, VERT_UNITS - puck.size.unit.y);
            puck.setPosition();
            puck.moveTo = Field.collisionDirection(puck.moveTo, VEC_BOTTOM_TOP);
        } else
        //Top border
        if (ePos.y < 0) {
            puck.coord = new Coord(puck.coord.unit.x, 0);
            puck.setPosition();
            puck.moveTo = Field.collisionDirection(puck.moveTo, VEC_BOTTOM_TOP);
        }
    }

    /**
     * Löst Schläger-Kollisionen auf
     */
    solveBatterCollisions() {
        "use strict";
        var Puck = require("./Puck");
        var Batter = require("./Batter");

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
            let xDist = e.coord.unit.x - puck.coord.unit.x;
            let yDist = e.coord.unit.y - puck.coord.unit.y;
            let distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
            //console.log(distance, "collision", distance < (Puck.radius + Batter.radius));
            if (distance < (Puck.radius + Batter.radius)) {
                puck.coord = new Coord(HORZ_UNITS - puck.size.unit.x, puck.coord.unit.y);
                puck.setPosition();
                puck.moveTo = Field.collisionDirection(puck.moveTo, VEC_LEFT_RIGHT);

            }
        });

    }

    /**
     * Berechnet Austrittswinkel
     * @param originAngle
     * @param collidingAngle
     * @returns {number}
     */
    static collisionDirection(originAngle, collidingAngle) {
        "use strict";
        let colAngle = collidingAngle * (180 / Math.PI);
        let orgAngle = originAngle * (180 / Math.PI);
        let dAngle = 2 * colAngle - 2 * orgAngle;
        return (360 + orgAngle + dAngle) % 360;
    }
}

module.exports = Field;