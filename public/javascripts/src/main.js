//Not used anymore
//require("./__techdemo");


var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");


$(function () {


    //Zeichne Spielfeld
    let field = Field.instance;
    let puck = new Puck();

    //Startcoords
    puck.coord = new Coord(80, 80);
    puck.speed = 15;
    puck.moveTo = 45; // nach links bitte


    var player1 = new Batter('player1', 'top');
    var player2 = new Batter('player2', 'bottom');
    //Startcoords
    player1.coord = new Coord(Field.unitWidth / 2, Field.unitHeight / 4);
    player2.coord = new Coord(Field.unitWidth / 2, 3 * (Field.unitHeight / 4));
    field.deployGameObject(player1);
    field.deployGameObject(player2);
    field.deployGameObject(puck);
    field.build();
    field.play();

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

    $(document).ready(function() {
        $('#modal_start').openModal();
        $('.modal-trigger').leanModal();
    });
});



