/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

var Field = require("./Field.js");
class Coord {
    constructor() {
        "use strict";
        this._pixel = {x: 0, y: 0};
        this._unit = {x: 0, y: 0}
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
        this._pixel=xyObject;
        this._unit=Field.pixel2units(this._pixel);
    }
    /**
     * Liefert Pixel-Kompontente der Koordinate
     * @returns {{x:number,y:number}}
     */
    get pixel(){
        "use strict";
        this._pixel=Field.units2pixel(this._unit);
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
        this._unit=xyObject;
        this._pixel=Field.units2pixel(this._unit);
    }

    /**
     * Liefert Darstellungeinheit der Koordinate
     * @returns {{x:number,y:number}}
     */
    get unit(){
        "use strict";
        this._unit=Field.pixel2units(this._pixel);
        return this._unit;
    }
}
module.exports=Coord;