/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
var SocketManager = require("./SocketManager");

var modalFormLogic = {
    noticeMsg: (msg)=> {
        "use strict";
        Materialize.toast(msg, 4000, "blue darken-2");
    },
    errorMsg: (msg)=> {
        "use strict";
        Materialize.toast(msg, 4000, "red darken-3");
    },
    /**
     * Bindet notwendige Events für Namenseingabevalidierung
     */
    setupEnterNameModal: ()=> {
        "use strict";
        $("#submit_player_name_form").on("click", (e)=> {
            e.preventDefault();
            $("#player_name_form").submit();
        });

        $("#player_name_form").on("submit", (e)=> {
            e.preventDefault();
            let playerName = $("#player_name");
            if (playerName.val().length < 1) {
                modalFormLogic.errorMsg('Bitte geben Sie einen Namen ein!');
                playerName.addClass("invalid")
            } else {
                SocketManager.instance.newPlayer(playerName.val(), (res)=> {

                    if (res.status === "player:nameTaken") {
                        modalFormLogic.errorMsg(res.msg);
                        playerName.addClass("invalid");
                    }

                    if (res.status === "player:ok") {

                        //$("#enterName_Modal").closeModal();
                        modalFormLogic.checkPlayerAmount(true);
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
                $("#waiting_Modal").openModal({
                    dismissible: false
                });
                return;
            }
            if (res.status === "player:full") {
                $("#serverFull_Modal").openModal({
                    dismissible: false
                });
                return;
            }
        });
    }
};

module.exports = modalFormLogic;