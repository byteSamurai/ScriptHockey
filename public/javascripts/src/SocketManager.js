/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 20:03
 */

let singleton = Symbol();
let singletonEnforcer = Symbol();
let Field = require("./Field");

class SocketManager {
    constructor(enforcer) {
        "use strict";
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }
        this._onGameStart = null;
        this._onGameStop = null;
        this._onGoal = null;
        this._onDisconnected = null;
        this._onGameOver = null;
        this._socket = io.connect();

        this._socket.on("disconnect", ()=> {
            this._onDisconnected();
        });

        //Startgame
        this._socket.on("game:start", (res)=> {
            console.info("game:start");
            $(".modal").closeModal();

            //Hinweis über Spielfeldhälfte
            var modalController = require("./modalController");
            var position = res.playerPos == "top" ? "oben" : "unten";
            modalController.noticeMsg("Du spielst " + position);

            this._onGameStart(res.playerPos);
        });

        //Stopgame
        this._socket.on("game:stop", (res)=> {
            console.info("game:stop");
            var modalController = require("./modalController");
            modalController.enterName();

            if (res.msg !== undefined) {
                modalController.errorMsg(res.msg);
            }
            this._onGameStop();
        });

        var field = Field.instance;

        //Aktualisiere Spielfeld
        this._socket.on("game:refresh", (data)=> {
            //bewege feindlichen schläger
            this._enemybatter.coord.unit = data.enemyCoord;
            this._enemybatter.setPosition();
            //aktualisiere Puck
            field.puck.coord.unit
                = data.puck.coord;
            //aktualisiere spielfeld
            Field.instance.refresh();
        });
        // Bei Toor
        this._socket.on("game:goal", (data)=> {
            this._onGoal(data[0], data[1]);
        });

        // Bei Spielende
        this._socket.on("game:over", (data)=> {
            this._onGameOver(data);
        });
    }

    /**
     * Wenn Spiel vorbei ist
     * @param func
     */
    set onGameOver(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._onGameOver = func;
    }

    /**
     * Funktion die Verbindungsverlust behandelt
     * @param func
     */
    set onDisconnect(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._onDisconnected = func;
    }

    /**
     * Funktion um Dashboard zu aktuslisieren
     * @param func
     */
    set onGoal(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._onGoal = func;
    }

    /**
     * Setzt die Start-Funktion um das Spiel zu beginnen
     * @param func
     */
    set onGameStart(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._onGameStart = func;
    }

    /**
     * Setzt die Stop-Funktion um das Spiel zu stoppen
     * @param func
     */
    set onGameStop(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._onGameStop = func;
    }

    set registerEnemyBatter(batter) {
        "use strict";
        this._enemybatter = batter;
    }

    /**
     * Spielfeld sollte nur eine Instanz sein
     * @returns {*}
     */
    static get instance() {
        if (this[singleton] === undefined) {
            this[singleton] = new SocketManager(singletonEnforcer);
        }
        return this[singleton];
    }

    /**
     * Neuen Spieler am Server anmelden
     * @param playername
     * @param {Function} cb
     */
    newPlayer(playername, cb) {
        "use strict";
        this._socket.emit("player:new", {name: playername}, (res)=> {
            console.info(res.status);
            cb(res)
        });
    }

    /**
     * Erzeugt neue SPiel-Instanz
     * @param cb
     */
    playerAmount(cb) {
        "use strict";
        this._socket.emit("player:amount", {}, (res)=> {
            console.info(res.status);
            cb(res);
        });
    }

    /**
     *  Sendet Batter-Position an den Server
     */
    sendBatterPosition(coord) {
        "use strict";
        this._socket.emit("player:IMoved", {coord: coord.unit});
    }

}
module.exports = SocketManager;