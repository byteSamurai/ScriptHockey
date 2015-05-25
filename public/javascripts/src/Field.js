/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666;
const DEBOUNCE_DELAY_MS=50;
const VERT_UNITS=1000;
const HORZ_UNITS=VERT_UNITS*RATIO;


/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */
class Field {
    constructor() {
        "use strict";
        this.fieldObjects=new Map();
        this.name = "Field";
        this.height = 0;
        this.width = 0;
        this.fieldHTML = $("<section id=\"field\">");

        var fieldRef = this;
        $(window).resize(
            $.throttle(DEBOUNCE_DELAY_MS, function () {
                fieldRef.build();
            })
        );
        this._calcRatioSize();
    }

    /**
     * Berechnet die Breite des Feldes
     * @private
     */
    _calcRatioSize() {
        "use strict";
        this.height = $("body").height();
        this.width = this.height * RATIO;
    }


    /**
     * Wandel Darstellungseinheiten in Pixel um
     * @param {{x: number, y: number}} unit
     * @returns {{x: number, y: number}}
     */
    static units2Pixel(unit){
        "use strict";
        if(typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x)){
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }

        return {x:0,y:0};
    }

    /**
     * Wandelt Piel in Darstellungseinheiten um
     * @param {{x: number, y: number}} pixel
     * @returns {{x: number, y: number}}
     */
    static pixel2units(pixel){
        "use strict";
        if(typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x)){
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }
        return {x:0,y:0};
    }
    /**
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        //Entferne altes Spielfeld
        if (this.fieldHTML !== null) {
            $("#" + this.name.toLowerCase()).remove();
        }

        $("body").append(this.fieldHTML);
        this.fieldHTML.css({
            height: this.height,
            width: this.width,
            marginLeft: this.width * -.5 //4 center-alignment
        });
    }

    /**
     *
     * @returns {number}
     */
    getFieldHeight(){
        "use strict";
        return this.height;
    }
}
module.exports = Field;