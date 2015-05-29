/**
 * Created by Marko Grgic on 28.05.2015.
 */
var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var Puck = require("./Puck");


class Goal extends GameObject {
    constructor(facing) {
        "use strict";
        super("goal-" + facing, $('<span class="goals"/>'), Field.unitWidth / 4, Field.unitHeight / 20);
        this._facing = facing;

        $(window).on("resize", ()=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });
        }).trigger("resize");
    }

    static get position() {
        "use strict";
        return {
            TOP: "top",
            BOTTOM: "bottom"
        }
    }

    get width() {
        "use strict";

    }

    get height() {
        "use strict";

    }

}

module.exports = Goal;