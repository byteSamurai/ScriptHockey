/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
var SocketManager = require("./SocketManager");
var Params = require("./../../../gameParams")();

var modalController = {
    goalMsg:(msg)=>{
        "use strict";
        Materialize.toast(msg, Params.timeoutAfterGoal*2, "goal blue darken-2 white-tex");
    },
    noticeMsg: (msg)=> {
        "use strict";
        Materialize.toast(msg, 4000, "blue darken-2");
    },
    errorMsg: (msg, persistent = false)=> {
        "use strict";
        Materialize.toast(msg, persistent ? 1000 * 365 * 3600 : 4000, "red darken-3");
    },
    /**
     * Bindet notwendige Events für Namenseingabevalidierung
     */
    setupModals: ()=> {
        "use strict";
        $("#submit_player_name_form").on("click", (e)=> {
            e.preventDefault();
            $("#player_name_form").submit();
        });

        $("#player_name_form").on("submit", (e)=> {
            e.preventDefault();
            let playerName = $("#player_name");
            if (playerName.val().length < 1) {
                modalController.errorMsg('Bitte geben Sie einen Namen ein!');
                playerName.addClass("invalid")
            } else {
                SocketManager.instance.newPlayer(playerName.val(), (res)=> {

                    switch (res.status) {
                        case "player:nameTaken":
                            modalController.errorMsg(res.msg);
                            playerName.addClass("invalid");
                            break;
                        case "player:full":
                            modalController.serverFullModal();
                            break;
                        case "player:nameok":
                            modalController.checkPlayerAmount(true);
                    }
                });
            }
        });
    },
    /**
     * Modal-Fenster, das Namenswahl durchführt
     */
    enterName: ()=> {
        "use strict";

        $('#enterName_Modal').openModal({
            ready: ()=> {
                "use strict";
                $('#player_name').focus();
            },
            dismissible: false
        });

    },
    /**
     * Prüfe Server-Befüllung
     * @param check4waiting
     */
    checkPlayerAmount: (check4waiting = false)=> {
        "use strict";
        SocketManager.instance.playerAmount((res)=> {
            if (check4waiting && res.status === "player:waiting") {
                modalController.waitingModal();
                return;
            }
            if (res.status === "player:full") {
                modalController.serverFullModal();
            }
        });
    },
    /**
     * Nachricht: Warte auf 2. Spieler
     */
    waitingModal: ()=> {
        "use strict";

        $("#waiting_Modal").openModal({
            dismissible: false
        });
    },
    /**
     * Nachricht: Server voll
     */
    serverFullModal: ()=> {
        "use strict";
        $("#serverFull_Modal").openModal({
            dismissible: false
        });
    },
    /**
     * Nachricht: Highscore + Wer hat geonnen
     */
    highscoreModal: (hasWon, highscores)=> {
        "use strict";
        $("#highscore-Lose-smiley").hide();
        $("#highscore-Win-smiley").hide();

        $("#highscore_Modal").openModal({
            dismissible: false,
            ready: ()=> {
                $("#highscore-WinLose-message").html(hasWon ?  "Du hast gewonnen!" : "Du hast verloren!");
                if(hasWon){
                    $("#highscore-Win-smiley").show();
                }
                else{
                    $("#highscore-Lose-smiley").show();
                }
                $("#highscores").html("");
                highscores.forEach((e)=> {
                    $("#highscores").append("<tr><td>" + e.userName + "</td><td>" + e.score + "</td></tr>")
                })
            }
        });
    }
};

module.exports = modalController;