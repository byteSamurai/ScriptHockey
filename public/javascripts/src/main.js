//Not used anymore
//require("./__techdemo");


function errorNotification(mess) {
    "use strict";

}

var Field = require("./Field");
var Puck = require("./Puck");
var Coord = require("./Coord");


$(function () {
    //Zeichne Spielfeld

    var field = Field.instance;
    var puck = new Puck();
    let startPuckCoord = new Coord(0,80);

    let moveToCoord = new Coord(100,0);
    puck.coord = startPuckCoord;
    puck.moveTo = moveToCoord;

    field.deployGameObject(puck);
    field.build();
    field.play();

});



