//Not used anymore
//require("./__techdemo");


var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");
var Goal = require("./Goal");

$(function () {


    //Zeichne Spielfeld
    let field = Field.instance;
    let puck = new Puck();

    //Startcoords
    puck.coord = new Coord(80, 80);
    puck.speed = 15;
    puck.moveTo = 45; // nach links bitte


    let player1 = new Batter('player1', 'top');
    let player2 = new Batter('player2', 'bottom');
    let goal1 = new Goal('goal1', 'top');
    let goal2 = new Goal('goal2', 'bottom');

    //Startcoords
    player1.coord = new Coord(Field.unitWidth / 2, Field.unitHeight / 4);
    player2.coord = new Coord(Field.unitWidth / 2, 3 * (Field.unitHeight / 4));
    goal1.coord = new Coord((Field.unitWidth / 4) * 1.5, 0 - (goal1.size.unit.y / 2));
    goal2.coord = new Coord((Field.unitWidth / 4) * 1.5, Field.unitHeight - (goal2.size.unit.y / 2));
    console.log(goal2.size.unit.y);

    // Deploy game objects and start
    field.deployGameObject(goal1);
    field.deployGameObject(goal2);
    field.deployGameObject(player1);
    field.deployGameObject(player2);
    field.deployGameObject(puck);
    field.build();
    //field.play();

    $(document).on("mousemove", $.throttle(0, function (event) {
        player1.refreshPosition(event);
        player2.refreshPosition(event);
    }));

    //Shadow-Animation
    $(window).on("game:tick", ()=> {
        $.fn.realshadow.reset();
        $('.batters').realshadow({
            pageX: puck.coord.pixel.x + field.html.offset().left,
            pageY: puck.coord.pixel.y,
            color: "41,255,242",    // shadow color, rgb 0..255, default: '0,0,0'
            type: 'drop' // shadow type
        });
    });
});



