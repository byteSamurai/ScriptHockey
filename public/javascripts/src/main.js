//Not used anymore
//require("./__techdemo");


function errorNotification(mess) {
    "use strict";

}


$(function () {
    //Zeichne Spielfeld
    var Field = require("./Field");
    var field = new Field().build();

    var Puck = require("./Puck");
    var puck = new Puck();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.setPixel(50, 50);

    console.log(coord.getUnits());


});



