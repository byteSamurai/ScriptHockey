/**
 * Created by Marko Grgic on 28.05.2015.
 */
var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var Puck = require("./Puck");


class Goal extends GameObject {
    constructor(name, facing) {
        "use strict";
        super(name, $('<span id="goal_' + name + '" class="goals"/>'), Field.unitWidth / 4, Field.unitHeight / 20);
        this._facing = facing;

        $(window).on("resize", ()=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });
        }).trigger("resize");
    }

    get Width() {
        "use strict";

    }

    get Height() {
        "use strict";

    }

}

module.exports = Goal;