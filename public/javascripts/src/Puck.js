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
        super("puck", $("<b />"), PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);

        $(window).on("resize", ()=> {

            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });
        }).trigger("resize");

    }

    /**
     * Liefert die Puck-größe
     * @returns {Coord}
     */
    get size() {
        "use strict";
        return super.size;
    }

    /**
     * Liefert Puck-Radius in units
     * @returns {number}
     */
    static get radius() {
        "use strict";
        return PUCK_RADIUS_UNITS;
    }

    /**
     * Liefert Mittelpunkt-Koordinaten
     * @returns {Coord}
     */
    get centerCoord() {
        "use strict";
        return super.coord.clone().add(
            new Coord(PUCK_RADIUS_UNITS, PUCK_RADIUS_UNITS)
        )
    }

    /**
     * Setzt Koordinaten ausgehend vom Mittelpunkt der Figur
     * @param {Coord} centerCoord
     */
    set centerCoord(centerCoord) {
        "use strict";
        this._coord = centerCoord.sub(
            new Coord(PUCK_RADIUS_UNITS, PUCK_RADIUS_UNITS)
        )
    }

    /**
     * Setzt Puck auf Position
     */
    setPosition() {
        "use strict";
        super.setPosition()
    }

    /**
     * Berechnet Position uns setzt Object anschließend an Position
     */
    calcPosition() {
        "use strict";
        super.calcPosition();
        this.setPosition();
    }
}
module.exports = Puck;