/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 20:03
 */

let singleton = Symbol();
let singletonEnforcer = Symbol();

class SocketManager {
    constructor(enforcer) {
        "use strict";
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }
        this._startCB = null;
        this._stopCB = null;
        this._socket = io.connect();

        //Startgame
        this._socket.on("game:start", (res)=> {
            console.info("game:start");
            $(".modal").closeModal();

            //Hinweis über Spielfeldhälfte
            var modalController = require("./modalController");
            var position = res.playerPos == "top" ? "oben" : "unten";
            modalController.noticeMsg("Du spielst " + position);

            this._startCB(res.playerPos);
        });

        //Stopgame
        this._socket.on("game:stop", (res)=> {
            console.info("game:stop");
            var modalController = require("./modalController");
            modalController.enterName();

            if (res.msg !== undefined) {
                modalController.errorMsg(res.msg);
            }

            this._stopCB();
        });

        //Send Batter-Positions
        this._socket.on("player:enemyMoved", (data)=> {

            this._enemybatter.coord.unit = data.coord;
            this._enemybatter.setPosition(true);
            //console.log(data);
        })
    }

    /**
     * Setzt die Start-Funktion um das Spiel zu beginnen
     * @param func
     */
    set startgameCallback(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._startCB = func;
    }

    /**
     * Setzt die Stop-Funktion um das Spiel zu stoppen
     * @param func
     */
    set stopgameCallback(func) {
        "use strict";
        if (typeof func !== "function") {
            throw new Error("Musst be a Function-referenz")
        }
        this._stopCB = func;
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