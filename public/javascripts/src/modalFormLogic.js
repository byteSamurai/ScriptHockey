/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
var SocketManager = require("./SocketManager");

var modalFormLogic = {
    startup: ()=> {
        "use strict";

        $('#enterName_Modal').openModal({
            ready: ()=> {
                "use strict";
                $('#player_name').focus();
            },
            dismissible: false
        });


        $("#submit_player_name_form").on("click", (e)=> {
            e.preventDefault();
            $("#player_name_form").submit();
        });


        $("#player_name_form").on("submit", (e)=> {
            e.preventDefault();
            let playerName = $("#player_name");
            if (playerName.val().length < 1) {
                Materialize.toast('Bitte geben Sie einen Namen ein!', 4000, "red darken-3");
                playerName.addClass("invalid")
            } else {
                SocketManager.instance.newPlayer(playerName.val(), (res)=> {

                    if (res.status === "player:nameTaken") {
                        Materialize.toast(res.msg, 4000, "red darken-3");
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