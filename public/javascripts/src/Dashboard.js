/**
 * Created by Marko Grgic on 01.06.2015.
 */
var Coord = require("./Coord");
var Field = require("./Field");

class Dashboard {
    constructor() {
        "use strict";
        this._coord = new Coord();
        this._size = new Coord(Field.unitWidth / 4, Field.unitWidth / 4);
        //Konkreter Instanz-Name
        this._ID = "dashboard";
        this._html = $('<div id="dashboard">' +
            '<h4>SCORE</h4>' +
            '<p id="result">0:0</p>' +
            '<p id="score">0:0</p>' +
            '</div>');

    }

    build() {
        "use strict";
        $('body').append(this._html);
    }

    get html() {
        "use strict";
        return this._html;
    }

    static update(player1Data, player2Data) {
        "use strict";
        $("#result").text(player1Data.goals + ":" + player2Data.goals);
        $("#score").text(player1Data.score + ":" + player2Data.score);
    }

}

module.exports = Dashboard;