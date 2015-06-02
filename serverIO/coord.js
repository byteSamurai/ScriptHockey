/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 17:45
 */

var coord = {
    /**
     * Konvertiert kartesische Koordinaten zu Polarkoordinaten
     * @param {number} x
     * @param {number} y
     * @link http://www.w3schools.com/jsref/jsref_atan2.asp
     */
    cartesianToPolar: function (x, y) {

        if (x == 0 && y == 0) { // Vektor ohne Betrag!!!
            return {
                angle: 0,
                distance: 0
            }
        }

        var angle = Math.atan2(y, x);
        angle = angle < 0 ? angle + Math.PI * 2 : angle;

        var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return {
            angle: angle,
            distance: distance
        }

    },

    /**
     * Rechnet Polarkoordinate in kartesiche um
     * @param {number} distance
     * @param {number} moveTo in rad
     * @returns {{x:number,y:number}}
     */
    polarToCartesian: function (distance, moveTo) {
        "use strict";

        //Polarkoordinaten-Konversion
        var x = Math.cos(moveTo) * distance;
        var y = Math.sin(moveTo) * distance;
        // runden
        x = Math.round(x * 100) / 100;
        y = Math.round(y * 100) / 100;

        return {x: x, y: y};
    },

    /**
     * Grad in rad
     */
    deg2rad: function (deg) {
        "use strict";
        return deg * (Math.PI / 180)
    },

    /**
     * rad in Grad
     */
    rad2deg: function (rad) {
        "use strict";
        return rad * (180 / Math.PI)

    }
};
module.exports = coord;

