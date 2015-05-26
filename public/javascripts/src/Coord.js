/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

var Field = require("./Field.js");
class Coord {
    constructor() {
        "use strict";
        this.pixel = {x: 0, y: 0};
        this.units = {x: 0, y: 0}
    }

    /**
     * Setzt Pixel
     * @param {Number} x
     * @param {Number} y
     */
    setPixel(x, y) {
        "use strict";
        this.pixel.x = x;
        this.pixel.y = y;
        this.units=Field.pixel2units(this.pixel);
    }

    /**
     * Setzt Darstellungseinheiten
     * @param {Number} x
     * @param {Number} y
     */
    setUnits(x, y) {
        "use strict";
        this.units.x = x;
        this.units.y = y;
        this.pixel=Field.units2pixel(this.units);
    }

    /**
     * Liefert Pixel-Kompontente der Koordinate
     * @returns {Coord.pixel}
     */
    getPixel(){
        "use strict";
        this.pixel=Field.units2pixel(this.units);
        return this.pixel;
    }

    /**
     * Liefert Darstellungeinheit der Koordinate
     * @returns {Coord.units|*}
     */
    getUnits(){
        "use strict";
        this.units=Field.pixel2units(this.pixel);
        return this.units;
    }
}
module.exports=Coord;