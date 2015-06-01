//Not used anymore
//require("./__techdemo");


var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");
var Dashboard = require("./Dashboard");
var SocketManager = require("./SocketManager");
var Goal = require("./Goal");
var modalController = require("./modalController");

$(function () {

    //Zeichne Spielfeld
    let field = Field.instance;
    let puck = new Puck();
    let dashboard = new Dashboard();


    //Startcoords
    puck.coord = new Coord(Field.unitWidth / 2 - Puck.radius, Field.unitHeight / 2);
    dashboard.coord = new Coord(0, 0);
    //StartSpeed
    puck.speed = 0;
    puck.moveTo = 0;

    let goalTop = new Goal(Goal.position.TOP);
    let goalBottom = new Goal(Goal.position.BOTTOM);

    //Startcoords
    goalTop.coord = new Coord((Field.unitWidth / 4) * 1.5, 0 - (goalTop.size.unit.y / 2));
    goalBottom.coord = new Coord((Field.unitWidth / 4) * 1.5, Field.unitHeight - (goalBottom.size.unit.y / 2));
    //Prüfe ob server platz hat
    modalController.checkPlayerAmount();
    //Öffne Modalfenster für Namenswahl
    modalController.setupEnterNameModal();
    modalController.enterName();

    let playerBatter = new Batter(Batter.position.TOP);
    let enemyBatter = new Batter(Batter.position.BOTTOM);
    playerBatter.coord = new Coord(Field.unitWidth / 2 - Batter.radius, Field.unitHeight / 4);
    enemyBatter.coord = new Coord(Field.unitWidth / 2 - Batter.radius, 3 * (Field.unitHeight / 4));

    //SocketManager.instance.registerEnemyBatter=playerTop;

    SocketManager.instance.startgameCallback = (facing)=> {
        "use strict";

        let field = Field.instance;
        // Deploy game objects and start
        field.deployGameObject(goalTop);
        field.deployGameObject(goalBottom);
        //field.deployGameObject(playerTop);
        field.deployGameObject(enemyBatter);
        field.deployGameObject(puck);
        field.deployGameObject(dashboard);
        field.build();
        field.play();
    };

    SocketManager.instance.stopgameCallback = ()=> {
        "use strict";
        Field.instance.stop();
    };

    $(window).on("game:goal", (event, data)=> {
        "use strict";
        console.log("TOOOR", data);
        dashboard.update("1:0", data.score, 0);
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

});



