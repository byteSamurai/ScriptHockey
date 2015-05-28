/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:26
 */

var GameObject = require("./GameObject");
var Coord = require("./Coord");
const VELOCITY = -0.5; //ggf. später austauschen gegen Funktion f(t)
const PUCK_RADIUS_UNITS = 16;

class Puck extends GameObject {

    constructor() {
        "use strict";
        super("Puck", $("<b id=\"puck\" />"), PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);




        super.html.css({
            width: super.size.pixel.x,
            height: super.size.pixel.y
        });
    }

    get baseType() {
        "use strict";
        super.type;
    }

    /**
     * Setzt Puck auf Position
     */
    setPosition() {
        "use strict";
        super.setPosition()
    }

    /**
     * Berechnet Position, ohne sie zu setzen
     */
    calcPosition() {
        "use strict";
        super.calcPosition();
        this.setPosition();
    }

    /**
     * Liefert die Puck-größe
     * @returns {Coord}
     */
    get size() {
        "use strict";
        return super.size;
    }


}
module.exports = Puck;