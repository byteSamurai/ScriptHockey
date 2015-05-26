/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

const RATIO = 0.666666;
const REFRESH_RATE_MS = 200;
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

        this._gameObjects = new Map();
        this._name = "Field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");

        var fieldRef = this;
        $(window).resize(
            $.throttle(REFRESH_RATE_MS, function () {
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
        this._height = $("body").height();
        this._width = this._height * RATIO;
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
            x: field.width * horUnitRatio,
            y: field.height * vertUnitRatio
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
        let heightRatio = pixel.y / field.height;
        let widthRatio = pixel.x / field.width;

        return {
            x: widthRatio * HORZ_UNITS,
            y: heightRatio * VERT_UNITS
        };
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    /**
     * Platziert das Feld im Browser
     */
    build() {
        "use strict";
        this._calcRatioSize();
        //Entferne altes Spielfeld
        if (this._fieldHTML !== null) {
            $("#" + this._name.toLowerCase()).remove();
        }

        $("body").append(this._fieldHTML);
        this._fieldHTML.css({
            height: this._height,
            width: this._width,
            marginLeft: this._width * -.5 //4 center-alignment
        });

        this._gameObjects.forEach((e)=>{
            console.log(e);
            $("#field").append(e.html);
        });
    }

    /**
     * Zeichnet alle Gameobjects ein
     */
    play(){
        "use strict";
        window.setInterval(()=>{
            this._gameObjects.forEach((e,i)=>{
                e.calcPosition();
                console.log(e.coord.unit);
            });
        },REFRESH_RATE_MS);

    }

    /**
     * Fügt neue Spielelemente hinzu
     * @param gameObject
     */
    deployGameObject(gameObject) {
        "use strict";
        if (gameObject.type !== "GameObject") {
            throw new Error("Must be a gameobject");
        }
        gameObject.calcPosition();
        this._gameObjects.set(gameObject.name,gameObject);
    }
}
module.exports = Field;