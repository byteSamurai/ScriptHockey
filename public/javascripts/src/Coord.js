/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

var Field = require("./Field.js");
const UNITS = "u";
const PIXEL = "px";
class Coord {
    /**
     *
     * @param x
     * @param y
     * @param {UNITS | PIXEL} type
     * @returns {{x: number, y: number}|*}
     */
    constructor(x = 0, y = 0, type = UNITS) {
        "use strict";
        this._type = "Coord";
        this._pixel = {x: 0, y: 0};
        this._unit = {x: 0, y: 0};

        if (type === UNITS) {
            this.unit = {x: x, y: y};
            this._pixel = Field.units2pixel(this._unit);
        } else {
            this.pixel = {x: x, y: y};
            this._unit = Field.pixel2units(this._pixel);
        }
    }

    get type() {
        "use strict";
        return this._type;
    }

    /**
     * Multipliziert Koordinaten
     * @param coord
     */
    multiply(coord) {
        "use strict";
        this._unit = {
            x: this.unit.x * coord.unit.x,
            y: this.unit.y * coord.unit.y
        };
        this._pixel = Field.units2pixel(this._unit);
        return this
    }

    /**
     * Dividierts Koordinaten durch
     * @param coord teiler
     */
    divide(coord) {
        "use strict";
        this._unit = {
            x: this.unit.x / coord.unit.x,
            y: this.unit.y / coord.unit.y
        };
        this._pixel = Field.units2pixel(this._unit);
        return this
    }

    /**
     * Addiert Koordinaten
     * @param coord Koordinate, die addiert werden soll
     */
    add(coord) {
        "use strict";
        this._unit = {
            x: this.unit.x + coord.unit.x,
            y: this.unit.y + coord.unit.y
        };
        this._pixel = Field.units2pixel(this._unit);
        return this
    }

    /**
     * Substrahiert Koordinaten
     * @param coord
     */
    sub(coord) {
        "use strict";
        this._unit = {
            x: this.unit.x - coord.unit.x,
            y: this.unit.y - coord.unit.y
        };
        this._pixel = Field.units2pixel(this._unit);
        return this
    }

    /**
     * Setzt Pixel
     * @param {{x:number,y:number}} xyObject
     */
    set pixel(xyObject) {
        "use strict";
        if (typeof xyObject !== "object" || isNaN(xyObject.y) || isNaN(xyObject.x)) {
            throw new Error("pixel must be an object with a x and y component");
        }
        this._pixel = xyObject;
        this._unit = Field.pixel2units(this._pixel);
    }

    /**
     * Liefert Pixel-Kompontente der Koordinate
     * @returns {{x:number,y:number}}
     */
    get pixel() {
        "use strict";
        return this._pixel;
    }

    /**
     * Setzt Darstellungseinheiten
     * @param {{x:number,y:number}} xyObject
     */
    set unit(xyObject) {
        "use strict";
        if (typeof xyObject !== "object" || isNaN(xyObject.y) || isNaN(xyObject.x)) {
            throw new Error("unit must be an object with a x and y component");
        }
        this._unit = xyObject;
        this._pixel = Field.units2pixel(this._unit);
    }

    /**
     * Liefert Darstellungeinheit der Koordinate
     * @returns {{x:number,y:number}}
     */
    get unit() {
        "use strict";
        return this._unit;
    }

    /**
     * Clone Coordinaten
     * @returns {Coord}
     */
    clone() {
        "use strict";
        return new Coord(this._unit.x, this._unit.y)
    }

    /**
     * Aktualisiert pixel von units ausgehend
     */
    refreshFromUnits() {
        "use strict";
        this._pixel = Field.units2pixel(this._unit);
    }

    /**
     * Aktualisiert units von pixel ausgehend
     */
    refreshFromPixels() {
        "use strict";
        this._unit = Field.pixel2units(this._pixel);
    }

    /**
     *
     * @param Coord
     */
    static cartesianToPolar(Coord) {
        "use strict";
        return Math.atan2(Coord.unit.x, Coord.unit.y)

    }

    /**
     * Rechnet Polarkoordinate in kartesiche um
     * @param {number} speed
     * @param {number} moveTo in rad
     * @returns {Coord}
     */
    static polarToCartesian(speed, moveTo) {
        "use strict";

        //Polarkoordinaten-Konversion
        let x = Math.cos(moveTo) * speed;
        let y = Math.sin(moveTo) * speed;
        // runden
        x = Math.round(x * 100) / 100;
        y = Math.round(y * 100) / 100;

        return new Coord(x, y)
    }

    /**
     * Grad in rad
     */
    static deg2rad(deg) {
        "use strict";
        return deg * (Math.PI / 180)


    }

    /**
     * rad in Grad
     */
    static rad2deg(rad) {
        "use strict";
        return rad * (180 / Math.PI)
    }
}
module.exports = Coord;