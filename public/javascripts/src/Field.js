/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666666;
const REFRESH_RATE_MS = 10;
const VERT_UNITS = 1000;
const HORZ_UNITS = VERT_UNITS * RATIO;

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
        this._name = "Field";
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
     * Berechnet die Breite des Feldes
     * @private
     */
    _calcRatioSize() {
        "use strict";
        this._height = $("body").height();
        this._width = this._height * RATIO;
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

    get html() {
        "use strict";
        return this._fieldHTML;
    }

    /**
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        //Entferne altes Spielfeld
        if (this._fieldHTML !== null) {
            $("#" + this._name.toLowerCase()).remove();
        }

        $("body").append(this._fieldHTML);
        this._fieldHTML.css({
            height: this._height,
            width: this._width,
            marginLeft: this._width * -.5 //4 center-alignment
        });

        this._gameObjects.forEach((e)=> {
            $("#field").append(e.html);
        });
    }

    /**
     * Zeichnet alle Gameobjects ein
     */
    play() {
        "use strict";
        window.setInterval(()=> {
            this._gameObjects.forEach((e)=> {
                e.calcPosition();
                this.solveBorderCollisions();
            });
            $(window).trigger("game:tick");

        }, REFRESH_RATE_MS);

    }

    /**
     * Fügt neue Spielelemente hinzu
     * @param gameObject
     */
    deployGameObject(gameObject) {
        "use strict";
        if (gameObject.type !== "GameObject") {
            throw new Error("Must be a gameobject");
        }
        gameObject.setPosition();
        this._gameObjects.set(gameObject.name, gameObject);
    }

    /**
     * Löst kollisionen auf
     */
    solveBorderCollisions() {
        var Coord = require("./Coord");
        this._gameObjects.forEach((e)=> {
            if (e.name !== "Puck") {
                return
            }
            //Überlauf rechts
            let ePos = e.coord.unit;
            let eSize = e.size.unit;

            //Right border
            if (ePos.x + eSize.x > HORZ_UNITS) {
                //Setzte Puck an die Wand
                e.coord = new Coord(HORZ_UNITS - e.size.unit.x, e.coord.unit.y);
                e.setPosition();

                //quirky
                e.moveTo = Field.collisionDirection(e.moveTo, 0.5 * Math.PI);
            } else
            // Left border?
            if (ePos.x < 0) {
                e.coord = new Coord(0, e.coord.unit.y);
                e.setPosition();
                e.moveTo = Field.collisionDirection(e.moveTo, 1.5 * Math.PI);
            }

            //Bottom border
            if (ePos.y + eSize.y > VERT_UNITS) {
                e.coord = new Coord(e.coord.unit.x, VERT_UNITS - e.size.unit.y);
                e.setPosition();
                e.moveTo = Field.collisionDirection(e.moveTo, Math.PI);
            } else
            //Top border
            if (ePos.y < 0) {
                e.coord = new Coord(e.coord.unit.x, 0);
                e.setPosition();
                e.moveTo = Field.collisionDirection(e.moveTo, Math.PI);
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