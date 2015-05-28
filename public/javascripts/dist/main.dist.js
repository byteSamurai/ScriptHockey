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
var COLLIDING_DETECTION_RATE = 10;
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
                    _this2.solveCollisions();
                });
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
                var ePos = e.coord.unit;
                var eSize = e.size.unit;

                console.log(e.coord.unit, e.size.unit, HORZ_UNITS);

                if (ePos.x + eSize.x > HORZ_UNITS) {
                    e.coord = new Coord(HORZ_UNITS - e.size.unit.x, e.coord.unit.y);
                    e.setPosition();
                    e.moveTo.multiply(new Coord(-1, 0));
                } else if (ePos.x < 0) {
                    e.moveTo.multiply(new Coord(-1, 0));
                    e.coord = new Coord(0, e.coord.unit.y);
                    e.setPosition();
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
    function GameObject(name, html, xSize, ySize) {
        "use strict";

        _classCallCheck(this, GameObject);

        this._coord = new Coord();
        this._size = new Coord(xSize, ySize);
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
        key: "size",
        get: function () {
            "use strict";
            return this._size;
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
            //coords.divide(new Coord(100,100));
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

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this, "Puck", $("<b id=\"puck\" />"), PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);

        _get(Object.getPrototypeOf(Puck.prototype), "html", this).css({
            width: _get(Object.getPrototypeOf(Puck.prototype), "size", this).pixel.x,
            height: _get(Object.getPrototypeOf(Puck.prototype), "size", this).pixel.y
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
        key: "size",

        /**
         * Liefert die Puck-größe
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Puck.prototype), "size", this);
        }
    }]);

    return Puck;
})(GameObject);

module.exports = Puck;

},{"./Coord":1,"./GameObject":3}],5:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

var Field = require("./Field");
var Puck = require("./Puck");
var Coord = require("./Coord");

$(function () {
    //Zeichne Spielfeld

    var field = Field.instance;
    var puck = new Puck();
    var startPuckCoord = new Coord(0, 80);

    var moveToCoord = new Coord(150, 0);
    puck.coord = startPuckCoord;
    puck.moveTo = moveToCoord;

    field.deployGameObject(puck);
    field.build();
    field.play();
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBQ2IsS0FBSzs7Ozs7Ozs7O0FBUUksYUFSVCxLQUFLLEdBUWlDO0FBQ3BDLG9CQUFZLENBQUM7WUFETCxDQUFDLGdDQUFHLENBQUM7WUFBRSxDQUFDLGdDQUFHLENBQUM7WUFBRSxJQUFJLGdDQUFHLEtBQUs7OzhCQVJwQyxLQUFLOztBQVVILFlBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7O0FBRTFCLFlBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUNoQixnQkFBSSxDQUFDLElBQUksR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQ3pCLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DLE1BQU07QUFDSCxnQkFBSSxDQUFDLEtBQUssR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7O2lCQXJCQyxLQUFLOzthQXVCQyxZQUFHO0FBQ1Asd0JBQVksQ0FBQztBQUNiLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7Ozs7Ozs7O2VBTU8sa0JBQUMsS0FBSyxFQUFFO0FBQ1osd0JBQVksQ0FBQztBQUNiLGdCQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1QsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsQ0FBQztBQUNGLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLElBQUksQ0FBQTtTQUNkOzs7Ozs7OztlQU1LLGdCQUFDLEtBQUssRUFBRTtBQUNWLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7YUFN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QUFVOztBQThDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7Ozs7O0FDckR0QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFHL0IsQ0FBQyxDQUFDLFlBQVk7OztBQUdWLFFBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDM0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN0QixRQUFJLGNBQWMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXJDLFFBQUksV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyxRQUFJLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztBQUM1QixRQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQzs7QUFFMUIsU0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFNBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNkLFNBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztDQUVoQixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XG4gKiBUaW1lOiAxNTo1M1xuICovXG5cbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkLmpzXCIpO1xuY29uc3QgVU5JVFMgPSBcInVcIjtcbmNvbnN0IFBJWEVMID0gXCJweFwiO1xuY2xhc3MgQ29vcmQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHhcbiAgICAgKiBAcGFyYW0geVxuICAgICAqIEBwYXJhbSB7VU5JVFMgfCBQSVhFTH0gdHlwZVxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fCp9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB0eXBlID0gVU5JVFMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBcIkNvb3JkXCI7XG4gICAgICAgIHRoaXMuX3BpeGVsID0ge3g6IDAsIHk6IDB9O1xuICAgICAgICB0aGlzLl91bml0ID0ge3g6IDAsIHk6IDB9O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBVTklUUykge1xuICAgICAgICAgICAgdGhpcy51bml0ID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGl4ZWwgPSB7eDogeCwgeTogeX07XG4gICAgICAgICAgICB0aGlzLl91bml0ID0gRmllbGQucGl4ZWwydW5pdHModGhpcy5fcGl4ZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaXppZXJ0IEtvb3JkaW5hdGVuXG4gICAgICogQHBhcmFtIGNvb3JkXG4gICAgICovXG4gICAgbXVsdGlwbHkoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAqIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICogY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGl2aWRpZXJ0cyBLb29yZGluYXRlbiBkdXJjaFxuICAgICAqIEBwYXJhbSBjb29yZCB0ZWlsZXJcbiAgICAgKi9cbiAgICBkaXZpZGUoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAvIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55IC8gY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkaWVydCBLb29yZGluYXRlblxuICAgICAqIEBwYXJhbSBjb29yZCBLb29yZGluYXRlLCBkaWUgYWRkaWVydCB3ZXJkZW4gc29sbFxuICAgICAqL1xuICAgIGFkZChjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54ICsgY29vcmQudW5pdC54LFxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgKyBjb29yZC51bml0LnlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzdHJhaGllcnQgS29vcmRpbmF0ZW5cbiAgICAgKiBAcGFyYW0gY29vcmRcbiAgICAgKi9cbiAgICBzdWIoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAtIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55IC0gY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgUGl4ZWxcbiAgICAgKiBAcGFyYW0ge3t4Om51bWJlcix5Om51bWJlcn19IHh5T2JqZWN0XG4gICAgICovXG4gICAgc2V0IHBpeGVsKHh5T2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwaXhlbCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGl4ZWwgPSB4eU9iamVjdDtcbiAgICAgICAgdGhpcy5fdW5pdCA9IEZpZWxkLnBpeGVsMnVuaXRzKHRoaXMuX3BpeGVsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaWVmZXJ0IFBpeGVsLUtvbXBvbnRlbnRlIGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IHBpeGVsKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpeGVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IERhcnN0ZWxsdW5nc2VpbmhlaXRlblxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcbiAgICAgKi9cbiAgICBzZXQgdW5pdCh4eU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5pdCA9IHh5T2JqZWN0O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgRGFyc3RlbGx1bmdlaW5oZWl0IGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IHVuaXQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdW5pdDtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IENvb3JkOyIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTQuMDUuMjAxNVxuICogVGltZTogMTg6MDhcbiAqL1xuXG5jb25zdCBSQVRJTyA9IDAuNjY2NjY2O1xuY29uc3QgUkVGUkVTSF9SQVRFX01TID0gMTAwMDtcbmNvbnN0IENPTExJRElOR19ERVRFQ1RJT05fUkFURSA9IDEwO1xuY29uc3QgVkVSVF9VTklUUyA9IDEwMDA7XG5jb25zdCBIT1JaX1VOSVRTID0gVkVSVF9VTklUUyAqIFJBVElPO1xuXG5sZXQgc2luZ2xldG9uID0gU3ltYm9sKCk7XG5sZXQgc2luZ2xldG9uRW5mb3JjZXIgPSBTeW1ib2woKTtcblxuLyoqXG4gKiBTcGllbGZlbGRcbiAqIFNlaXRlbiBtw7xzc2VuIGltIFZlcmjDpGx0bmlzIDM6MiBhbmdlbGVndCB3ZXJkZW5cbiAqIEBsaW5rOiBodHRwOi8vdHVyZi5taXNzb3VyaS5lZHUvc3RhdC9pbWFnZXMvZmllbGQvZGltaG9ja2V5LmdpZlxuICpcbiAqL1xuY2xhc3MgRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKGVuZm9yY2VyKSB7XG5cbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmIChlbmZvcmNlciAhPSBzaW5nbGV0b25FbmZvcmNlcikge1xuICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgY29uc3RydWN0IHNpbmdsZXRvblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX25hbWUgPSBcIkZpZWxkXCI7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gMDtcbiAgICAgICAgdGhpcy5fZmllbGRIVE1MID0gJChcIjxzZWN0aW9uIGlkPVxcXCJmaWVsZFxcXCI+XCIpO1xuXG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcblxuICAgICAgICAkKHdpbmRvdykucmVzaXplKFxuICAgICAgICAgICAgJC50aHJvdHRsZShSRUZSRVNIX1JBVEVfTVMsICgpPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3BpZWxmZWxkIHNvbGx0ZSBudXIgZWluZSBJbnN0YW56IHNlaW5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xuICAgICAgICBpZiAodGhpc1tzaW5nbGV0b25dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXNbc2luZ2xldG9uXSA9IG5ldyBGaWVsZChzaW5nbGV0b25FbmZvcmNlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbc2luZ2xldG9uXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZXJlY2huZXQgZGllIEJyZWl0ZSBkZXMgRmVsZGVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsY1JhdGlvU2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9ICQoXCJib2R5XCIpLmhlaWdodCgpO1xuICAgICAgICB0aGlzLl93aWR0aCA9IHRoaXMuX2hlaWdodCAqIFJBVElPO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogV2FuZGVsIERhcnN0ZWxsdW5nc2VpbmhlaXRlbiBpbiBQaXhlbCB1bVxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gdW5pdFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyB1bml0czJwaXhlbCh1bml0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHVuaXQgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4odW5pdC55KSB8fCBpc05hTih1bml0LngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XG4gICAgICAgIGxldCB2ZXJ0VW5pdFJhdGlvID0gdW5pdC55IC8gVkVSVF9VTklUUztcbiAgICAgICAgbGV0IGhvclVuaXRSYXRpbyA9IHVuaXQueCAvIEhPUlpfVU5JVFM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGZpZWxkLndpZHRoICogaG9yVW5pdFJhdGlvLFxuICAgICAgICAgICAgeTogZmllbGQuaGVpZ2h0ICogdmVydFVuaXRSYXRpb1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbHQgUGllbCBpbiBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHBpeGVsXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19XG4gICAgICovXG4gICAgc3RhdGljIHBpeGVsMnVuaXRzKHBpeGVsKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHBpeGVsICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHBpeGVsLnkpIHx8IGlzTmFOKHBpeGVsLngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XG4gICAgICAgIGxldCBoZWlnaHRSYXRpbyA9IHBpeGVsLnkgLyBmaWVsZC5oZWlnaHQ7XG4gICAgICAgIGxldCB3aWR0aFJhdGlvID0gcGl4ZWwueCAvIGZpZWxkLndpZHRoO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB3aWR0aFJhdGlvICogSE9SWl9VTklUUyxcbiAgICAgICAgICAgIHk6IGhlaWdodFJhdGlvICogVkVSVF9VTklUU1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICAgIH1cblxuICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGxhdHppZXJ0IGRhcyBGZWxkIGltIEJyb3dzZXJcbiAgICAgKi9cbiAgICBidWlsZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcbiAgICAgICAgLy9FbnRmZXJuZSBhbHRlcyBTcGllbGZlbGRcbiAgICAgICAgaWYgKHRoaXMuX2ZpZWxkSFRNTCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJChcIiNcIiArIHRoaXMuX25hbWUudG9Mb3dlckNhc2UoKSkucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5fZmllbGRIVE1MKTtcbiAgICAgICAgdGhpcy5fZmllbGRIVE1MLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuX2hlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl93aWR0aCxcbiAgICAgICAgICAgIG1hcmdpbkxlZnQ6IHRoaXMuX3dpZHRoICogLS41IC8vNCBjZW50ZXItYWxpZ25tZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmZvckVhY2goKGUpPT4ge1xuICAgICAgICAgICAgJChcIiNmaWVsZFwiKS5hcHBlbmQoZS5odG1sKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogWmVpY2huZXQgYWxsZSBHYW1lb2JqZWN0cyBlaW5cbiAgICAgKi9cbiAgICBwbGF5KCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgd2luZG93LnNldEludGVydmFsKCgpPT4ge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICAgICAgZS5jYWxjUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvbHZlQ29sbGlzaW9ucygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwgUkVGUkVTSF9SQVRFX01TKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEbDvGd0IG5ldWUgU3BpZWxlbGVtZW50ZSBoaW56dVxuICAgICAqIEBwYXJhbSBnYW1lT2JqZWN0XG4gICAgICovXG4gICAgZGVwbG95R2FtZU9iamVjdChnYW1lT2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZ2FtZU9iamVjdC50eXBlICE9PSBcIkdhbWVPYmplY3RcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhIGdhbWVvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZU9iamVjdC5zZXRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5zZXQoZ2FtZU9iamVjdC5uYW1lLCBnYW1lT2JqZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMw7ZzdCBrb2xsaXNpb25lbiBhdWZcbiAgICAgKi9cbiAgICBzb2x2ZUNvbGxpc2lvbnMoKSB7XG4gICAgICAgIHZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgIC8vw5xiZXJsYXVmIHJlY2h0c1xuICAgICAgICAgICAgbGV0IGVQb3MgPSBlLmNvb3JkLnVuaXQ7XG4gICAgICAgICAgICBsZXQgZVNpemUgPSBlLnNpemUudW5pdDtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coZS5jb29yZC51bml0LCBlLnNpemUudW5pdCwgSE9SWl9VTklUUyk7XG5cbiAgICAgICAgICAgIGlmIChlUG9zLnggKyBlU2l6ZS54ID4gSE9SWl9VTklUUykge1xuICAgICAgICAgICAgICAgIGUuY29vcmQgPSBuZXcgQ29vcmQoSE9SWl9VTklUUyAtIGUuc2l6ZS51bml0LngsIGUuY29vcmQudW5pdC55KTtcbiAgICAgICAgICAgICAgICBlLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8ubXVsdGlwbHkobmV3IENvb3JkKC0xLCAwKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVQb3MueCA8IDApIHtcbiAgICAgICAgICAgICAgICBlLm1vdmVUby5tdWx0aXBseShuZXcgQ29vcmQoLTEsIDApKTtcbiAgICAgICAgICAgICAgICBlLmNvb3JkID0gbmV3IENvb3JkKDAsIGUuY29vcmQudW5pdC55KTtcbiAgICAgICAgICAgICAgICBlLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCJsZXQgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcbmNsYXNzIEdhbWVPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGh0bWwsIHhTaXplLCB5U2l6ZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY29vcmQgPSBuZXcgQ29vcmQoKTtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IG5ldyBDb29yZCh4U2l6ZSwgeVNpemUpO1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiR2FtZU9iamVjdFwiO1xuICAgICAgICB0aGlzLl9odG1sID0gaHRtbDtcbiAgICAgICAgdGhpcy5fbW92ZVRvID0gbmV3IENvb3JkKCk7XG5cbiAgICB9XG5cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIGdldCBzaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgfVxuXG4gICAgZ2V0IG1vdmVUbygpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlVG87XG4gICAgfVxuXG4gICAgc2V0IG1vdmVUbyhjb29yZHMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmIChjb29yZHMudHlwZSAhPT0gXCJDb29yZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGEgQ29vcmRcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy9jb29yZHMuZGl2aWRlKG5ldyBDb29yZCgxMDAsMTAwKSk7XG4gICAgICAgIHRoaXMuX21vdmVUbyA9IGNvb3JkcztcbiAgICB9XG5cbiAgICBzZXRQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2h0bWwuY3NzKHtcbiAgICAgICAgICAgIHRvcDogdGhpcy5fY29vcmQucGl4ZWwueSxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuX2Nvb3JkLnBpeGVsLnhcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjYWxjUG9zaXRpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLmNvb3JkLmFkZCh0aGlzLl9tb3ZlVG8pO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGNvb3JkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY29vcmQ7XG4gICAgfVxuXG4gICAgc2V0IGNvb3JkKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jb29yZCA9IGNvb3JkO1xuICAgIH1cblxuICAgIGdldCBodG1sKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0bWw7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT2JqZWN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE1LjA1LjIwMTVcclxuICogVGltZTogMTU6MjZcclxuICovXHJcblxyXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5jb25zdCBWRUxPQ0lUWSA9IC0wLjU7IC8vZ2dmLiBzcMOkdGVyIGF1c3RhdXNjaGVuIGdlZ2VuIEZ1bmt0aW9uIGYodClcclxuY29uc3QgUFVDS19SQURJVVNfVU5JVFMgPSAxNjtcclxuXHJcbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlcihcIlB1Y2tcIiwgJChcIjxiIGlkPVxcXCJwdWNrXFxcIiAvPlwiKSwgUFVDS19SQURJVVNfVU5JVFMgKiAyLCBQVUNLX1JBRElVU19VTklUUyAqIDIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHN1cGVyLnNpemUucGl4ZWwueCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBzdXBlci5zaXplLnBpeGVsLnlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYmFzZVR5cGUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIudHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHp0IFB1Y2sgYXVmIFBvc2l0aW9uXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLnNldFBvc2l0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBQb3NpdGlvbiwgb2huZSBzaWUgenUgc2V0emVuXHJcbiAgICAgKi9cclxuICAgIGNhbGNQb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlci5jYWxjUG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IGRpZSBQdWNrLWdyw7bDn2VcclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XHJcbiAgICB9XHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkXCIpO1xyXG52YXIgUHVjayA9IHJlcXVpcmUoXCIuL1B1Y2tcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxyXG5cclxuICAgIHZhciBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xyXG4gICAgdmFyIHB1Y2sgPSBuZXcgUHVjaygpO1xyXG4gICAgbGV0IHN0YXJ0UHVja0Nvb3JkID0gbmV3IENvb3JkKDAsODApO1xyXG5cclxuICAgIGxldCBtb3ZlVG9Db29yZCA9IG5ldyBDb29yZCgxNTAsIDApO1xyXG4gICAgcHVjay5jb29yZCA9IHN0YXJ0UHVja0Nvb3JkO1xyXG4gICAgcHVjay5tb3ZlVG8gPSBtb3ZlVG9Db29yZDtcclxuXHJcbiAgICBmaWVsZC5kZXBsb3lHYW1lT2JqZWN0KHB1Y2spO1xyXG4gICAgZmllbGQuYnVpbGQoKTtcclxuICAgIGZpZWxkLnBsYXkoKTtcclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG4iXX0=
