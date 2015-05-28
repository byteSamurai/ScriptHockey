//Not used anymore
//require("./__techdemo");


var Field = require("./Field");
var Puck = require("./Puck");
var Coord = require("./Coord");


$(function () {
    //Zeichne Spielfeld

    let field = Field.instance;
    let puck = new Puck();

    puck.coord = new Coord(150, 150);
    puck.speed = 5;
    puck.moveTo = 45; // nach rechts bitte

    field.deployGameObject(puck);
    field.build();
    field.play();

});



