(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

var Field = require("./Field.js");
var UNITS = "u";
var PIXEL = "px";

var Coord = (function () {
    /**
     *
     * @param x
     * @param y
     * @param {UNITS | PIXEL} type
     * @returns {{x: number, y: number}|*}
     */

    function Coord() {
        "use strict";
        var x = arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments[1] === undefined ? 0 : arguments[1];
        var type = arguments[2] === undefined ? UNITS : arguments[2];

        _classCallCheck(this, Coord);

        this._type = "Coord";
        this._pixel = { x: 0, y: 0 };
        this._unit = { x: 0, y: 0 };

        if (type === UNITS) {
            this.unit = { x: x, y: y };
            this._pixel = Field.units2pixel(this._unit);
        } else {
            this.pixel = { x: x, y: y };
            this._unit = Field.pixel2units(this._pixel);
        }
    }

    _createClass(Coord, [{
        key: "type",
        get: function () {
            "use strict";
            return this._type;
        }
    }, {
        key: "multiply",

        /**
         * Multipliziert Koordinaten
         * @param coord
         */
        value: function multiply(coord) {
            "use strict";
            this._unit = {
                x: this.unit.x * coord.unit.x,
                y: this.unit.y * coord.unit.y
            };
            this._pixel = Field.units2pixel(this._unit);
            return this;
        }
    }, {
        key: "divide",

        /**
         * Dividierts Koordinaten durch
         * @param coord teiler
         */
        value: function divide(coord) {
            "use strict";
            this._unit = {
                x: this.unit.x / coord.unit.x,
                y: this.unit.y / coord.unit.y
            };
            this._pixel = Field.units2pixel(this._unit);
            return this;
        }
    }, {
        key: "add",

        /**
         * Addiert Koordinaten
         * @param coord Koordinate, die addiert werden soll
         */
        value: function add(coord) {
            "use strict";
            this._unit = {
                x: this.unit.x + coord.unit.x,
                y: this.unit.y + coord.unit.y
            };
            this._pixel = Field.units2pixel(this._unit);
            return this;
        }
    }, {
        key: "sub",

        /**
         * Substrahiert Koordinaten
         * @param coord
         */
        value: function sub(coord) {
            "use strict";
            this._unit = {
                x: this.unit.x - coord.unit.x,
                y: this.unit.y - coord.unit.y
            };
            this._pixel = Field.units2pixel(this._unit);
            return this;
        }
    }, {
        key: "pixel",

        /**
         * Setzt Pixel
         * @param {{x:number,y:number}} xyObject
         */
        set: function (xyObject) {
            "use strict";
            if (typeof xyObject !== "object" || isNaN(xyObject.y) || isNaN(xyObject.x)) {
                throw new Error("pixel must be an object with a x and y component");
            }
            this._pixel = xyObject;
            this._unit = Field.pixel2units(this._pixel);
        },

        /**
         * Liefert Pixel-Kompontente der Koordinate
         * @returns {{x:number,y:number}}
         */
        get: function () {
            "use strict";
            return this._pixel;
        }
    }, {
        key: "unit",

        /**
         * Setzt Darstellungseinheiten
         * @param {{x:number,y:number}} xyObject
         */
        set: function (xyObject) {
            "use strict";
            if (typeof xyObject !== "object" || isNaN(xyObject.y) || isNaN(xyObject.x)) {
                throw new Error("unit must be an object with a x and y component");
            }
            this._unit = xyObject;
            this._pixel = Field.units2pixel(this._unit);
        },

        /**
         * Liefert Darstellungeinheit der Koordinate
         * @returns {{x:number,y:number}}
         */
        get: function () {
            "use strict";
            return this._unit;
        }
    }]);

    return Coord;
})();

module.exports = Coord;

},{"./Field.js":2}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

var RATIO = 0.666666;
var REFRESH_RATE_MS = 1000;
var VERT_UNITS = 1000;
var HORZ_UNITS = VERT_UNITS * RATIO;

var singleton = Symbol();
var singletonEnforcer = Symbol();

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */

var Field = (function () {
    function Field(enforcer) {
        var _this = this;

        "use strict";

        _classCallCheck(this, Field);

        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this._gameObjects = new Map();
        this._name = "Field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");

        this._calcRatioSize();

        $(window).resize($.throttle(REFRESH_RATE_MS, function () {
            _this.build();
        }));
    }

    _createClass(Field, [{
        key: "_calcRatioSize",

        /**
         * Berechnet die Breite des Feldes
         * @private
         */
        value: function _calcRatioSize() {
            "use strict";
            this._height = $("body").height();
            this._width = this._height * RATIO;
        }
    }, {
        key: "width",
        get: function () {
            return this._width;
        }
    }, {
        key: "height",
        get: function () {
            return this._height;
        }
    }, {
        key: "build",

        /**
         * Platziert das Feld im Browser
         */
        value: function build() {
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
                marginLeft: this._width * -0.5 //4 center-alignment
            });

            this._gameObjects.forEach(function (e) {
                $("#field").append(e.html);
            });
        }
    }, {
        key: "play",

        /**
         * Zeichnet alle Gameobjects ein
         */
        value: function play() {
            var _this2 = this;

            "use strict";
            window.setInterval(function () {
                _this2._gameObjects.forEach(function (e) {
                    e.calcPosition();
                });
                _this2.solveCollisions();
            }, REFRESH_RATE_MS);
        }
    }, {
        key: "deployGameObject",

        /**
         * Fügt neue Spielelemente hinzu
         * @param gameObject
         */
        value: function deployGameObject(gameObject) {
            "use strict";
            if (gameObject.type !== "GameObject") {
                throw new Error("Must be a gameobject");
            }
            gameObject.setPosition();
            this._gameObjects.set(gameObject.name, gameObject);
        }
    }, {
        key: "solveCollisions",

        /**
         * Löst kollisionen auf
         */
        value: function solveCollisions() {
            var Coord = require("./Coord");
            this._gameObjects.forEach(function (e) {
                //Überlauf rechts
                if (e.coord.unit.x + e.puckSize.unit.x > HORZ_UNITS) {
                    e.moveTo.multiply(new Coord(-1, 0));
                } else if (e.coord.unit.x < 0) {
                    e.moveTo.multiply(new Coord(-1, 0));
                }
            });
        }
    }], [{
        key: "instance",

        /**
         * Spielfeld sollte nur eine Instanz sein
         * @returns {*}
         */
        get: function () {
            if (this[singleton] === undefined) {
                this[singleton] = new Field(singletonEnforcer);
            }
            return this[singleton];
        }
    }, {
        key: "units2pixel",

        /**
         * Wandel Darstellungseinheiten in Pixel um
         * @param {{x: number, y: number}} unit
         * @returns {{x: number, y: number}}
         */
        value: function units2pixel(unit) {
            "use strict";
            if (typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x)) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }
            var field = Field.instance;
            var vertUnitRatio = unit.y / VERT_UNITS;
            var horUnitRatio = unit.x / HORZ_UNITS;

            return {
                x: field.width * horUnitRatio,
                y: field.height * vertUnitRatio
            };
        }
    }, {
        key: "pixel2units",

        /**
         * Wandelt Piel in Darstellungseinheiten um
         * @param {{x: number, y: number}} pixel
         * @returns {{x: number, y: number}}
         */
        value: function pixel2units(pixel) {
            "use strict";
            if (typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x)) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }
            var field = Field.instance;
            var heightRatio = pixel.y / field.height;
            var widthRatio = pixel.x / field.width;

            return {
                x: widthRatio * HORZ_UNITS,
                y: heightRatio * VERT_UNITS
            };
        }
    }]);

    return Field;
})();

module.exports = Field;

},{"./Coord":1}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Coord = require("./Coord");

var GameObject = (function () {
    function GameObject(name, html) {
        "use strict";

        _classCallCheck(this, GameObject);

        this._coord = new Coord();
        this._name = name;
        this._type = "GameObject";
        this._html = html;
        this._moveTo = new Coord();
    }

    _createClass(GameObject, [{
        key: "type",
        get: function () {
            "use strict";
            return this._type;
        }
    }, {
        key: "moveTo",
        get: function () {
            "use strict";
            return this._moveTo;
        },
        set: function (coords) {
            "use strict";
            if (coords.type !== "Coord") {
                throw new Error("Must be a Coord");
            }

            this._moveTo = coords;
        }
    }, {
        key: "setPosition",
        value: function setPosition() {
            "use strict";
            this._html.css({
                top: this._coord.pixel.y,
                left: this._coord.pixel.x
            });
        }
    }, {
        key: "calcPosition",
        value: function calcPosition() {
            "use strict";
            this.coord.add(this._moveTo);
        }
    }, {
        key: "name",
        get: function () {
            "use strict";
            return this._name;
        }
    }, {
        key: "coord",
        get: function () {
            "use strict";

            return this._coord;
        },
        set: function (coord) {
            "use strict";
            this._coord = coord;
        }
    }, {
        key: "html",
        get: function () {
            "use strict";
            return this._html;
        }
    }]);

    return GameObject;
})();

module.exports = GameObject;

},{"./Coord":1}],4:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:26
 */

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var VELOCITY = -0.5; //ggf. später austauschen gegen Funktion f(t)
var PUCK_RADIUS_UNITS = 16;

var Puck = (function (_GameObject) {
    function Puck() {
        "use strict";

        _classCallCheck(this, Puck);

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this, "Puck", $("<b id=\"puck\" />"));

        this._puckSize = new Coord(PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);

        _get(Object.getPrototypeOf(Puck.prototype), "html", this).css({
            width: this._puckSize.pixel.x,
            height: this._puckSize.pixel.y
        });
    }

    _inherits(Puck, _GameObject);

    _createClass(Puck, [{
        key: "baseType",
        get: function () {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "type", this);
        }
    }, {
        key: "setPosition",

        /**
         * Setzt Puck auf Position
         */
        value: function setPosition() {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "setPosition", this).call(this);
        }
    }, {
        key: "calcPosition",

        /**
         * Berechnet Position, ohne sie zu setzen
         */
        value: function calcPosition() {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "calcPosition", this).call(this);
            this.setPosition();
        }
    }, {
        key: "puckSize",

        /**
         * Liefert die Puck-größe
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return this._puckSize;
        }
    }]);

    return Puck;
})(GameObject);

module.exports = Puck;

},{"./Coord":1,"./GameObject":3}],5:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

function errorNotification(mess) {
    "use strict";
}

var Field = require("./Field");
var Puck = require("./Puck");
var Coord = require("./Coord");

$(function () {
    //Zeichne Spielfeld

    var field = Field.instance;
    var puck = new Puck();
    var startPuckCoord = new Coord(0, 80);

    var moveToCoord = new Coord(100, 0);
    puck.coord = startPuckCoord;
    puck.moveTo = moveToCoord;

    field.deployGameObject(puck);
    field.build();
    field.play();
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBQ2IsS0FBSzs7Ozs7Ozs7O0FBUUksYUFSVCxLQUFLLEdBUWlDO0FBQ3BDLG9CQUFZLENBQUM7WUFETCxDQUFDLGdDQUFHLENBQUM7WUFBRSxDQUFDLGdDQUFHLENBQUM7WUFBRSxJQUFJLGdDQUFHLEtBQUs7OzhCQVJwQyxLQUFLOztBQVVILFlBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7O0FBRzFCLFlBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUNoQixnQkFBSSxDQUFDLElBQUksR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQ3pCLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DLE1BQU07QUFDSCxnQkFBSSxDQUFDLEtBQUssR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7O2lCQXRCQyxLQUFLOzthQXdCQyxZQUFHO0FBQ1Asd0JBQVksQ0FBQztBQUNiLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7Ozs7Ozs7O2VBTU8sa0JBQUMsS0FBSyxFQUFFO0FBQ1osd0JBQVksQ0FBQztBQUNiLGdCQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1QsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsQ0FBQztBQUNGLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLElBQUksQ0FBQTtTQUNkOzs7Ozs7OztlQU1LLGdCQUFDLEtBQUssRUFBRTtBQUNWLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7YUFN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SUFBSSxDQUFDLENBQUM7QUFDN0IsU0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2QsU0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0NBRWhCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcbiAqIERhdGU6IDE1LjA1LjIwMTVcbiAqIFRpbWU6IDE1OjUzXG4gKi9cblxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGQuanNcIik7XG5jb25zdCBVTklUUyA9IFwidVwiO1xuY29uc3QgUElYRUwgPSBcInB4XCI7XG5jbGFzcyBDb29yZCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0geFxuICAgICAqIEBwYXJhbSB5XG4gICAgICogQHBhcmFtIHtVTklUUyB8IFBJWEVMfSB0eXBlXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn18Kn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHR5cGUgPSBVTklUUykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiQ29vcmRcIjtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSB7eDogMCwgeTogMH07XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7eDogMCwgeTogMH07XG5cblxuICAgICAgICBpZiAodHlwZSA9PT0gVU5JVFMpIHtcbiAgICAgICAgICAgIHRoaXMudW5pdCA9IHt4OiB4LCB5OiB5fTtcbiAgICAgICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBpeGVsID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgdGhpcy5fdW5pdCA9IEZpZWxkLnBpeGVsMnVuaXRzKHRoaXMuX3BpeGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGl6aWVydCBLb29yZGluYXRlblxuICAgICAqIEBwYXJhbSBjb29yZFxuICAgICAqL1xuICAgIG11bHRpcGx5KGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggKiBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAqIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkaWVydHMgS29vcmRpbmF0ZW4gZHVyY2hcbiAgICAgKiBAcGFyYW0gY29vcmQgdGVpbGVyXG4gICAgICovXG4gICAgZGl2aWRlKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggLyBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAvIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZGllcnQgS29vcmRpbmF0ZW5cbiAgICAgKiBAcGFyYW0gY29vcmQgS29vcmRpbmF0ZSwgZGllIGFkZGllcnQgd2VyZGVuIHNvbGxcbiAgICAgKi9cbiAgICBhZGQoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCArIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICsgY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic3RyYWhpZXJ0IEtvb3JkaW5hdGVuXG4gICAgICogQHBhcmFtIGNvb3JkXG4gICAgICovXG4gICAgc3ViKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggLSBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAtIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IFBpeGVsXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSB4eU9iamVjdFxuICAgICAqL1xuICAgIHNldCBwaXhlbCh4eU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGl4ZWwgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBhIHggYW5kIHkgY29tcG9uZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BpeGVsID0geHlPYmplY3Q7XG4gICAgICAgIHRoaXMuX3VuaXQgPSBGaWVsZC5waXhlbDJ1bml0cyh0aGlzLl9waXhlbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBQaXhlbC1Lb21wb250ZW50ZSBkZXIgS29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHt7eDpudW1iZXIseTpudW1iZXJ9fVxuICAgICAqL1xuICAgIGdldCBwaXhlbCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9waXhlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW5cbiAgICAgKiBAcGFyYW0ge3t4Om51bWJlcix5Om51bWJlcn19IHh5T2JqZWN0XG4gICAgICovXG4gICAgc2V0IHVuaXQoeHlPYmplY3QpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgeHlPYmplY3QgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4oeHlPYmplY3QueSkgfHwgaXNOYU4oeHlPYmplY3QueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBhIHggYW5kIHkgY29tcG9uZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VuaXQgPSB4eU9iamVjdDtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaWVmZXJ0IERhcnN0ZWxsdW5nZWluaGVpdCBkZXIgS29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHt7eDpudW1iZXIseTpudW1iZXJ9fVxuICAgICAqL1xuICAgIGdldCB1bml0KCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VuaXQ7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBDb29yZDsiLCIvKipcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcbiAqIERhdGU6IDE0LjA1LjIwMTVcbiAqIFRpbWU6IDE4OjA4XG4gKi9cblxuY29uc3QgUkFUSU8gPSAwLjY2NjY2NjtcbmNvbnN0IFJFRlJFU0hfUkFURV9NUyA9IDEwMDA7XG5jb25zdCBWRVJUX1VOSVRTID0gMTAwMDtcbmNvbnN0IEhPUlpfVU5JVFMgPSBWRVJUX1VOSVRTICogUkFUSU87XG5cbmxldCBzaW5nbGV0b24gPSBTeW1ib2woKTtcbmxldCBzaW5nbGV0b25FbmZvcmNlciA9IFN5bWJvbCgpO1xuXG4vKipcbiAqIFNwaWVsZmVsZFxuICogU2VpdGVuIG3DvHNzZW4gaW0gVmVyaMOkbHRuaXMgMzoyIGFuZ2VsZWd0IHdlcmRlblxuICogQGxpbms6IGh0dHA6Ly90dXJmLm1pc3NvdXJpLmVkdS9zdGF0L2ltYWdlcy9maWVsZC9kaW1ob2NrZXkuZ2lmXG4gKlxuICovXG5jbGFzcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoZW5mb3JjZXIpIHtcblxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGVuZm9yY2VyICE9IHNpbmdsZXRvbkVuZm9yY2VyKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbm5vdCBjb25zdHJ1Y3Qgc2luZ2xldG9uXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiRmllbGRcIjtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5fd2lkdGggPSAwO1xuICAgICAgICB0aGlzLl9maWVsZEhUTUwgPSAkKFwiPHNlY3Rpb24gaWQ9XFxcImZpZWxkXFxcIj5cIik7XG5cbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuXG4gICAgICAgICQod2luZG93KS5yZXNpemUoXG4gICAgICAgICAgICAkLnRocm90dGxlKFJFRlJFU0hfUkFURV9NUywgKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGllbGZlbGQgc29sbHRlIG51ciBlaW5lIEluc3Rhbnogc2VpblxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICh0aGlzW3NpbmdsZXRvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpc1tzaW5nbGV0b25dID0gbmV3IEZpZWxkKHNpbmdsZXRvbkVuZm9yY2VyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1tzaW5nbGV0b25dO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJlcmVjaG5ldCBkaWUgQnJlaXRlIGRlcyBGZWxkZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jYWxjUmF0aW9TaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gJChcImJvZHlcIikuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gdGhpcy5faGVpZ2h0ICogUkFUSU87XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBXYW5kZWwgRGFyc3RlbGx1bmdzZWluaGVpdGVuIGluIFBpeGVsIHVtXG4gICAgICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSB1bml0XG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19XG4gICAgICovXG4gICAgc3RhdGljIHVuaXRzMnBpeGVsKHVuaXQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih1bml0LnkpIHx8IGlzTmFOKHVuaXQueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcbiAgICAgICAgbGV0IHZlcnRVbml0UmF0aW8gPSB1bml0LnkgLyBWRVJUX1VOSVRTO1xuICAgICAgICBsZXQgaG9yVW5pdFJhdGlvID0gdW5pdC54IC8gSE9SWl9VTklUUztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZmllbGQud2lkdGggKiBob3JVbml0UmF0aW8sXG4gICAgICAgICAgICB5OiBmaWVsZC5oZWlnaHQgKiB2ZXJ0VW5pdFJhdGlvXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2FuZGVsdCBQaWVsIGluIERhcnN0ZWxsdW5nc2VpbmhlaXRlbiB1bVxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gcGl4ZWxcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGl4ZWwydW5pdHMocGl4ZWwpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgcGl4ZWwgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4ocGl4ZWwueSkgfHwgaXNOYU4ocGl4ZWwueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcbiAgICAgICAgbGV0IGhlaWdodFJhdGlvID0gcGl4ZWwueSAvIGZpZWxkLmhlaWdodDtcbiAgICAgICAgbGV0IHdpZHRoUmF0aW8gPSBwaXhlbC54IC8gZmllbGQud2lkdGg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHdpZHRoUmF0aW8gKiBIT1JaX1VOSVRTLFxuICAgICAgICAgICAgeTogaGVpZ2h0UmF0aW8gKiBWRVJUX1VOSVRTXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxuICAgICAqL1xuICAgIGJ1aWxkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgICAgICAvL0VudGZlcm5lIGFsdGVzIFNwaWVsZmVsZFxuICAgICAgICBpZiAodGhpcy5fZmllbGRIVE1MICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fbmFtZS50b0xvd2VyQ2FzZSgpKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLl9maWVsZEhUTUwpO1xuICAgICAgICB0aGlzLl9maWVsZEhUTUwuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5faGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuX3dpZHRoLFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy5fd2lkdGggKiAtLjUgLy80IGNlbnRlci1hbGlnbm1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICAkKFwiI2ZpZWxkXCIpLmFwcGVuZChlLmh0bWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBaZWljaG5ldCBhbGxlIEdhbWVvYmplY3RzIGVpblxuICAgICAqL1xuICAgIHBsYXkoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgICAgICBlLmNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNvbHZlQ29sbGlzaW9ucygpO1xuICAgICAgICB9LCBSRUZSRVNIX1JBVEVfTVMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEbDvGd0IG5ldWUgU3BpZWxlbGVtZW50ZSBoaW56dVxuICAgICAqIEBwYXJhbSBnYW1lT2JqZWN0XG4gICAgICovXG4gICAgZGVwbG95R2FtZU9iamVjdChnYW1lT2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZ2FtZU9iamVjdC50eXBlICE9PSBcIkdhbWVPYmplY3RcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhIGdhbWVvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZU9iamVjdC5zZXRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5zZXQoZ2FtZU9iamVjdC5uYW1lLCBnYW1lT2JqZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMw7ZzdCBrb2xsaXNpb25lbiBhdWZcbiAgICAgKi9cbiAgICBzb2x2ZUNvbGxpc2lvbnMoKSB7XG4gICAgICAgIHZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgIC8vw5xiZXJsYXVmIHJlY2h0c1xuICAgICAgICAgICAgaWYgKGUuY29vcmQudW5pdC54ICsgZS5wdWNrU2l6ZS51bml0LnggPiBIT1JaX1VOSVRTKSB7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8ubXVsdGlwbHkobmV3IENvb3JkKC0xLDApKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKGUuY29vcmQudW5pdC54IDwgMCl7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8ubXVsdGlwbHkobmV3IENvb3JkKC0xLDApKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7IiwibGV0IENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XG5jbGFzcyBHYW1lT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBodG1sKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jb29yZCA9IG5ldyBDb29yZCgpO1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiR2FtZU9iamVjdFwiO1xuICAgICAgICB0aGlzLl9odG1sID0gaHRtbDtcbiAgICAgICAgdGhpcy5fbW92ZVRvID0gbmV3IENvb3JkKCk7XG5cbiAgICB9XG5cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cbiAgICBnZXQgbW92ZVRvKCl7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fbW92ZVRvO1xuICAgIH1cbiAgICBzZXQgbW92ZVRvKGNvb3Jkcykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGNvb3Jkcy50eXBlICE9PSBcIkNvb3JkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgYSBDb29yZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVUbyA9IGNvb3JkcztcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2h0bWwuY3NzKHtcbiAgICAgICAgICAgIHRvcDogdGhpcy5fY29vcmQucGl4ZWwueSxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuX2Nvb3JkLnBpeGVsLnhcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjYWxjUG9zaXRpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLmNvb3JkLmFkZCh0aGlzLl9tb3ZlVG8pO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGNvb3JkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY29vcmQ7XG4gICAgfVxuXG4gICAgc2V0IGNvb3JkKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jb29yZCA9IGNvb3JkO1xuICAgIH1cblxuICAgIGdldCBodG1sKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0bWw7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT2JqZWN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE1LjA1LjIwMTVcclxuICogVGltZTogMTU6MjZcclxuICovXHJcblxyXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5jb25zdCBWRUxPQ0lUWSA9IC0wLjU7IC8vZ2dmLiBzcMOkdGVyIGF1c3RhdXNjaGVuIGdlZ2VuIEZ1bmt0aW9uIGYodClcclxuY29uc3QgUFVDS19SQURJVVNfVU5JVFMgPSAxNjtcclxuXHJcbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlcihcIlB1Y2tcIiwgJChcIjxiIGlkPVxcXCJwdWNrXFxcIiAvPlwiKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3B1Y2tTaXplID0gbmV3IENvb3JkKFBVQ0tfUkFESVVTX1VOSVRTKjIsUFVDS19SQURJVVNfVU5JVFMqMik7XHJcblxyXG4gICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuX3B1Y2tTaXplLnBpeGVsLngsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5fcHVja1NpemUucGl4ZWwueVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBiYXNlVHlwZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlci50eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0enQgUHVjayBhdWYgUG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIuc2V0UG9zaXRpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmVyZWNobmV0IFBvc2l0aW9uLCBvaG5lIHNpZSB6dSBzZXR6ZW5cclxuICAgICAqL1xyXG4gICAgY2FsY1Bvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLmNhbGNQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgZGllIFB1Y2stZ3LDtsOfZVxyXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxyXG4gICAgICovXHJcbiAgICBnZXQgcHVja1NpemUoKXtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHVja1NpemU7XHJcbiAgICB9XHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKG1lc3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufVxyXG5cclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcblxyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvL1plaWNobmUgU3BpZWxmZWxkXHJcblxyXG4gICAgdmFyIGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XHJcbiAgICB2YXIgcHVjayA9IG5ldyBQdWNrKCk7XHJcbiAgICBsZXQgc3RhcnRQdWNrQ29vcmQgPSBuZXcgQ29vcmQoMCw4MCk7XHJcblxyXG4gICAgbGV0IG1vdmVUb0Nvb3JkID0gbmV3IENvb3JkKDEwMCwwKTtcclxuICAgIHB1Y2suY29vcmQgPSBzdGFydFB1Y2tDb29yZDtcclxuICAgIHB1Y2subW92ZVRvID0gbW92ZVRvQ29vcmQ7XHJcblxyXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwdWNrKTtcclxuICAgIGZpZWxkLmJ1aWxkKCk7XHJcbiAgICBmaWVsZC5wbGF5KCk7XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuIl19
