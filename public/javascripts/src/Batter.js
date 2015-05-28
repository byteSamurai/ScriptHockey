/**
 * Created by Marko Grgic on 28.05.2015.
 */

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
const BATTER_RADIUS_UNITS = 32;

class Batter extends GameObject {
    constructor(name, facing) {
        "use strict";
        super(name, $('<b id="batter_' + name + '" class="batters"/>'), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);
        this._facing = facing;
        this.pixeledRadius = Field.units2pixel(BATTER_RADIUS_UNITS);


        $(window).on("resize", ()=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });
        }).trigger("resize");
    }

    get baseType() {
        "use strict";
        super.type;
    }

    /**
     * Liefert die Puck-größe
     * @returns {Coord}
     */
    get size() {
        "use strict";
        return super.size;
    }

    refreshPosition(event) {
        "use strict";
        let fieldLeftOffset = Field.instance.html.offset().left;
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let xCoord = 0;
        let yCoord = 0;
        let field = Field.instance;

        if (mouseX - this.pixeledRadius <= fieldLeftOffset) { //left overflow
            xCoord = 0;
        } else if (mouseX >= (field.width + fieldLeftOffset - this.pixeledRadius)) { //right overflow
            xCoord = Field.unitWidth - (BATTER_RADIUS_UNITS * 2);
        } else { //in field
            xCoord = Field.pixel2units(mouseX - fieldLeftOffset) - BATTER_RADIUS_UNITS;
        }


        let mouseYunits = Field.pixel2units(mouseY);
        yCoord = mouseYunits - BATTER_RADIUS_UNITS;

        if (this._facing == 'bottom') {

            if (mouseYunits <= (Field.unitHeight / 2 ) + BATTER_RADIUS_UNITS) { //Oberkante-Feldmitte
                yCoord = Field.unitHeight / 2;
            } else if (mouseYunits > Field.unitHeight - BATTER_RADIUS_UNITS) {
                yCoord = Field.unitHeight - BATTER_RADIUS_UNITS * 2;
            }
        }

        if (this._facing == 'top') {
            if (mouseY >= (field.height / 2 - this.pixeledRadius)) { //Unterkante-Feldmitte
                yCoord = Field.pixel2units(field.height / 2 - this.pixeledRadius) - BATTER_RADIUS_UNITS;
            } else if (mouseY < BATTER_RADIUS_UNITS / 2) {
                yCoord = 0;
            }
        }


        //console.log(mouseX + ', ' + field.html.css('left'));

        this.coord.unit = {x: xCoord, y: yCoord};
        this.setPosition()

    }
}

module.exports = Batter;

