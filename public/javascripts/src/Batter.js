/**
 * Created by Marko Grgic on 28.05.2015.
 */

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
const BATTER_RADIUS_UNITS = 32;

class Batter extends GameObject {
    constructor(facing) {
        "use strict";

        super("batter-" + facing, $('<b class="batters"/>'), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);

        this._facing = facing;
        this.pixeledRadius = Field.units2pixel(BATTER_RADIUS_UNITS);


        $(window).on("resize", (e)=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });

            this.calcPosition(e);
        }).trigger("resize");

        //on Mousemove, Position neu berechnen
        $(document).on("mousemove", $.throttle(Field.refreshRate, (e)=> {
            this.calcPosition(e);
        }));
    }

    static get position() {
        "use strict";
        return {
            TOP: "top",
            BOTTOM: "bottom"
        }
    }

    /**
     * Liefert Radius in Units
     * @returns {number}
     */
    static get radius() {
        "use strict";
        return BATTER_RADIUS_UNITS
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
     * Liefert Mittelpunkt-Koordinaten
     * @returns {Coord}
     */
    get centerCoord() {
        "use strict";
        return super.coord.clone().add(
            new Coord(BATTER_RADIUS_UNITS, BATTER_RADIUS_UNITS)
        )
    }

    /**
     * Liefert nächste Position
     * @param event
     * @returns {{x: number, y: number}}
     */
    getNextPosition(event) {
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
            } else if (mouseY < this.pixeledRadius) {
                yCoord = 0;
            }
        }

        return {x: xCoord, y: yCoord};
    }

    /**
     * Berechnet Position
     */
    calcPosition(e) {
        "use strict";
        if ((typeof e != "undefined") && (e.type == "mousemove")) { //can only retrieve mouse pos if mouse was moved
            let oldPos = this.coord.unit;
            this.coord.unit = this.getNextPosition(e);
            let xDist = this.coord.unit.x - oldPos.x;
            let yDist = this.coord.unit.y - oldPos.y;
            let polarCoord = Coord.cartesianToPolar(xDist, yDist);
            this.speed = polarCoord.distance;
            this.moveTo = polarCoord.angle;
        }
        this.setPosition();
    }

    setPosition() {
        "use strict";
        if (this.speed > 0) {
            var SocketManager = require("./SocketManager");
            SocketManager.instance.sendBatterPosition(this.coord);
            super.setPosition();
        }
    }

}

module.exports = Batter;

