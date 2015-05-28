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
        super(name, $("<b id=\"batter_" + name + "\" />"), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);
        this._facing = facing;
        this.pixeledRadius = Field.units2pixel({x: BATTER_RADIUS_UNITS, y: 1}).x;

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
        console.log(fieldLeftOffset);
        xCoord = mouseX;
        yCoord = mouseY;

        if (mouseX - this.pixeledRadius <= fieldLeftOffset) { //left overflow
            xCoord = 0;
        } else if(mouseX >= (Field.instance._width + fieldLeftOffset - this.pixeledRadius)) { //right overflow
            let coordDump = {
                x: Field.instance._width,
                y: mouseY
            };
            xCoord = Field.pixel2units(coordDump).x - (BATTER_RADIUS_UNITS * 2);
        } else { //in field
            let coordDump = {
                x: mouseX - fieldLeftOffset,
                y: mouseY
            };
            xCoord = Field.pixel2units(coordDump).x - BATTER_RADIUS_UNITS;
        }

        if (this._facing == 'bottom') {
            if (mouseY <= (Field.instance._height / 2 - this.pixeledRadius)) {
                yCoord = Field.instance._height / 2;
                console.log(this._facing);
            } else {
                let coordDump = {
                    x: mouseX - fieldLeftOffset,
                    y: mouseY
                };
                yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
            }
        }

        if (this._facing == 'top') {
            if (mouseY >= (Field.instance._height / 2 - this.pixeledRadius)) {
                let coordDump = {
                    x: mouseX - fieldLeftOffset,
                    y: Field.instance._height / 2 - this.pixeledRadius
                };
                yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
            } else {
                let coordDump = {
                    x: mouseX - fieldLeftOffset,
                    y: mouseY
                };
                yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
            }
        }


        console.log(mouseX + ', ' + Field.instance.html.css('left'));


        this.coord.unit = {x: xCoord, y: yCoord};
        this.setPosition()

    }
}

module.exports = Batter;

