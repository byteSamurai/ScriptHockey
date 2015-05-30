(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Marko Grgic on 28.05.2015.
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var BATTER_RADIUS_UNITS = 32;

var Batter = (function (_GameObject) {
    function Batter(name, facing) {
        "use strict";

        var _this = this;

        _classCallCheck(this, Batter);

        _get(Object.getPrototypeOf(Batter.prototype), "constructor", this).call(this, name, $("<b id=\"batter_" + name + "\" class=\"batters\"/>"), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);
        this._facing = facing;
        this.pixeledRadius = Field.units2pixel(BATTER_RADIUS_UNITS);

        $(window).on("resize", function () {
            _get(Object.getPrototypeOf(Batter.prototype), "size", _this).refreshFromUnits();

            _get(Object.getPrototypeOf(Batter.prototype), "html", _this).css({
                width: _get(Object.getPrototypeOf(Batter.prototype), "size", _this).pixel.x,
                height: _get(Object.getPrototypeOf(Batter.prototype), "size", _this).pixel.y
            });
        }).trigger("resize");
    }

    _inherits(Batter, _GameObject);

    _createClass(Batter, [{
        key: "baseType",
        get: function () {
            "use strict";
            _get(Object.getPrototypeOf(Batter.prototype), "type", this);
        }
    }, {
        key: "size",

        /**
         * Liefert die Puck-größe
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Batter.prototype), "size", this);
        }
    }, {
        key: "refreshPosition",
        value: function refreshPosition(event) {
            "use strict";
            var fieldLeftOffset = Field.instance.html.offset().left;
            var mouseX = event.pageX;
            var mouseY = event.pageY;
            var xCoord = 0;
            var yCoord = 0;
            var field = Field.instance;

            if (mouseX - this.pixeledRadius <= fieldLeftOffset) {
                //left overflow
                xCoord = 0;
            } else if (mouseX >= field.width + fieldLeftOffset - this.pixeledRadius) {
                //right overflow
                xCoord = Field.unitWidth - BATTER_RADIUS_UNITS * 2;
            } else {
                //in field
                xCoord = Field.pixel2units(mouseX - fieldLeftOffset) - BATTER_RADIUS_UNITS;
            }

            var mouseYunits = Field.pixel2units(mouseY);
            yCoord = mouseYunits - BATTER_RADIUS_UNITS;

            if (this._facing == "bottom") {

                if (mouseYunits <= Field.unitHeight / 2 + BATTER_RADIUS_UNITS) {
                    //Oberkante-Feldmitte
                    yCoord = Field.unitHeight / 2;
                } else if (mouseYunits > Field.unitHeight - BATTER_RADIUS_UNITS) {
                    yCoord = Field.unitHeight - BATTER_RADIUS_UNITS * 2;
                }
            }

            if (this._facing == "top") {
                if (mouseY >= field.height / 2 - this.pixeledRadius) {
                    //Unterkante-Feldmitte
                    yCoord = Field.pixel2units(field.height / 2 - this.pixeledRadius) - BATTER_RADIUS_UNITS;
                } else if (mouseY < BATTER_RADIUS_UNITS / 2) {
                    yCoord = 0;
                }
            }

            //console.log(mouseX + ', ' + field.html.css('left'));

            this.coord.unit = { x: xCoord, y: yCoord };
            this.setPosition();
        }
    }]);

    return Batter;
})(GameObject);

module.exports = Batter;

},{"./Coord":2,"./Field":3,"./GameObject":4}],2:[function(require,module,exports){
/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:53
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    }, {
        key: "refreshFromUnits",

        /**
         * Aktualisiert pixel von units ausgehend
         */
        value: function refreshFromUnits() {
            "use strict";
            this._pixel = Field.units2pixel(this._unit);
        }
    }, {
        key: "refreshFromPixels",

        /**
         * Aktualisiert units von pixel ausgehend
         */
        value: function refreshFromPixels() {
            "use strict";
            this._unit = Field.pixel2units(this._pixel);
        }
    }]);

    return Coord;
})();

module.exports = Coord;

},{"./Field.js":3}],3:[function(require,module,exports){
/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        "use strict";

        var _this = this;

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

        /**
         * Weite in Pixel
         * @returns {number}
         */
        get: function () {
            "use strict";
            return this._width;
        }
    }, {
        key: "height",

        /**
         * Höhe in Pixel
         * @returns {number}
         */
        get: function () {
            "use strict";
            return this._height;
        }
    }, {
        key: "html",
        get: function () {
            "use strict";
            return this._fieldHTML;
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
            "use strict";

            var _this2 = this;

            window.setInterval(function () {
                _this2._gameObjects.forEach(function (e) {
                    e.calcPosition();
                    _this2.solveBorderCollisions();
                });
                $(window).trigger("game:tick");
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
        key: "solveBorderCollisions",

        /**
         * Löst kollisionen auf
         */
        value: function solveBorderCollisions() {
            var Coord = require("./Coord");
            this._gameObjects.forEach(function (e) {
                if (e.name !== "Puck") {
                    return;
                }
                //Überlauf rechts
                var ePos = e.coord.unit;
                var eSize = e.size.unit;

                //Right border
                if (ePos.x + eSize.x > HORZ_UNITS) {
                    //Setzte Puck an die Wand
                    e.coord = new Coord(HORZ_UNITS - e.size.unit.x, e.coord.unit.y);
                    e.setPosition();

                    //quirky
                    e.moveTo = Field.collisionDirection(e.moveTo, 0.5 * Math.PI);
                } else
                    // Left border?
                    if (ePos.x < 0) {
                        e.coord = new Coord(0, e.coord.unit.y);
                        e.setPosition();
                        e.moveTo = Field.collisionDirection(e.moveTo, 1.5 * Math.PI);
                    }

                //Bottom border
                if (ePos.y + eSize.y > VERT_UNITS) {
                    e.coord = new Coord(e.coord.unit.x, VERT_UNITS - e.size.unit.y);
                    e.setPosition();
                    e.moveTo = Field.collisionDirection(e.moveTo, Math.PI);
                } else
                    //Top border
                    if (ePos.y < 0) {
                        e.coord = new Coord(e.coord.unit.x, 0);
                        e.setPosition();
                        e.moveTo = Field.collisionDirection(e.moveTo, Math.PI);
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
         * @param {{x: number, y: number} | number} unit
         * @returns {{x: number, y: number} | number}
         */
        value: function units2pixel(unit) {
            "use strict";
            if (typeof unit !== "number" && (typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x))) {
                throw new Error("units2pixel must get a object as parameter with x and y as a Number");
            }
            var field = Field.instance;

            if (typeof unit == "number") {
                return unit / HORZ_UNITS * field.width;
            } else {
                var vertUnitRatio = unit.y / VERT_UNITS;
                var horUnitRatio = unit.x / HORZ_UNITS;

                return {
                    x: field.width * horUnitRatio,
                    y: field.height * vertUnitRatio
                };
            }
        }
    }, {
        key: "pixel2units",

        /**
         * Wandelt Piel in Darstellungseinheiten um
         * @param {{x: number, y: number} | number} pixel
         * @returns {{x: number, y: number} | number}
         */
        value: function pixel2units(pixel) {
            "use strict";
            if (typeof pixel !== "number" && (typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x))) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }
            var field = Field.instance;

            if (typeof pixel == "number") {
                return pixel / field.width * HORZ_UNITS;
            } else {
                var heightRatio = pixel.y / field.height;
                var widthRatio = pixel.x / field.width;

                return {
                    x: widthRatio * HORZ_UNITS,
                    y: heightRatio * VERT_UNITS
                };
            }
        }
    }, {
        key: "unitHeight",

        /**
         * Höhe in Units
         * @returns {number}
         */
        get: function () {
            "use strict";
            return VERT_UNITS;
        }
    }, {
        key: "unitWidth",

        /**
         * Weite in Units
         * @returns {number}
         */
        get: function () {
            "use strict";
            return HORZ_UNITS;
        }
    }, {
        key: "collisionDirection",

        /**
         * Berechnet Austrittswinkel
         * @param originAngle
         * @param collidingAngle
         * @returns {number}
         */
        value: function collisionDirection(originAngle, collidingAngle) {
            "use strict";
            var colAngle = collidingAngle * (180 / Math.PI);
            var orgAngle = originAngle * (180 / Math.PI);
            var dAngle = 2 * colAngle - 2 * orgAngle;
            return (360 + orgAngle + dAngle) % 360;
        }
    }]);

    return Field;
})();

module.exports = Field;

},{"./Coord":2}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            var domobject = this._html[0];
            domobject.style.transform = "translate(" + this._coord.pixel.x + "px," + this._coord.pixel.y + "px)";
            //this._html.css({
            //    top: this._coord.pixel.y,
            //    left: this._coord.pixel.x
            //})
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

},{"./Coord":2}],5:[function(require,module,exports){
/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 15:26
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var VELOCITY = -0.5; //ggf. später austauschen gegen Funktion f(t)
var PUCK_RADIUS_UNITS = 16;

var Puck = (function (_GameObject) {
    function Puck() {
        "use strict";

        var _this = this;

        _classCallCheck(this, Puck);

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this, "Puck", $("<b id=\"puck\" />"), PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);

        $(window).on("resize", function () {

            _get(Object.getPrototypeOf(Puck.prototype), "size", _this).refreshFromUnits();

            _get(Object.getPrototypeOf(Puck.prototype), "html", _this).css({
                width: _get(Object.getPrototypeOf(Puck.prototype), "size", _this).pixel.x,
                height: _get(Object.getPrototypeOf(Puck.prototype), "size", _this).pixel.y
            });
        }).trigger("resize");
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

},{"./Coord":2,"./GameObject":4}],6:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");

$(function () {

    //Zeichne Spielfeld
    var field = Field.instance;
    var puck = new Puck();

    //Startcoords
    puck.coord = new Coord(80, 80);
    puck.speed = 15;
    puck.moveTo = 45; // nach links bitte

    var player1 = new Batter("player1", "top");
    var player2 = new Batter("player2", "bottom");
    //Startcoords
    player1.coord = new Coord(Field.unitWidth / 2, Field.unitHeight / 4);
    player2.coord = new Coord(Field.unitWidth / 2, 3 * (Field.unitHeight / 4));
    field.deployGameObject(player1);
    field.deployGameObject(player2);
    field.deployGameObject(puck);
    field.build();
    field.play();

    $(document).on("mousemove", $.throttle(0, function (event) {
        player1.refreshPosition(event);
        player2.refreshPosition(event);
    }));

    //Shadow-Animation
    $(window).on("game:tick", function () {
        $.fn.realshadow.reset();
        $(".batters").realshadow({
            pageX: puck.coord.pixel.x + field.html.offset().left,
            pageY: puck.coord.pixel.y,
            color: "41,255,242", // shadow color, rgb 0..255, default: '0,0,0'
            type: "drop" // shadow type
        });
    });

    $(document).ready(function () {
        $("#modal_start").openModal();
        $(".modal-trigger").leanModal();
    });
});

},{"./Batter":1,"./Coord":2,"./Field":3,"./Puck":5}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9TYWRlcS9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvQmF0dGVyLmpzIiwiQzovVXNlcnMvU2FkZXEvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0Nvb3JkLmpzIiwiQzovVXNlcnMvU2FkZXEvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvU2FkZXEvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0dhbWVPYmplY3QuanMiLCJDOi9Vc2Vycy9TYWRlcS9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvUHVjay5qcyIsIkM6L1VzZXJzL1NhZGVxL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQzs7SUFFekIsTUFBTTtBQUNHLGFBRFQsTUFBTSxDQUNJLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDdEIsb0JBQVksQ0FBQzs7Ozs4QkFGZixNQUFNOztBQUdKLG1DQUhGLE1BQU0sNkNBR0UsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBZ0IsR0FBRyxJQUFJLEdBQUcsd0JBQXFCLENBQUMsRUFB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Q0FBQyxDQUFDO0tBQ2xDLENBQUMsQ0FBQyxDQUFDOzs7QUFHSixLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFLO0FBQzNCLFNBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hCLFNBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDckIsaUJBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJO0FBQ3BELGlCQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixpQkFBSyxFQUFFLFlBQVk7QUFDbkIsZ0JBQUksRUFBRSxNQUFNO0FBQUEsU0FDZixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7O0FBRUgsS0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFXO0FBQ3pCLFNBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUM5QixTQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNuQyxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IE1hcmtvIEdyZ2ljIG9uIDI4LjA1LjIwMTUuXG4gKi9cblxudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcbmNvbnN0IEJBVFRFUl9SQURJVVNfVU5JVFMgPSAzMjtcblxuY2xhc3MgQmF0dGVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZmFjaW5nKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBzdXBlcihuYW1lLCAkKCc8YiBpZD1cImJhdHRlcl8nICsgbmFtZSArICdcIiBjbGFzcz1cImJhdHRlcnNcIi8+JyksIEJBVFRFUl9SQURJVVNfVU5JVFMgKiAyLCBCQVRURVJfUkFESVVTX1VOSVRTICogMik7XG4gICAgICAgIHRoaXMuX2ZhY2luZyA9IGZhY2luZztcbiAgICAgICAgdGhpcy5waXhlbGVkUmFkaXVzID0gRmllbGQudW5pdHMycGl4ZWwoQkFUVEVSX1JBRElVU19VTklUUyk7XG5cblxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgKCk9PiB7XG4gICAgICAgICAgICBzdXBlci5zaXplLnJlZnJlc2hGcm9tVW5pdHMoKTtcblxuICAgICAgICAgICAgc3VwZXIuaHRtbC5jc3Moe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzdXBlci5zaXplLnBpeGVsLnlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS50cmlnZ2VyKFwicmVzaXplXCIpO1xuICAgIH1cblxuICAgIGdldCBiYXNlVHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLnR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxuICAgICAqL1xuICAgIGdldCBzaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XG4gICAgfVxuXG4gICAgcmVmcmVzaFBvc2l0aW9uKGV2ZW50KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBsZXQgZmllbGRMZWZ0T2Zmc2V0ID0gRmllbGQuaW5zdGFuY2UuaHRtbC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICBsZXQgbW91c2VYID0gZXZlbnQucGFnZVg7XG4gICAgICAgIGxldCBtb3VzZVkgPSBldmVudC5wYWdlWTtcbiAgICAgICAgbGV0IHhDb29yZCA9IDA7XG4gICAgICAgIGxldCB5Q29vcmQgPSAwO1xuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcblxuICAgICAgICBpZiAobW91c2VYIC0gdGhpcy5waXhlbGVkUmFkaXVzIDw9IGZpZWxkTGVmdE9mZnNldCkgeyAvL2xlZnQgb3ZlcmZsb3dcbiAgICAgICAgICAgIHhDb29yZCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAobW91c2VYID49IChmaWVsZC53aWR0aCArIGZpZWxkTGVmdE9mZnNldCAtIHRoaXMucGl4ZWxlZFJhZGl1cykpIHsgLy9yaWdodCBvdmVyZmxvd1xuICAgICAgICAgICAgeENvb3JkID0gRmllbGQudW5pdFdpZHRoIC0gKEJBVFRFUl9SQURJVVNfVU5JVFMgKiAyKTtcbiAgICAgICAgfSBlbHNlIHsgLy9pbiBmaWVsZFxuICAgICAgICAgICAgeENvb3JkID0gRmllbGQucGl4ZWwydW5pdHMobW91c2VYIC0gZmllbGRMZWZ0T2Zmc2V0KSAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBtb3VzZVl1bml0cyA9IEZpZWxkLnBpeGVsMnVuaXRzKG1vdXNlWSk7XG4gICAgICAgIHlDb29yZCA9IG1vdXNlWXVuaXRzIC0gQkFUVEVSX1JBRElVU19VTklUUztcblxuICAgICAgICBpZiAodGhpcy5fZmFjaW5nID09ICdib3R0b20nKSB7XG5cbiAgICAgICAgICAgIGlmIChtb3VzZVl1bml0cyA8PSAoRmllbGQudW5pdEhlaWdodCAvIDIgKSArIEJBVFRFUl9SQURJVVNfVU5JVFMpIHsgLy9PYmVya2FudGUtRmVsZG1pdHRlXG4gICAgICAgICAgICAgICAgeUNvb3JkID0gRmllbGQudW5pdEhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vdXNlWXVuaXRzID4gRmllbGQudW5pdEhlaWdodCAtIEJBVFRFUl9SQURJVVNfVU5JVFMpIHtcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC51bml0SGVpZ2h0IC0gQkFUVEVSX1JBRElVU19VTklUUyAqIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZmFjaW5nID09ICd0b3AnKSB7XG4gICAgICAgICAgICBpZiAobW91c2VZID49IChmaWVsZC5oZWlnaHQgLyAyIC0gdGhpcy5waXhlbGVkUmFkaXVzKSkgeyAvL1VudGVya2FudGUtRmVsZG1pdHRlXG4gICAgICAgICAgICAgICAgeUNvb3JkID0gRmllbGQucGl4ZWwydW5pdHMoZmllbGQuaGVpZ2h0IC8gMiAtIHRoaXMucGl4ZWxlZFJhZGl1cykgLSBCQVRURVJfUkFESVVTX1VOSVRTO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3VzZVkgPCBCQVRURVJfUkFESVVTX1VOSVRTIC8gMikge1xuICAgICAgICAgICAgICAgIHlDb29yZCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vY29uc29sZS5sb2cobW91c2VYICsgJywgJyArIGZpZWxkLmh0bWwuY3NzKCdsZWZ0JykpO1xuXG4gICAgICAgIHRoaXMuY29vcmQudW5pdCA9IHt4OiB4Q29vcmQsIHk6IHlDb29yZH07XG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKVxuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhdHRlcjtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XG4gKiBUaW1lOiAxNTo1M1xuICovXG5cbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkLmpzXCIpO1xuY29uc3QgVU5JVFMgPSBcInVcIjtcbmNvbnN0IFBJWEVMID0gXCJweFwiO1xuY2xhc3MgQ29vcmQge1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHhcbiAgICAgKiBAcGFyYW0geVxuICAgICAqIEBwYXJhbSB7VU5JVFMgfCBQSVhFTH0gdHlwZVxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fCp9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB0eXBlID0gVU5JVFMpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBcIkNvb3JkXCI7XG4gICAgICAgIHRoaXMuX3BpeGVsID0ge3g6IDAsIHk6IDB9O1xuICAgICAgICB0aGlzLl91bml0ID0ge3g6IDAsIHk6IDB9O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBVTklUUykge1xuICAgICAgICAgICAgdGhpcy51bml0ID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGl4ZWwgPSB7eDogeCwgeTogeX07XG4gICAgICAgICAgICB0aGlzLl91bml0ID0gRmllbGQucGl4ZWwydW5pdHModGhpcy5fcGl4ZWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBsaXppZXJ0IEtvb3JkaW5hdGVuXG4gICAgICogQHBhcmFtIGNvb3JkXG4gICAgICovXG4gICAgbXVsdGlwbHkoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAqIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICogY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGl2aWRpZXJ0cyBLb29yZGluYXRlbiBkdXJjaFxuICAgICAqIEBwYXJhbSBjb29yZCB0ZWlsZXJcbiAgICAgKi9cbiAgICBkaXZpZGUoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAvIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55IC8gY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkaWVydCBLb29yZGluYXRlblxuICAgICAqIEBwYXJhbSBjb29yZCBLb29yZGluYXRlLCBkaWUgYWRkaWVydCB3ZXJkZW4gc29sbFxuICAgICAqL1xuICAgIGFkZChjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54ICsgY29vcmQudW5pdC54LFxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgKyBjb29yZC51bml0LnlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzdHJhaGllcnQgS29vcmRpbmF0ZW5cbiAgICAgKiBAcGFyYW0gY29vcmRcbiAgICAgKi9cbiAgICBzdWIoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAtIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55IC0gY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgUGl4ZWxcbiAgICAgKiBAcGFyYW0ge3t4Om51bWJlcix5Om51bWJlcn19IHh5T2JqZWN0XG4gICAgICovXG4gICAgc2V0IHBpeGVsKHh5T2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwaXhlbCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGl4ZWwgPSB4eU9iamVjdDtcbiAgICAgICAgdGhpcy5fdW5pdCA9IEZpZWxkLnBpeGVsMnVuaXRzKHRoaXMuX3BpeGVsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaWVmZXJ0IFBpeGVsLUtvbXBvbnRlbnRlIGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IHBpeGVsKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpeGVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IERhcnN0ZWxsdW5nc2VpbmhlaXRlblxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcbiAgICAgKi9cbiAgICBzZXQgdW5pdCh4eU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5pdCA9IHh5T2JqZWN0O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgRGFyc3RlbGx1bmdlaW5oZWl0IGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IHVuaXQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdW5pdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBa3R1YWxpc2llcnQgcGl4ZWwgdm9uIHVuaXRzIGF1c2dlaGVuZFxuICAgICAqL1xuICAgIHJlZnJlc2hGcm9tVW5pdHMoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFrdHVhbGlzaWVydCB1bml0cyB2b24gcGl4ZWwgYXVzZ2VoZW5kXG4gICAgICovXG4gICAgcmVmcmVzaEZyb21QaXhlbHMoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0gRmllbGQucGl4ZWwydW5pdHModGhpcy5fcGl4ZWwpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gQ29vcmQ7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNC4wNS4yMDE1XG4gKiBUaW1lOiAxODowOFxuICovXG5cbmNvbnN0IFJBVElPID0gMC42NjY2NjY7XG5jb25zdCBSRUZSRVNIX1JBVEVfTVMgPSAxMDtcbmNvbnN0IFZFUlRfVU5JVFMgPSAxMDAwO1xuY29uc3QgSE9SWl9VTklUUyA9IFZFUlRfVU5JVFMgKiBSQVRJTztcblxubGV0IHNpbmdsZXRvbiA9IFN5bWJvbCgpO1xubGV0IHNpbmdsZXRvbkVuZm9yY2VyID0gU3ltYm9sKCk7XG5cbi8qKlxuICogU3BpZWxmZWxkXG4gKiBTZWl0ZW4gbcO8c3NlbiBpbSBWZXJow6RsdG5pcyAzOjIgYW5nZWxlZ3Qgd2VyZGVuXG4gKiBAbGluazogaHR0cDovL3R1cmYubWlzc291cmkuZWR1L3N0YXQvaW1hZ2VzL2ZpZWxkL2RpbWhvY2tleS5naWZcbiAqXG4gKi9cbmNsYXNzIEZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihlbmZvcmNlcikge1xuXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZW5mb3JjZXIgIT0gc2luZ2xldG9uRW5mb3JjZXIpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2Fubm90IGNvbnN0cnVjdCBzaW5nbGV0b25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9uYW1lID0gXCJGaWVsZFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX2ZpZWxkSFRNTCA9ICQoXCI8c2VjdGlvbiBpZD1cXFwiZmllbGRcXFwiPlwiKTtcblxuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShcbiAgICAgICAgICAgICQudGhyb3R0bGUoUkVGUkVTSF9SQVRFX01TLCAoKT0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzW3NpbmdsZXRvbl0gPSBuZXcgRmllbGQoc2luZ2xldG9uRW5mb3JjZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3NpbmdsZXRvbl07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmVyZWNobmV0IGRpZSBCcmVpdGUgZGVzIEZlbGRlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGNSYXRpb1NpemUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAkKFwiYm9keVwiKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB0aGlzLl9oZWlnaHQgKiBSQVRJTztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gaW4gUGl4ZWwgdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9IHVuaXRcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdW5pdHMycGl4ZWwodW5pdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ICE9PSBcIm51bWJlclwiICYmICh0eXBlb2YgdW5pdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih1bml0LnkpIHx8IGlzTmFOKHVuaXQueCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0czJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdW5pdCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5pdCAvIEhPUlpfVU5JVFMgKiBmaWVsZC53aWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB2ZXJ0VW5pdFJhdGlvID0gdW5pdC55IC8gVkVSVF9VTklUUztcbiAgICAgICAgICAgIGxldCBob3JVbml0UmF0aW8gPSB1bml0LnggLyBIT1JaX1VOSVRTO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IGZpZWxkLndpZHRoICogaG9yVW5pdFJhdGlvLFxuICAgICAgICAgICAgICAgIHk6IGZpZWxkLmhlaWdodCAqIHZlcnRVbml0UmF0aW9cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYW5kZWx0IFBpZWwgaW4gRGFyc3RlbGx1bmdzZWluaGVpdGVuIHVtXG4gICAgICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfSBwaXhlbFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBwaXhlbDJ1bml0cyhwaXhlbCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCAhPT0gXCJudW1iZXJcIiAmJiAodHlwZW9mIHBpeGVsICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHBpeGVsLnkpIHx8IGlzTmFOKHBpeGVsLngpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuXG5cbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gcGl4ZWwgLyBmaWVsZC53aWR0aCAqIEhPUlpfVU5JVFM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0UmF0aW8gPSBwaXhlbC55IC8gZmllbGQuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHdpZHRoUmF0aW8gPSBwaXhlbC54IC8gZmllbGQud2lkdGg7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogd2lkdGhSYXRpbyAqIEhPUlpfVU5JVFMsXG4gICAgICAgICAgICAgICAgeTogaGVpZ2h0UmF0aW8gKiBWRVJUX1VOSVRTXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2VpdGUgaW4gUGl4ZWxcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIw7ZoZSBpbiBQaXhlbFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSMO2aGUgaW4gVW5pdHNcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgdW5pdEhlaWdodCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiBWRVJUX1VOSVRTO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlaXRlIGluIFVuaXRzXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IHVuaXRXaWR0aCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiBIT1JaX1VOSVRTO1xuICAgIH1cblxuICAgIGdldCBodG1sKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpZWxkSFRNTDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxuICAgICAqL1xuICAgIGJ1aWxkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgICAgICAvL0VudGZlcm5lIGFsdGVzIFNwaWVsZmVsZFxuICAgICAgICBpZiAodGhpcy5fZmllbGRIVE1MICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fbmFtZS50b0xvd2VyQ2FzZSgpKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLl9maWVsZEhUTUwpO1xuICAgICAgICB0aGlzLl9maWVsZEhUTUwuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5faGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuX3dpZHRoLFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy5fd2lkdGggKiAtLjUgLy80IGNlbnRlci1hbGlnbm1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICAkKFwiI2ZpZWxkXCIpLmFwcGVuZChlLmh0bWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBaZWljaG5ldCBhbGxlIEdhbWVvYmplY3RzIGVpblxuICAgICAqL1xuICAgIHBsYXkoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgICAgICBlLmNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29sdmVCb3JkZXJDb2xsaXNpb25zKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKFwiZ2FtZTp0aWNrXCIpO1xuXG4gICAgICAgIH0sIFJFRlJFU0hfUkFURV9NUyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGw7xndCBuZXVlIFNwaWVsZWxlbWVudGUgaGluenVcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdFxuICAgICAqL1xuICAgIGRlcGxveUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGdhbWVPYmplY3QudHlwZSAhPT0gXCJHYW1lT2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgYSBnYW1lb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPYmplY3Quc2V0UG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuc2V0KGdhbWVPYmplY3QubmFtZSwgZ2FtZU9iamVjdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTMO2c3Qga29sbGlzaW9uZW4gYXVmXG4gICAgICovXG4gICAgc29sdmVCb3JkZXJDb2xsaXNpb25zKCkge1xuICAgICAgICB2YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICBpZiAoZS5uYW1lICE9PSBcIlB1Y2tcIikge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/DnGJlcmxhdWYgcmVjaHRzXG4gICAgICAgICAgICBsZXQgZVBvcyA9IGUuY29vcmQudW5pdDtcbiAgICAgICAgICAgIGxldCBlU2l6ZSA9IGUuc2l6ZS51bml0O1xuXG4gICAgICAgICAgICAvL1JpZ2h0IGJvcmRlclxuICAgICAgICAgICAgaWYgKGVQb3MueCArIGVTaXplLnggPiBIT1JaX1VOSVRTKSB7XG4gICAgICAgICAgICAgICAgLy9TZXR6dGUgUHVjayBhbiBkaWUgV2FuZFxuICAgICAgICAgICAgICAgIGUuY29vcmQgPSBuZXcgQ29vcmQoSE9SWl9VTklUUyAtIGUuc2l6ZS51bml0LngsIGUuY29vcmQudW5pdC55KTtcbiAgICAgICAgICAgICAgICBlLnNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAvL3F1aXJreVxuICAgICAgICAgICAgICAgIGUubW92ZVRvID0gRmllbGQuY29sbGlzaW9uRGlyZWN0aW9uKGUubW92ZVRvLCAwLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgLy8gTGVmdCBib3JkZXI/XG4gICAgICAgICAgICBpZiAoZVBvcy54IDwgMCkge1xuICAgICAgICAgICAgICAgIGUuY29vcmQgPSBuZXcgQ29vcmQoMCwgZS5jb29yZC51bml0LnkpO1xuICAgICAgICAgICAgICAgIGUuc2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLm1vdmVUbyA9IEZpZWxkLmNvbGxpc2lvbkRpcmVjdGlvbihlLm1vdmVUbywgMS41ICogTWF0aC5QSSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQm90dG9tIGJvcmRlclxuICAgICAgICAgICAgaWYgKGVQb3MueSArIGVTaXplLnkgPiBWRVJUX1VOSVRTKSB7XG4gICAgICAgICAgICAgICAgZS5jb29yZCA9IG5ldyBDb29yZChlLmNvb3JkLnVuaXQueCwgVkVSVF9VTklUUyAtIGUuc2l6ZS51bml0LnkpO1xuICAgICAgICAgICAgICAgIGUuc2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLm1vdmVUbyA9IEZpZWxkLmNvbGxpc2lvbkRpcmVjdGlvbihlLm1vdmVUbywgTWF0aC5QSSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIC8vVG9wIGJvcmRlclxuICAgICAgICAgICAgaWYgKGVQb3MueSA8IDApIHtcbiAgICAgICAgICAgICAgICBlLmNvb3JkID0gbmV3IENvb3JkKGUuY29vcmQudW5pdC54LCAwKTtcbiAgICAgICAgICAgICAgICBlLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8gPSBGaWVsZC5jb2xsaXNpb25EaXJlY3Rpb24oZS5tb3ZlVG8sIE1hdGguUEkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJlcmVjaG5ldCBBdXN0cml0dHN3aW5rZWxcbiAgICAgKiBAcGFyYW0gb3JpZ2luQW5nbGVcbiAgICAgKiBAcGFyYW0gY29sbGlkaW5nQW5nbGVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBjb2xsaXNpb25EaXJlY3Rpb24ob3JpZ2luQW5nbGUsIGNvbGxpZGluZ0FuZ2xlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBsZXQgY29sQW5nbGUgPSBjb2xsaWRpbmdBbmdsZSAqICgxODAgLyBNYXRoLlBJKTtcbiAgICAgICAgbGV0IG9yZ0FuZ2xlID0gb3JpZ2luQW5nbGUgKiAoMTgwIC8gTWF0aC5QSSk7XG4gICAgICAgIGxldCBkQW5nbGUgPSAyICogY29sQW5nbGUgLSAyICogb3JnQW5nbGU7XG4gICAgICAgIHJldHVybiAoMzYwICsgb3JnQW5nbGUgKyBkQW5nbGUpICUgMzYwO1xuICAgIH1cblxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkOyIsImxldCBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuXG5jbGFzcyBHYW1lT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBodG1sLCB4U2l6ZSwgeVNpemUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2Nvb3JkID0gbmV3IENvb3JkKCk7XG4gICAgICAgIHRoaXMuX3NpemUgPSBuZXcgQ29vcmQoeFNpemUsIHlTaXplKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3R5cGUgPSBcIkdhbWVPYmplY3RcIjtcbiAgICAgICAgdGhpcy5faHRtbCA9IGh0bWw7XG5cbiAgICAgICAgdGhpcy5fbW92ZVRvID0gMDtcbiAgICAgICAgdGhpcy5fc3BlZWQgPSA1O1xuXG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9XG5cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdpbmtlbCBkZXIgQkV3ZWd1bmdzcmljaHR1bmcgaW4gcmFkIVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IG1vdmVUbygpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlVG87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2lua2VsLCBkZXIgQmV3ZWd1bmdzcmljaHR1bmdcbiAgICAgKiAwwrAgPT0gcmVjaHQsIDkwwrAgPT0gdW50ZW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGVcbiAgICAgKi9cbiAgICBzZXQgbW92ZVRvKGFuZ2xlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIGFuZ2xlICE9PSBcIm51bWJlclwiIHx8IGFuZ2xlIDwgMCB8fCBhbmdsZSA+IDM2MCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhbiBJbnRlZ2VyIGJldHdlZW4gMMKwIGFuZCAzNjDCsFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVUbyA9IChNYXRoLlBJIC8gMTgwKSAqIGFuZ2xlO1xuICAgIH1cblxuICAgIHNldFBvc2l0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgbGV0IGRvbW9iamVjdCA9IHRoaXMuX2h0bWxbMF07XG4gICAgICAgIGRvbW9iamVjdC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIHRoaXMuX2Nvb3JkLnBpeGVsLnggKyBcInB4LFwiICsgdGhpcy5fY29vcmQucGl4ZWwueSArIFwicHgpXCI7XG4gICAgICAgIC8vdGhpcy5faHRtbC5jc3Moe1xuICAgICAgICAvLyAgICB0b3A6IHRoaXMuX2Nvb3JkLnBpeGVsLnksXG4gICAgICAgIC8vICAgIGxlZnQ6IHRoaXMuX2Nvb3JkLnBpeGVsLnhcbiAgICAgICAgLy99KVxuICAgIH1cblxuICAgIGNhbGNQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuY29vcmQuYWRkKHRoaXMuc3BlZWRBc0Nvb3JkKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldCBjb29yZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkO1xuICAgIH1cblxuICAgIHNldCBjb29yZChjb29yZCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY29vcmQgPSBjb29yZDtcbiAgICB9XG5cbiAgICBnZXQgaHRtbCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9odG1sO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgZGllIEdlc2Nod2luZGlna2VpdCBpbiBYL1ktS29tcG9uZW50ZVxuICAgICAqL1xuICAgIGdldCBzcGVlZEFzQ29vcmQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICAvL1BvbGFya29vcmRpbmF0ZW4tS29udmVyc2lvblxuICAgICAgICBsZXQgeCA9IE1hdGguY29zKHRoaXMuX21vdmVUbykgKiB0aGlzLl9zcGVlZDtcbiAgICAgICAgbGV0IHkgPSBNYXRoLnNpbih0aGlzLl9tb3ZlVG8pICogdGhpcy5fc3BlZWQ7XG4gICAgICAgIC8vIHJ1bmRlblxuICAgICAgICB4ID0gTWF0aC5yb3VuZCh4ICogMTAwKSAvIDEwMDtcbiAgICAgICAgeSA9IE1hdGgucm91bmQoeSAqIDEwMCkgLyAxMDA7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZCh4LCB5KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlc2Nod2luZGlna2VpdC96dXLDvGNrZ2VsZWd0ZSBEaXN0YW56IGplIFRpY2tcbiAgICAgKiBAcmV0dXJucyB7aW50fVxuICAgICAqL1xuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXNjaHdpbmRpZ2tlaXQvenVyw7xja2dlbGVndGUgRGlzdGFueiBqZSBUaWNrXG4gICAgICogQHBhcmFtIHtpbnR9IHNwZWVkVmFsdWVcbiAgICAgKi9cbiAgICBzZXQgc3BlZWQoc3BlZWRWYWx1ZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICBpZiAodHlwZW9mIHNwZWVkVmFsdWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTXVzcyBiZSBhIGludGVnZXJcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zcGVlZCA9IHNwZWVkVmFsdWU7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT2JqZWN0OyIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTUuMDUuMjAxNVxuICogVGltZTogMTU6MjZcbiAqL1xuXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcbmNvbnN0IFZFTE9DSVRZID0gLTAuNTsgLy9nZ2YuIHNww6R0ZXIgYXVzdGF1c2NoZW4gZ2VnZW4gRnVua3Rpb24gZih0KVxuY29uc3QgUFVDS19SQURJVVNfVU5JVFMgPSAxNjtcblxuY2xhc3MgUHVjayBleHRlbmRzIEdhbWVPYmplY3Qge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBzdXBlcihcIlB1Y2tcIiwgJChcIjxiIGlkPVxcXCJwdWNrXFxcIiAvPlwiKSwgUFVDS19SQURJVVNfVU5JVFMgKiAyLCBQVUNLX1JBRElVU19VTklUUyAqIDIpO1xuXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCAoKT0+IHtcblxuICAgICAgICAgICAgc3VwZXIuc2l6ZS5yZWZyZXNoRnJvbVVuaXRzKCk7XG5cbiAgICAgICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogc3VwZXIuc2l6ZS5waXhlbC54LFxuICAgICAgICAgICAgICAgIGhlaWdodDogc3VwZXIuc2l6ZS5waXhlbC55XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkudHJpZ2dlcihcInJlc2l6ZVwiKTtcblxuICAgIH1cblxuICAgIGdldCBiYXNlVHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLnR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgUHVjayBhdWYgUG9zaXRpb25cbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLnNldFBvc2l0aW9uKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZXJlY2huZXQgUG9zaXRpb24sIG9obmUgc2llIHp1IHNldHplblxuICAgICAqL1xuICAgIGNhbGNQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLmNhbGNQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxuICAgICAqL1xuICAgIGdldCBzaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XG4gICAgfVxuXG5cbn1cbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcbi8vcmVxdWlyZShcIi4vX190ZWNoZGVtb1wiKTtcblxuXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcbnZhciBCYXR0ZXIgPSByZXF1aXJlKFwiLi9CYXR0ZXJcIik7XG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcblxuXG4kKGZ1bmN0aW9uICgpIHtcblxuXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxuICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgIGxldCBwdWNrID0gbmV3IFB1Y2soKTtcblxuICAgIC8vU3RhcnRjb29yZHNcbiAgICBwdWNrLmNvb3JkID0gbmV3IENvb3JkKDgwLCA4MCk7XG4gICAgcHVjay5zcGVlZCA9IDE1O1xuICAgIHB1Y2subW92ZVRvID0gNDU7IC8vIG5hY2ggbGlua3MgYml0dGVcblxuXG4gICAgdmFyIHBsYXllcjEgPSBuZXcgQmF0dGVyKCdwbGF5ZXIxJywgJ3RvcCcpO1xuICAgIHZhciBwbGF5ZXIyID0gbmV3IEJhdHRlcigncGxheWVyMicsICdib3R0b20nKTtcbiAgICAvL1N0YXJ0Y29vcmRzXG4gICAgcGxheWVyMS5jb29yZCA9IG5ldyBDb29yZChGaWVsZC51bml0V2lkdGggLyAyLCBGaWVsZC51bml0SGVpZ2h0IC8gNCk7XG4gICAgcGxheWVyMi5jb29yZCA9IG5ldyBDb29yZChGaWVsZC51bml0V2lkdGggLyAyLCAzICogKEZpZWxkLnVuaXRIZWlnaHQgLyA0KSk7XG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwbGF5ZXIxKTtcbiAgICBmaWVsZC5kZXBsb3lHYW1lT2JqZWN0KHBsYXllcjIpO1xuICAgIGZpZWxkLmRlcGxveUdhbWVPYmplY3QocHVjayk7XG4gICAgZmllbGQuYnVpbGQoKTtcbiAgICBmaWVsZC5wbGF5KCk7XG5cbiAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlbW92ZVwiLCAkLnRocm90dGxlKDAsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBwbGF5ZXIxLnJlZnJlc2hQb3NpdGlvbihldmVudCk7XG4gICAgICAgIHBsYXllcjIucmVmcmVzaFBvc2l0aW9uKGV2ZW50KTtcbiAgICB9KSk7XG5cbiAgICAvL1NoYWRvdy1BbmltYXRpb25cbiAgICAkKHdpbmRvdykub24oXCJnYW1lOnRpY2tcIiwgKCk9PiB7XG4gICAgICAgICQuZm4ucmVhbHNoYWRvdy5yZXNldCgpO1xuICAgICAgICAkKCcuYmF0dGVycycpLnJlYWxzaGFkb3coe1xuICAgICAgICAgICAgcGFnZVg6IHB1Y2suY29vcmQucGl4ZWwueCArIGZpZWxkLmh0bWwub2Zmc2V0KCkubGVmdCxcbiAgICAgICAgICAgIHBhZ2VZOiBwdWNrLmNvb3JkLnBpeGVsLnksXG4gICAgICAgICAgICBjb2xvcjogXCI0MSwyNTUsMjQyXCIsICAgIC8vIHNoYWRvdyBjb2xvciwgcmdiIDAuLjI1NSwgZGVmYXVsdDogJzAsMCwwJ1xuICAgICAgICAgICAgdHlwZTogJ2Ryb3AnIC8vIHNoYWRvdyB0eXBlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyNtb2RhbF9zdGFydCcpLm9wZW5Nb2RhbCgpO1xuICAgICAgICAkKCcubW9kYWwtdHJpZ2dlcicpLmxlYW5Nb2RhbCgpO1xuICAgIH0pO1xufSk7XG5cblxuXG4iXX0=
