/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

var Field = require("./Field.js");
class Coord {
    constructor() {
        "use strict";
        this.px = {x: 0, y: 0};
        this.units = {x: 0, y: 0}
    }

    setPixel(x, y) {
        "use strict";
        this.px.x = x;
        this.px.y = y;
        this.units=Field.pixel2units(this.px);
    }

    setUnits(x, y) {
        "use strict";
        this.units.x = x;
        this.units.y = y;
    }
}