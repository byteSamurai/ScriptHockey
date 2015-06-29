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
var PARAMS = require("./../../../gameParams")();

$(function () {

    //Zeichne Spielfeld
    let field = Field.instance;
    let socketManager = SocketManager.instance;
    let puck = new Puck();
    let dashboard = new Dashboard();

    //Startcoords
    puck.coord.unit = PARAMS.puck.defaultCoord;
    puck.speed = PARAMS.puck.defaultSpeed;
    puck.moveTo = PARAMS.puck.defaultMoveTo;

    let goalTop = new Goal(Goal.position.TOP);
    let goalBottom = new Goal(Goal.position.BOTTOM);

    modalController.setupModals();
    //Öffne Modalfenster für Namenswahl
    modalController.enterName();

    // Deploy game objects and start
    field.deployGameObject(goalTop);
    field.deployGameObject(goalBottom);
    dashboard.build();

    /**
     * Startet neues Spiel
     * @param {"top"|"bottom"} facing Spielfeldhälfte
     */
    socketManager.onGameStart = (facing)=> {
        "use strict";
        let ownPosition, ownStartPosition, enemyPosition, enemyStartPosition;

        if (facing == "top") {
            field.ownPosition = "top";
            ownPosition = Batter.position.TOP;
            ownStartPosition = Batter.position.STARTPOS_TOP();
            enemyPosition = Batter.position.BOTTOM;
            enemyStartPosition = Batter.position.STARTPOS_BOTTOM();
        } else {
            ownPosition = Batter.position.BOTTOM;
            ownStartPosition = Batter.position.STARTPOS_BOTTOM();
            enemyPosition = Batter.position.TOP;
            enemyStartPosition = Batter.position.STARTPOS_TOP();
        }

        let playerBatter = new Batter(ownPosition, true);
        playerBatter.coord = ownStartPosition;
        playerBatter.setPosition();

        let enemyBatter = new Batter(enemyPosition, false);
        enemyBatter.coord = enemyStartPosition;
        enemyBatter.setPosition();

        socketManager.registerEnemyBatter = enemyBatter;

        field.deployGameObject(playerBatter, false);
        field.deployGameObject(enemyBatter, false);
        field.deployGameObject(puck, false);
        field.build();
    };
    /**
     * Stoppt Spiel
     */
    socketManager.onGameStop = ()=> {
        field.stop();
    };
    /**
     * Bei Tor
     */
    socketManager.onGoal = (player1Data, player2Data)=> {
        if (player1Data.goals > 0 || player2Data.goals > 0) {
            modalController.goalMsg("TOOOOOOOR!!!");
        }
        Dashboard.update(player1Data, player2Data);
    };
    /**
     * Bei Spielende
     */
    socketManager.onGameOver = (data)=> {
        "use strict";
        modalController.highscoreModal(data.isWinner, data.highscores)
    };
    /**
     * Bei Verbindungsverlust
     */
    socketManager.onDisconnect = ()=> {
        "use strict";
        modalController.errorMsg("Verbindung zum Server verloren. Bitte Browser aktualisieren!", true)
        location.reload(true); // nicht aus dem Cache
    };

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



