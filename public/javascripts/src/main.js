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
    puck.coord = new Coord(Field.unitWidth / 2 - Puck.radius, Field.unitHeight / 2);
    //StartSpeed
    puck.speed = 0;
    puck.moveTo = Coord.deg2rad(45); // nach links bitte


    let playerTop = new Batter(Batter.position.TOP);
    let playerBottom = new Batter(Batter.position.BOTTOM);
    let gloalTop = new Goal(Goal.position.TOP);
    let goalBottom = new Goal(Goal.position.BOTTOM);

    //Startcoords
    playerTop.coord = new Coord(Field.unitWidth / 2 - Batter.radius, Field.unitHeight / 4);
    playerBottom.coord = new Coord(Field.unitWidth / 2 - Batter.radius, 3 * (Field.unitHeight / 4));
    gloalTop.coord = new Coord((Field.unitWidth / 4) * 1.5, 0 - (gloalTop.size.unit.y / 2));
    goalBottom.coord = new Coord((Field.unitWidth / 4) * 1.5, Field.unitHeight - (goalBottom.size.unit.y / 2));

    // Deploy game objects and start
    field.deployGameObject(gloalTop);
    field.deployGameObject(goalBottom);
    //field.deployGameObject(playerTop);
    field.deployGameObject(playerBottom);
    field.deployGameObject(puck);
    field.build();
    field.play();

    $(window).on("game:goal", (event, data)=> {
        "use strict";
        console.log("TOOOR", data);
        field.reset();
        field.play();
    });

    //Shadow-Animation
    //$(window).on("game:tick", ()=> {
    //    $.fn.realshadow.reset();
    //    console.log(puck.coord.pixel.x + field.html.offset().left );
    //    $('.batters').realshadow({
    //        pageX: puck.coord.pixel.x + field.html.offset().left + field.html.width()/2,
    //        pageY: puck.coord.pixel.y,
    //        color: "41,255,242",    // shadow color, rgb 0..255, default: '0,0,0'
    //        type: 'drop' // shadow type
    //    });
    //});
    
    $(document).ready(function() {
        $('#modal_start').openModal();
        $('.modal-trigger').leanModal();
    });
});



