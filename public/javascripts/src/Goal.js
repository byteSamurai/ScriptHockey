/**
 * Created by Marko Grgic on 28.05.2015.
 */
var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var Puck = require("./Puck");

const GOAL_HEIGHT = Field.unitHeight / 20;
const GOAL_WIDTH = Field.unitWidth / 4;


class Goal extends GameObject {
    constructor(facing) {
        "use strict";
        super("goal-" + facing, $('<span class="goals"/>'), GOAL_WIDTH, GOAL_HEIGHT);
        this._facing = facing;

        $(window).on("resize", ()=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });

            this.calcPosition();
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
        return super.size.unit.x
    }

    get height() {
        "use strict";
        return super.size.unit.y;
    }

    /**
     * Berechnet Position
     */
    calcPosition() {
        "use strict";
        super.calcPosition();
        this.setPosition();
    }

}

module.exports = Goal;