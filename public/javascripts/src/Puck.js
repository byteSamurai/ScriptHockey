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
        super("Puck", $("<b id=\"puck\" />"));

        this._puckSize = new Coord(PUCK_RADIUS_UNITS*2,PUCK_RADIUS_UNITS*2);

        super.html.css({
            width: this._puckSize.pixel.x,
            height: this._puckSize.pixel.y
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
    get puckSize(){
        "use strict";
        return this._puckSize;
    }

}
module.exports = Puck;