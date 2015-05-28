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
var REFRESH_RATE_MS = 10;
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
            var _this3 = this;

            var Coord = require("./Coord");
            this._gameObjects.forEach(function (e) {
                //Überlauf rechts
                var ePos = e.coord.unit;
                var eSize = e.size.unit;

                //Left border
                if (ePos.x + eSize.x > HORZ_UNITS) {
                    //Setzte Puck an die Wand
                    e.coord = new Coord(HORZ_UNITS - e.size.unit.x, e.coord.unit.y);
                    e.setPosition();

                    //quirky
                    e.moveTo = _this3.collisionDirection(e.moveTo, 0.5 * Math.PI);
                } else
                    // Right border?
                    if (ePos.x < 0) {
                        e.moveTo = _this3.collisionDirection(e.moveTo, 1.5 * Math.PI);
                    }

                //Bottom border
                if (ePos.y + eSize.y > VERT_UNITS) {
                    e.coord = new Coord(e.coord.unit.x, VERT_UNITS - e.size.unit.y);
                    e.setPosition();
                    e.moveTo = _this3.collisionDirection(e.moveTo, Math.PI);
                } else
                    //Top border
                    if (ePos.y < 0) {
                        e.moveTo = _this3.collisionDirection(e.moveTo, Math.PI);
                    }
            });
        }
    }, {
        key: "collisionDirection",
        value: function collisionDirection(originAngle, collidingAngle) {
            "use strict";
            var colAngle = collidingAngle * (180 / Math.PI);
            var orgAngle = originAngle * (180 / Math.PI);
            var dAngle = 2 * colAngle - 2 * orgAngle;
            return (360 + orgAngle + dAngle) % 360;
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

        this._moveTo = 0;
        this._speed = 5;
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

        /**
         * Winkel der BEwegungsrichtung in rad!
         * @returns {number}
         */
        get: function () {
            "use strict";
            return this._moveTo;
        },

        /**
         * Winkel, der Bewegungsrichtung
         * 0° == recht, 90° == unten
         * @param {number} angle
         */
        set: function (angle) {
            "use strict";
            if (typeof angle !== "number" || angle < 0 || angle > 360) {
                throw new Error("Must be an Integer between 0° and 360°");
            }

            this._moveTo = Math.PI / 180 * angle;
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
            this.coord.add(this.speedAsCoord);
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
    }, {
        key: "speedAsCoord",

        /**
         * Liefert die Geschwindigkeit in X/Y-Komponente
         */
        get: function () {
            "use strict";
            //Polarkoordinaten-Konversion
            var x = Math.cos(this._moveTo) * this._speed;
            var y = Math.sin(this._moveTo) * this._speed;
            // runden
            x = Math.round(x * 100) / 100;
            y = Math.round(y * 100) / 100;

            return new Coord(x, y);
        }
    }, {
        key: "speed",

        /**
         * Geschwindigkeit/zurückgelegte Distanz je Tick
         * @returns {int}
         */
        get: function () {
            "use strict";
            return this._speed;
        },

        /**
         * Geschwindigkeit/zurückgelegte Distanz je Tick
         * @param {int} speedValue
         */
        set: function (speedValue) {
            "use strict";

            if (typeof speedValue !== "number") {
                throw Error("Muss be a integer");
            }
            this._speed = speedValue;
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

    puck.coord = new Coord(150, 150);
    puck.speed = 5;
    puck.moveTo = 45; // nach rechts bitte

    field.deployGameObject(puck);
    field.build();
    field.play();
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7O0lBQ2IsS0FBSzs7Ozs7Ozs7O0FBUUksYUFSVCxLQUFLLEdBUWlDO0FBQ3BDLG9CQUFZLENBQUM7WUFETCxDQUFDLGdDQUFHLENBQUM7WUFBRSxDQUFDLGdDQUFHLENBQUM7WUFBRSxJQUFJLGdDQUFHLEtBQUs7OzhCQVJwQyxLQUFLOztBQVVILFlBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7O0FBRTFCLFlBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUNoQixnQkFBSSxDQUFDLElBQUksR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQ3pCLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DLE1BQU07QUFDSCxnQkFBSSxDQUFDLEtBQUssR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQzFCLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9DO0tBQ0o7O2lCQXJCQyxLQUFLOzthQXVCQyxZQUFHO0FBQ1Asd0JBQVksQ0FBQztBQUNiLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7Ozs7Ozs7O2VBTU8sa0JBQUMsS0FBSyxFQUFFO0FBQ1osd0JBQVksQ0FBQztBQUNiLGdCQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1QsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsaUJBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsQ0FBQztBQUNGLGdCQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLG1CQUFPLElBQUksQ0FBQTtTQUNkOzs7Ozs7OztlQU1LLGdCQUFDLEtBQUssRUFBRTtBQUNWLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7ZUFNRSxhQUFDLEtBQUssRUFBRTtBQUNQLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRztBQUNULGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDLENBQUM7QUFDRixnQkFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7Ozs7Ozs7YUFN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QUssRUFBRSxDQUFDO0FBQ2QsU0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0NBRWhCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcbiAqIERhdGU6IDE1LjA1LjIwMTVcbiAqIFRpbWU6IDE1OjUzXG4gKi9cblxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGQuanNcIik7XG5jb25zdCBVTklUUyA9IFwidVwiO1xuY29uc3QgUElYRUwgPSBcInB4XCI7XG5jbGFzcyBDb29yZCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0geFxuICAgICAqIEBwYXJhbSB5XG4gICAgICogQHBhcmFtIHtVTklUUyB8IFBJWEVMfSB0eXBlXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn18Kn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHR5cGUgPSBVTklUUykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiQ29vcmRcIjtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSB7eDogMCwgeTogMH07XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7eDogMCwgeTogMH07XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFVOSVRTKSB7XG4gICAgICAgICAgICB0aGlzLnVuaXQgPSB7eDogeCwgeTogeX07XG4gICAgICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5waXhlbCA9IHt4OiB4LCB5OiB5fTtcbiAgICAgICAgICAgIHRoaXMuX3VuaXQgPSBGaWVsZC5waXhlbDJ1bml0cyh0aGlzLl9waXhlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpemllcnQgS29vcmRpbmF0ZW5cbiAgICAgKiBAcGFyYW0gY29vcmRcbiAgICAgKi9cbiAgICBtdWx0aXBseShjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54ICogY29vcmQudW5pdC54LFxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgKiBjb29yZC51bml0LnlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGllcnRzIEtvb3JkaW5hdGVuIGR1cmNoXG4gICAgICogQHBhcmFtIGNvb3JkIHRlaWxlclxuICAgICAqL1xuICAgIGRpdmlkZShjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54IC8gY29vcmQudW5pdC54LFxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgLyBjb29yZC51bml0LnlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRpZXJ0IEtvb3JkaW5hdGVuXG4gICAgICogQHBhcmFtIGNvb3JkIEtvb3JkaW5hdGUsIGRpZSBhZGRpZXJ0IHdlcmRlbiBzb2xsXG4gICAgICovXG4gICAgYWRkKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggKyBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSArIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnN0cmFoaWVydCBLb29yZGluYXRlblxuICAgICAqIEBwYXJhbSBjb29yZFxuICAgICAqL1xuICAgIHN1Yihjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54IC0gY29vcmQudW5pdC54LFxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgLSBjb29yZC51bml0LnlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBQaXhlbFxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcbiAgICAgKi9cbiAgICBzZXQgcGl4ZWwoeHlPYmplY3QpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgeHlPYmplY3QgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4oeHlPYmplY3QueSkgfHwgaXNOYU4oeHlPYmplY3QueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBpeGVsIG11c3QgYmUgYW4gb2JqZWN0IHdpdGggYSB4IGFuZCB5IGNvbXBvbmVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9waXhlbCA9IHh5T2JqZWN0O1xuICAgICAgICB0aGlzLl91bml0ID0gRmllbGQucGl4ZWwydW5pdHModGhpcy5fcGl4ZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgUGl4ZWwtS29tcG9udGVudGUgZGVyIEtvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyB7e3g6bnVtYmVyLHk6bnVtYmVyfX1cbiAgICAgKi9cbiAgICBnZXQgcGl4ZWwoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fcGl4ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgRGFyc3RlbGx1bmdzZWluaGVpdGVuXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSB4eU9iamVjdFxuICAgICAqL1xuICAgIHNldCB1bml0KHh5T2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0IG11c3QgYmUgYW4gb2JqZWN0IHdpdGggYSB4IGFuZCB5IGNvbXBvbmVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91bml0ID0geHlPYmplY3Q7XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBEYXJzdGVsbHVuZ2VpbmhlaXQgZGVyIEtvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyB7e3g6bnVtYmVyLHk6bnVtYmVyfX1cbiAgICAgKi9cbiAgICBnZXQgdW5pdCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl91bml0O1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQ29vcmQ7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNC4wNS4yMDE1XG4gKiBUaW1lOiAxODowOFxuICovXG5cbmNvbnN0IFJBVElPID0gMC42NjY2NjY7XG5jb25zdCBSRUZSRVNIX1JBVEVfTVMgPSAxMDtcbmNvbnN0IFZFUlRfVU5JVFMgPSAxMDAwO1xuY29uc3QgSE9SWl9VTklUUyA9IFZFUlRfVU5JVFMgKiBSQVRJTztcblxubGV0IHNpbmdsZXRvbiA9IFN5bWJvbCgpO1xubGV0IHNpbmdsZXRvbkVuZm9yY2VyID0gU3ltYm9sKCk7XG5cbi8qKlxuICogU3BpZWxmZWxkXG4gKiBTZWl0ZW4gbcO8c3NlbiBpbSBWZXJow6RsdG5pcyAzOjIgYW5nZWxlZ3Qgd2VyZGVuXG4gKiBAbGluazogaHR0cDovL3R1cmYubWlzc291cmkuZWR1L3N0YXQvaW1hZ2VzL2ZpZWxkL2RpbWhvY2tleS5naWZcbiAqXG4gKi9cbmNsYXNzIEZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihlbmZvcmNlcikge1xuXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZW5mb3JjZXIgIT0gc2luZ2xldG9uRW5mb3JjZXIpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2Fubm90IGNvbnN0cnVjdCBzaW5nbGV0b25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9uYW1lID0gXCJGaWVsZFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX2ZpZWxkSFRNTCA9ICQoXCI8c2VjdGlvbiBpZD1cXFwiZmllbGRcXFwiPlwiKTtcblxuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShcbiAgICAgICAgICAgICQudGhyb3R0bGUoUkVGUkVTSF9SQVRFX01TLCAoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzW3NpbmdsZXRvbl0gPSBuZXcgRmllbGQoc2luZ2xldG9uRW5mb3JjZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3NpbmdsZXRvbl07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmVyZWNobmV0IGRpZSBCcmVpdGUgZGVzIEZlbGRlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGNSYXRpb1NpemUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAkKFwiYm9keVwiKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB0aGlzLl9oZWlnaHQgKiBSQVRJTztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gaW4gUGl4ZWwgdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHVuaXRcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgdW5pdHMycGl4ZWwodW5pdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHVuaXQueSkgfHwgaXNOYU4odW5pdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgICAgICBsZXQgdmVydFVuaXRSYXRpbyA9IHVuaXQueSAvIFZFUlRfVU5JVFM7XG4gICAgICAgIGxldCBob3JVbml0UmF0aW8gPSB1bml0LnggLyBIT1JaX1VOSVRTO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBmaWVsZC53aWR0aCAqIGhvclVuaXRSYXRpbyxcbiAgICAgICAgICAgIHk6IGZpZWxkLmhlaWdodCAqIHZlcnRVbml0UmF0aW9cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYW5kZWx0IFBpZWwgaW4gRGFyc3RlbGx1bmdzZWluaGVpdGVuIHVtXG4gICAgICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBwaXhlbFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyBwaXhlbDJ1bml0cyhwaXhlbCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTihwaXhlbC55KSB8fCBpc05hTihwaXhlbC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgICAgICBsZXQgaGVpZ2h0UmF0aW8gPSBwaXhlbC55IC8gZmllbGQuaGVpZ2h0O1xuICAgICAgICBsZXQgd2lkdGhSYXRpbyA9IHBpeGVsLnggLyBmaWVsZC53aWR0aDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogd2lkdGhSYXRpbyAqIEhPUlpfVU5JVFMsXG4gICAgICAgICAgICB5OiBoZWlnaHRSYXRpbyAqIFZFUlRfVU5JVFNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYXR6aWVydCBkYXMgRmVsZCBpbSBCcm93c2VyXG4gICAgICovXG4gICAgYnVpbGQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XG4gICAgICAgIC8vRW50ZmVybmUgYWx0ZXMgU3BpZWxmZWxkXG4gICAgICAgIGlmICh0aGlzLl9maWVsZEhUTUwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9uYW1lLnRvTG93ZXJDYXNlKCkpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuX2ZpZWxkSFRNTCk7XG4gICAgICAgIHRoaXMuX2ZpZWxkSFRNTC5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9oZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5fd2lkdGgsXG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiB0aGlzLl93aWR0aCAqIC0uNSAvLzQgY2VudGVyLWFsaWdubWVudFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgICQoXCIjZmllbGRcIikuYXBwZW5kKGUuaHRtbCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFplaWNobmV0IGFsbGUgR2FtZW9iamVjdHMgZWluXG4gICAgICovXG4gICAgcGxheSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKT0+IHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmZvckVhY2goKGUpPT4ge1xuICAgICAgICAgICAgICAgIGUuY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2x2ZUNvbGxpc2lvbnMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sIFJFRlJFU0hfUkFURV9NUyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGw7xndCBuZXVlIFNwaWVsZWxlbWVudGUgaGluenVcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdFxuICAgICAqL1xuICAgIGRlcGxveUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGdhbWVPYmplY3QudHlwZSAhPT0gXCJHYW1lT2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgYSBnYW1lb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPYmplY3Quc2V0UG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuc2V0KGdhbWVPYmplY3QubmFtZSwgZ2FtZU9iamVjdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTMO2c3Qga29sbGlzaW9uZW4gYXVmXG4gICAgICovXG4gICAgc29sdmVDb2xsaXNpb25zKCkge1xuICAgICAgICB2YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICAvL8OcYmVybGF1ZiByZWNodHNcbiAgICAgICAgICAgIGxldCBlUG9zID0gZS5jb29yZC51bml0O1xuICAgICAgICAgICAgbGV0IGVTaXplID0gZS5zaXplLnVuaXQ7XG5cbiAgICAgICAgICAgIC8vTGVmdCBib3JkZXJcbiAgICAgICAgICAgIGlmIChlUG9zLnggKyBlU2l6ZS54ID4gSE9SWl9VTklUUykge1xuICAgICAgICAgICAgICAgIC8vU2V0enRlIFB1Y2sgYW4gZGllIFdhbmRcbiAgICAgICAgICAgICAgICBlLmNvb3JkID0gbmV3IENvb3JkKEhPUlpfVU5JVFMgLSBlLnNpemUudW5pdC54LCBlLmNvb3JkLnVuaXQueSk7XG4gICAgICAgICAgICAgICAgZS5zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgLy9xdWlya3lcbiAgICAgICAgICAgICAgICBlLm1vdmVUbyA9IHRoaXMuY29sbGlzaW9uRGlyZWN0aW9uKGUubW92ZVRvLCAwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgLy8gUmlnaHQgYm9yZGVyP1xuICAgICAgICAgICAgaWYgKGVQb3MueCA8IDApIHtcbiAgICAgICAgICAgICAgICBlLm1vdmVUbyA9IHRoaXMuY29sbGlzaW9uRGlyZWN0aW9uKGUubW92ZVRvLCAxLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Cb3R0b20gYm9yZGVyXG4gICAgICAgICAgICBpZiAoZVBvcy55ICsgZVNpemUueSA+IFZFUlRfVU5JVFMpIHtcbiAgICAgICAgICAgICAgICBlLmNvb3JkID0gbmV3IENvb3JkKGUuY29vcmQudW5pdC54LCBWRVJUX1VOSVRTIC0gZS5zaXplLnVuaXQueSk7XG4gICAgICAgICAgICAgICAgZS5zZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIGUubW92ZVRvID0gdGhpcy5jb2xsaXNpb25EaXJlY3Rpb24oZS5tb3ZlVG8sIE1hdGguUEkpO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAvL1RvcCBib3JkZXJcbiAgICAgICAgICAgIGlmIChlUG9zLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8gPSB0aGlzLmNvbGxpc2lvbkRpcmVjdGlvbihlLm1vdmVUbywgTWF0aC5QSSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29sbGlzaW9uRGlyZWN0aW9uKG9yaWdpbkFuZ2xlLCBjb2xsaWRpbmdBbmdsZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgbGV0IGNvbEFuZ2xlID0gY29sbGlkaW5nQW5nbGUgKiAoMTgwIC8gTWF0aC5QSSk7XG4gICAgICAgIGxldCBvcmdBbmdsZSA9IG9yaWdpbkFuZ2xlICogKDE4MCAvIE1hdGguUEkpO1xuICAgICAgICBsZXQgZEFuZ2xlID0gMiAqIGNvbEFuZ2xlIC0gMiAqIG9yZ0FuZ2xlO1xuICAgICAgICByZXR1cm4gKDM2MCArIG9yZ0FuZ2xlICsgZEFuZ2xlKSAlIDM2MDtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkOyIsImxldCBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuXG5jbGFzcyBHYW1lT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBodG1sLCB4U2l6ZSwgeVNpemUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2Nvb3JkID0gbmV3IENvb3JkKCk7XG4gICAgICAgIHRoaXMuX3NpemUgPSBuZXcgQ29vcmQoeFNpemUsIHlTaXplKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBcIkdhbWVPYmplY3RcIjtcbiAgICAgICAgdGhpcy5faHRtbCA9IGh0bWw7XG5cbiAgICAgICAgdGhpcy5fbW92ZVRvID0gMDtcbiAgICAgICAgdGhpcy5fc3BlZWQgPSA1O1xuXG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdpbmtlbCBkZXIgQkV3ZWd1bmdzcmljaHR1bmcgaW4gcmFkIVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IG1vdmVUbygpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlVG87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2lua2VsLCBkZXIgQmV3ZWd1bmdzcmljaHR1bmdcbiAgICAgKiAwwrAgPT0gcmVjaHQsIDkwwrAgPT0gdW50ZW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVcbiAgICAgKi9cbiAgICBzZXQgbW92ZVRvKGFuZ2xlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIGFuZ2xlICE9PSBcIm51bWJlclwiIHx8IGFuZ2xlIDwgMCB8fCBhbmdsZSA+IDM2MCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhbiBJbnRlZ2VyIGJldHdlZW4gMMKwIGFuZCAzNjDCsFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVUbyA9IChNYXRoLlBJIC8gMTgwKSAqIGFuZ2xlO1xuICAgIH1cblxuICAgIHNldFBvc2l0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5faHRtbC5jc3Moe1xuICAgICAgICAgICAgdG9wOiB0aGlzLl9jb29yZC5waXhlbC55LFxuICAgICAgICAgICAgbGVmdDogdGhpcy5fY29vcmQucGl4ZWwueFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNhbGNQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuY29vcmQuYWRkKHRoaXMuc3BlZWRBc0Nvb3JkKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldCBjb29yZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkO1xuICAgIH1cblxuICAgIHNldCBjb29yZChjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY29vcmQgPSBjb29yZDtcbiAgICB9XG5cbiAgICBnZXQgaHRtbCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9odG1sO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgZGllIEdlc2Nod2luZGlna2VpdCBpbiBYL1ktS29tcG9uZW50ZVxuICAgICAqL1xuICAgIGdldCBzcGVlZEFzQ29vcmQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICAvL1BvbGFya29vcmRpbmF0ZW4tS29udmVyc2lvblxuICAgICAgICBsZXQgeCA9IE1hdGguY29zKHRoaXMuX21vdmVUbykgKiB0aGlzLl9zcGVlZDtcbiAgICAgICAgbGV0IHkgPSBNYXRoLnNpbih0aGlzLl9tb3ZlVG8pICogdGhpcy5fc3BlZWQ7XG4gICAgICAgIC8vIHJ1bmRlblxuICAgICAgICB4ID0gTWF0aC5yb3VuZCh4ICogMTAwKSAvIDEwMDtcbiAgICAgICAgeSA9IE1hdGgucm91bmQoeSAqIDEwMCkgLyAxMDA7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZCh4LCB5KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlc2Nod2luZGlna2VpdC96dXLDvGNrZ2VsZWd0ZSBEaXN0YW56IGplIFRpY2tcbiAgICAgKiBAcmV0dXJucyB7aW50fVxuICAgICAqL1xuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXNjaHdpbmRpZ2tlaXQvenVyw7xja2dlbGVndGUgRGlzdGFueiBqZSBUaWNrXG4gICAgICogQHBhcmFtIHtpbnR9IHNwZWVkVmFsdWVcbiAgICAgKi9cbiAgICBzZXQgc3BlZWQoc3BlZWRWYWx1ZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBpZiAodHlwZW9mIHNwZWVkVmFsdWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTXVzcyBiZSBhIGludGVnZXJcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zcGVlZCA9IHNwZWVkVmFsdWU7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT2JqZWN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE1LjA1LjIwMTVcclxuICogVGltZTogMTU6MjZcclxuICovXHJcblxyXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5jb25zdCBWRUxPQ0lUWSA9IC0wLjU7IC8vZ2dmLiBzcMOkdGVyIGF1c3RhdXNjaGVuIGdlZ2VuIEZ1bmt0aW9uIGYodClcclxuY29uc3QgUFVDS19SQURJVVNfVU5JVFMgPSAxNjtcclxuXHJcbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlcihcIlB1Y2tcIiwgJChcIjxiIGlkPVxcXCJwdWNrXFxcIiAvPlwiKSwgUFVDS19SQURJVVNfVU5JVFMgKiAyLCBQVUNLX1JBRElVU19VTklUUyAqIDIpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBzdXBlci5odG1sLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXHJcbiAgICAgICAgICAgIGhlaWdodDogc3VwZXIuc2l6ZS5waXhlbC55XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJhc2VUeXBlKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLnR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR6dCBQdWNrIGF1ZiBQb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlci5zZXRQb3NpdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXJlY2huZXQgUG9zaXRpb24sIG9obmUgc2llIHp1IHNldHplblxyXG4gICAgICovXHJcbiAgICBjYWxjUG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIuY2FsY1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zaXplO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBQdWNrOyIsIi8vTm90IHVzZWQgYW55bW9yZVxyXG4vL3JlcXVpcmUoXCIuL19fdGVjaGRlbW9cIik7XHJcblxyXG5cclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcblxyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvL1plaWNobmUgU3BpZWxmZWxkXHJcblxyXG4gICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XHJcbiAgICBsZXQgcHVjayA9IG5ldyBQdWNrKCk7XHJcblxyXG4gICAgcHVjay5jb29yZCA9IG5ldyBDb29yZCgxNTAsIDE1MCk7XHJcbiAgICBwdWNrLnNwZWVkID0gNTtcclxuICAgIHB1Y2subW92ZVRvID0gNDU7IC8vIG5hY2ggcmVjaHRzIGJpdHRlXHJcblxyXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwdWNrKTtcclxuICAgIGZpZWxkLmJ1aWxkKCk7XHJcbiAgICBmaWVsZC5wbGF5KCk7XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuIl19
