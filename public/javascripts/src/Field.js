/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666;
const DEBOUNCE_DELAY_MS=150;
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

        this.name = "Field";
        this.height = 0;
        this.width = 0;
        this.fieldHTML = null;

        var fieldRef = this;
        $(window).resize(
            $.debounce(DEBOUNCE_DELAY_MS, function () {
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
     * Entfernt alles Spielfeld
     * @param fieldRef
     * @returns {*}
     * @private
     */
    static _removeFromDom(fieldRef) {
        "use strict";
        if (fieldRef.fieldHTML !== null) {
            $("#" + fieldRef.name.toLowerCase()).remove();
        }
        return fieldRef;
    }

    /**
     * Fügt neues Spielfeld ein
     * @param fieldRef
     * @private
     */
    static _dropAtDom(fieldRef) {
        "use strict";
        $("body").append(fieldRef.fieldHTML);
    }

    /**
     * Wandel Darstellungseinheiten in Pixel um
     * @param {{x: number, y: number}} unit
     * @returns {{x: number, y: number}}
     */
    static units2Pixel(unit){
        "use strict";
        if(typeof unit !== "object" || isNaN(unit.x) || isNaN(unit.x)){
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }

        return {x:0,y:0};
    }

    static pixel2units(pixel){
        "use strict";

    }
    /**
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        var fieldRef = this;

        $.get("/" + this.name.toLowerCase())
            .then((response)=>{
                var jqResponse=$(response);
                jqResponse.css({
                    height: fieldRef.height,
                    width: fieldRef.width,
                    marginLeft: fieldRef.width * -.5 //4 center-alignment
                });
                fieldRef.fieldHTML =jqResponse;

                return fieldRef;

            },()=>{
                throw new Error("Could not get field from server")
            })
            .then(Field._removeFromDom,null)
            .then(Field._dropAtDom,null);
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