/**
 * Created by Marko Grgic on 28.05.2015.
 */
var GameObject = require("./GameObject");

var PARAMS = require("./../../../gameParams")();

const GOAL_HEIGHT = PARAMS.goal.height;
const GOAL_WIDTH = PARAMS.goal.width;

class Goal extends GameObject {
    constructor(facing) {
        "use strict";
        if (facing != Goal.position.TOP && facing != Goal.position.BOTTOM) {
            throw new Error("Invalid Goal Facing")
        }

        super("goal-" + facing, $('<span class="goals"/>'), GOAL_WIDTH, GOAL_HEIGHT);
        this._facing = facing;

        if (facing === Goal.position.TOP) {
            this.coord.unit = PARAMS.goal.positionTop;
        } else {
            this.coord.unit = PARAMS.goal.positionBottom;
        }

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