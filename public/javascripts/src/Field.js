/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666666;
const DEBOUNCE_DELAY_MS = 50;
const VERT_UNITS = 1000;
const HORZ_UNITS = VERT_UNITS * RATIO;

let singleton = Symbol();
let singletonEnforcer = Symbol();

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */
class Field {
    constructor(enforcer) {
        "use strict";
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this.gameObjects = new Map();
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
     * Spielfeld sollte nur eine Instanz sein
     * @returns {*}
     */
    static get instance() {
        if (this[singleton] === undefined) {
            this[singleton] = new Field(singletonEnforcer);
        }
        return this[singleton];
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
    static units2pixel(unit) {
        "use strict";
        if (typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x)) {
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }
        let field = Field.instance;
        let vertUnitRatio = unit.y / VERT_UNITS;
        let horUnitRatio = unit.x / HORZ_UNITS;

        return {
            x: field.getWidth() * horUnitRatio,
            y: field.getHeight() * vertUnitRatio
        };
    }

    /**
     * Wandelt Piel in Darstellungseinheiten um
     * @param {{x: number, y: number}} pixel
     * @returns {{x: number, y: number}}
     */
    static pixel2units(pixel) {
        "use strict";
        if (typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x)) {
            throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
        }
        let field = Field.instance;
        let heightRatio = pixel.y / field.getHeight();
        let widthRatio = pixel.x / field.getWidth();

        return {
            x: widthRatio * HORZ_UNITS,
            y: heightRatio * VERT_UNITS
        };
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
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
     * Fügt neue Spielelemente hinzu
     * @param gameObject
     */
    deployGameObject(gameObject) {
        "use strict";
        if (typeof gameObject !== "GameObject") {
            throw new Error("Must be a gameobject");
        }
        this.gameObjects.add();
    }
}
module.exports = Field;