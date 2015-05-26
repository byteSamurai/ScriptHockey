//Not used anymore
//require("./__techdemo");


function errorNotification(mess) {
    "use strict";

}


$(function () {
    //Zeichne Spielfeld
    var Field = require("./Field");
    var field = Field.instance;



    var Puck = require("./Puck");
    var puck = new Puck();

    field.deployGameObject(puck);
    field.build();
    field.play();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.unit={x:50,y:100};

    var dot=$("<span id=\"dot\">.</span>").css({
        position:"relative",
        top: coord.pixel.y,
        left: coord.pixel.x
    });


});



