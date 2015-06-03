var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(__dirname + "/highscores.db");

module.exports = {
    add: function (name, score, callback) {
        "use strict";

        //entferne Älteste Einträge
        var removeLatestQuery = "delete from userScores where time not in (SELECT time FROM userScores ORDER BY time DESC LIMIT 9);"
        db.run(removeLatestQuery, function (err) {
            if (err !== null) {
                throw new Error(err.message);
            }
            //Füge neue ein
            var inserQuery = "insert into userScores Values (CURRENT_TIMESTAMP,?,?)";
            db.run(
                inserQuery,
                [name, score],
                function () {
                    //Rufe alle ab
                    var query = "Select userName, score from userScores order by score DESC limit 10";
                    db.all(query, callback);
                }
            );

        });
    }
};
