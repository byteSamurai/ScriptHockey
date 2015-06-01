/**
 * Created by Marko Grgic on 01.06.2015.
 */

var GameObject = require("./GameObject");
var Field = require("./Field");
class Dashboard extends GameObject {
    constructor() {
        "use strict";

        super("dashboard",
            $('<div id="dashboard">' +
                '<span>' +
                '<p id="result">Spielstand: 0:0</p></span>' +
                '<span><p>Punktestand:</p>' +
                '<p id="score1">Spieler #1: 0</p>' +
                '<p id="score2">Spieler #2: 0</p>' +
                '</span> ' +
                '</div>'),
            Field.unitWidth / 4,
            Field.unitHeight / 4);

        $(window).on("resize", ()=> {
            super.size.refreshFromUnits();

            super.html.css({
                width: super.size.pixel.x,
                height: super.size.pixel.y
            });

            this.calcPosition();
        }).trigger("resize");
    }

    get width() {
        "use strict";
        return super.size.unit.x
    }

    get height() {
        "use strict";
        return super.size.unit.y;
    }

    update(result, score1, score2){
        "use strict";
        $("#result").text("Spielstand: " + result);
        $("#score1").text("Spieler #1: " + score1);
        $("#score2").text("Spieler #2: " + score2);
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

module.exports = Dashboard;