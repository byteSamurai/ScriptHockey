/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
module.exports = ()=> {
    "use strict";

    $('#enterName_Modal').openModal({
        ready: ()=> {
            "use strict";
            $('#player_name').focus();
        }
    });
    $("#submit_player_name_form").on("click", ()=> {
        $("#player_name_form").submit();
    });

    $("#player_name_form").on("submit", (e)=> {
        e.preventDefault();
        let playerName = $("#player_name");
        if (playerName.val().length < 1) {
            Materialize.toast('Bitte geben Sie einen Namen ein!', 4000, "red darken-3")
            playerName.addClass("invalid")
        } else {

        }
    });
};