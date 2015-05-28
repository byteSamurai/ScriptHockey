//Not used anymore
require("./__techdemo");


var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");


$(function () {
    //Zeichne Spielfeld
    let field = Field.instance;
    let puck = new Puck();

    puck.coord = new Coord(0, 80);
    puck.speed = 5;
    puck.moveTo = 45; // nach links bitte

    //var player1 = new Batter('player1', 'top');
    var player2 = new Batter('player2', 'bottom');
    //player1.coord = new Coord(field._width/2,field._height/4);
    player2.coord = new Coord(field._width/2,3*(field._height/4));

    field.deployGameObject(puck);
    //field.deployGameObject(player1);
    field.deployGameObject(player2);
    field.build();
    //field.play();

    $(document).on("mousemove", $.throttle( 0, function (event) {
        player2.refreshPosition(event);
    }));
});



