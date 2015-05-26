/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:26
 */

var GameObject = require("./GameObject");
const velocity = -0.5; //ggf. später austauschen gegen Funktion f(t)

class Puck extends GameObject {

    constructor() {
        "use strict";
        super("Puck");

        this._puckHTML = $("<b id=\"puck\" />");

    }

    get BaseType() {
        "use strict";
        super.type;
    }

    calcPosition() {
        "use strict";
        super.calcPosition();
        this._puckHTML.css({
            top: super.coord.pixel.y,
            left: super.coord.pixel.x

        })
    }
    get html(){
        "use strict";
        return this._puckHTML;
    }
}
module.exports = Puck;