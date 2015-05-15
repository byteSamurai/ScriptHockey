/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */
const RATIO = 0.666;
const DEBOUNCE_DELAY_MS=150;

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
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        var fieldRef = this;

        $.get("/" + this.name.toLowerCase())
            .then(function (response) {
                fieldRef.fieldHTML = $(response).css({
                    height: fieldRef.height,
                    width: fieldRef.width,
                    marginLeft: fieldRef.width * -.5 //4 center-alignment
                });
                return fieldRef
            })
            .then(Field._removeFromDom)
            .then(Field._dropAtDom);
    }
}
module.exports = Field;