//Not used anymore
//require("./__techdemo");


function errorNotification(mess) {
    "use strict";

}


$(function () {
    //Zeichne Spielfeld
    var Field = require("./Field");
    var field = Field.instance.build();

    var Puck = require("./Puck");
    var puck = new Puck();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.setUnits(50, 100);

    console.log(coord.getPixel());

    var dot=$("<span id=\"dot\">.</span>").css({
        position:"relative",
        top: coord.getPixel().y,
        left: coord.getPixel().x
    });


});



