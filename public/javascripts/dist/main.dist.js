(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by Marko Grgic on 28.05.2015.
 */

var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var BATTER_RADIUS_UNITS = 32;

var Batter = (function (_GameObject) {
    function Batter(facing) {
        var _this2 = this;

        "use strict";

        _classCallCheck(this, Batter);

        var _this = this;

        _get(Object.getPrototypeOf(Batter.prototype), "constructor", this).call(this, "batter-" + facing, $("<b class=\"batters\"/>"), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);

        this._facing = facing;
        this.pixeledRadius = Field.units2pixel(BATTER_RADIUS_UNITS);

        $(window).on("resize", function (e) {
            _get(Object.getPrototypeOf(Batter.prototype), "size", _this).refreshFromUnits();

            _get(Object.getPrototypeOf(Batter.prototype), "html", _this).css({
                width: _get(Object.getPrototypeOf(Batter.prototype), "size", _this).pixel.x,
                height: _get(Object.getPrototypeOf(Batter.prototype), "size", _this).pixel.y
            });

            _this2.calcPosition(e);
        }).trigger("resize");

        //on Mousemove, Position neu berechnen
        $(document).on("mousemove", $.throttle(Field.refreshRate, function (e) {
            _this2.calcPosition(e);
        }));
    }

    _inherits(Batter, _GameObject);

    _createClass(Batter, [{
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
        key: "centerCoord",

        /**
         * Liefert Mittelpunkt-Koordinaten
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Batter.prototype), "coord", this).clone().add(new Coord(BATTER_RADIUS_UNITS, BATTER_RADIUS_UNITS));
        }
    }, {
        key: "getNextPosition",

        /**
         * Liefert nächste Position
         * @param event
         * @returns {{x: number, y: number}}
         */
        value: function getNextPosition(event) {
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
                } else if (mouseY < this.pixeledRadius) {
                    yCoord = 0;
                }
            }

            return { x: xCoord, y: yCoord };
        }
    }, {
        key: "calcPosition",

        /**
         * Berechnet Position
         */
        value: function calcPosition(e) {
            "use strict";
            if (typeof e != "undefined" && e.type == "mousemove") {
                //can only retrieve mouse pos if mouse was moved
                var oldPos = this.coord.unit;
                this.coord.unit = this.getNextPosition(e);
                var xDist = this.coord.unit.x - oldPos.x;
                var yDist = this.coord.unit.y - oldPos.y;
                var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
                this.speed = distance;
                //TODO: moveTo
            }
            this.setPosition();
        }
    }], [{
        key: "position",
        get: function () {
            "use strict";
            return {
                TOP: "top",
                BOTTOM: "bottom"
            };
        }
    }, {
        key: "radius",

        /**
         * Liefert Radius in Units
         * @returns {number}
         */
        get: function () {
            "use strict";
            return BATTER_RADIUS_UNITS;
        }
    }]);

    return Batter;
})(GameObject);

module.exports = Batter;

},{"./Coord":2,"./Field":3,"./GameObject":4}],2:[function(require,module,exports){
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
            this.refreshFromUnits();
        } else {
            this.pixel = { x: x, y: y };
            this.refreshFromPixels();
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
            this.refreshFromUnits();
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
            this.refreshFromUnits();
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
            this.refreshFromUnits();
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
            this.refreshFromUnits();
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
            this.refreshFromPixels();
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
            this.refreshFromUnits();
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
        key: "clone",

        /**
         * Clone Coordinaten
         * @returns {Coord}
         */
        value: function clone() {
            "use strict";
            return new Coord(this._unit.x, this._unit.y);
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
    }], [{
        key: "cartesianToPolar",

        /**
         * Konvertiert kartesische Koordinaten zu Polarkoordinaten
         * @param {number} x
         * @param {number} y
         * @link http://www.w3schools.com/jsref/jsref_atan2.asp
         */
        value: function cartesianToPolar(x, y) {
            "use strict";
            if (x == 0 && y == 0) {
                throw new Error("It's not possible to get the polar-Coords from origin");
            }
            var angle = Math.atan2(y, x);
            angle = angle < 0 ? angle + Math.PI * 2 : angle;

            var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            return {
                angle: angle,
                distance: distance
            };
        }
    }, {
        key: "polarToCartesian",

        /**
         * Rechnet Polarkoordinate in kartesiche um
         * @param {number} distance
         * @param {number} moveTo in rad
         * @returns {Coord | object}
         * @param {bool} asNewCoord liefert eine neue Coord-Instanz
         */
        value: function polarToCartesian(distance, moveTo) {
            "use strict";

            var asNewCoord = arguments[2] === undefined ? true : arguments[2];
            //Polarkoordinaten-Konversion
            var x = Math.cos(moveTo) * distance;
            var y = Math.sin(moveTo) * distance;
            // runden
            x = Math.round(x * 100) / 100;
            y = Math.round(y * 100) / 100;

            return asNewCoord ? new Coord(x, y) : { x: x, y: y };
        }
    }, {
        key: "deg2rad",

        /**
         * Grad in rad
         */
        value: function deg2rad(deg) {
            "use strict";
            return deg * (Math.PI / 180);
        }
    }, {
        key: "rad2deg",

        /**
         * rad in Grad
         */
        value: function rad2deg(rad) {
            "use strict";
            return rad * (180 / Math.PI);
        }
    }]);

    return Coord;
})();

module.exports = Coord;

},{"./Field.js":3}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

var RATIO = 0.666666;
var REFRESH_RATE_MS = 30;
var VERT_UNITS = 1000;
var HORZ_UNITS = VERT_UNITS * RATIO;
var VEC_BOTTOM_TOP = Math.PI; //rad
var VEC_LEFT_RIGHT = Math.PI * 0.5; // rad
var SPEED_INCREASE_STEP = 2;

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
        this._initialGameObjectSpecs = new Map();
        this._ID = "field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");
        this._playInstance = null;

        this._calcRatioSize();

        $(window).resize($.throttle(REFRESH_RATE_MS, function () {
            _this.build();
        }));
    }

    _createClass(Field, [{
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

        /**
         * Liefert repräsentatives DOM-Element als Jquery
         * @returns {*|jQuery|HTMLElement}
         */
        get: function () {
            "use strict";
            return this._fieldHTML;
        }
    }, {
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
        key: "build",

        /**
         * Platziert das Feld im Browser
         */
        value: function build() {
            var _this2 = this;

            "use strict";
            this._calcRatioSize();
            //Entferne altes Spielfeld
            if (this._fieldHTML !== null) {
                $("#" + this._ID).remove();
            }

            $("body").append(this._fieldHTML);
            this._fieldHTML.css({
                height: this._height,
                width: this._width,
                marginLeft: this._width * -0.5 //4 center-alignment
            });

            this._gameObjects.forEach(function (e) {
                $("#" + _this2._ID).append(e.html);
            });
        }
    }, {
        key: "play",

        /**
         * Zeichnet alle Gameobjects ein
         */
        value: function play() {
            var _this3 = this;

            "use strict";
            this._playInstance = window.setInterval(function () {
                //Berechne Position aller Objekte
                _this3._gameObjects.forEach(function (e) {
                    e.calcPosition();
                });
                _this3.detectGoalCollision();
                _this3.solvePuckBorderCollisions();
                _this3.solveBatterCollisions();

                $(window).trigger("game:tick");
            }, REFRESH_RATE_MS);
        }
    }, {
        key: "stop",

        /**
         * Stoppt Spiel
         */
        value: function stop() {
            "use strict";
            window.clearInterval(this._playInstance);
        }
    }, {
        key: "reset",

        /**
         * Setzt Spielelemente auf Ausgangszustand zurück
         */
        value: function reset() {
            var _this4 = this;

            "use strict";
            var puck = this._gameObjects.get("puck");
            puck.speed = 0;
            puck.resetScore();
            this._gameObjects.forEach(function (e) {
                e.coord.unit = _this4._initialGameObjectSpecs.get(e.ID).pos;
                e.setPosition();
            });
        }
    }, {
        key: "deployGameObject",

        /**
         * Fügt neue Spielelemente hinzu
         * @param gameObject
         */
        value: function deployGameObject(gameObject) {
            "use strict";
            var GameObject = require("./GameObject");

            if (!gameObject instanceof GameObject) {
                throw new Error("Must be a gameobject");
            }

            gameObject.setPosition();
            this._gameObjects.set(gameObject.ID, gameObject);
            this._initialGameObjectSpecs.set(gameObject.ID, {
                pos: {
                    x: gameObject.coord.unit.x,
                    y: gameObject.coord.unit.y
                }
            });
        }
    }, {
        key: "solvePuckBorderCollisions",

        /**
         * Löst Wandkollisionen auf
         */
        value: function solvePuckBorderCollisions() {
            var Coord = require("./Coord");
            var Puck = require("./Puck");

            if (!this._gameObjects.has("puck")) {
                throw new Error("No Puck at Game!");
            }

            var puck = this._gameObjects.get("puck");

            if (!puck instanceof Puck) {
                //korrekte Instanz
                return;
            }

            var ePos = puck.coord.unit;
            var eSize = puck.size.unit;
            var wallDirection;

            //Right border
            if (ePos.x + eSize.x > HORZ_UNITS) {
                puck.coord.unit = {
                    x: HORZ_UNITS - puck.size.unit.x,
                    y: puck.coord.unit.y
                };
                wallDirection = VEC_LEFT_RIGHT;
            } else
                // Left border?
                if (ePos.x < 0) {
                    puck.coord.unit = {
                        x: 0,
                        y: puck.coord.unit.y
                    };
                    wallDirection = VEC_LEFT_RIGHT;
                }

            //Bottom border?
            if (ePos.y + eSize.y > VERT_UNITS) {
                puck.coord.unit = {
                    x: puck.coord.unit.x,
                    y: VERT_UNITS - puck.size.unit.y
                };
                wallDirection = VEC_BOTTOM_TOP;
            } else
                //Top border?
                if (ePos.y < 0) {
                    puck.coord.unit = {
                        x: puck.coord.unit.x,
                        y: 0
                    };
                    wallDirection = VEC_BOTTOM_TOP;
                }

            if (wallDirection != undefined) {
                puck.moveTo = Field.collisionDirection(puck.moveTo, wallDirection);
                puck.setPosition();
            }
        }
    }, {
        key: "solveBatterCollisions",

        /**
         * Löst Schläger-Kollisionen auf
         */
        value: function solveBatterCollisions() {
            "use strict";
            var Puck = require("./Puck");
            var Batter = require("./Batter");
            var Coord = require("./Coord");

            var puck = this._gameObjects.get("puck");

            var batters = [];
            var batterBottom = this._gameObjects.get("batter-bottom");
            var batterTop = this._gameObjects.get("batter-top");

            if (batterBottom !== undefined) {
                batters.push(batterBottom);
            }
            if (batterTop !== undefined) {
                batters.push(batterTop);
            }

            batters.forEach(function (e) {
                var xDist = e.centerCoord.unit.x - puck.centerCoord.unit.x;
                var yDist = e.centerCoord.unit.y - puck.centerCoord.unit.y;
                var polarCoord = Coord.cartesianToPolar(xDist, yDist);
                var radiusSum = Puck.radius + Batter.radius;
                //Bounced!
                if (polarCoord.distance < radiusSum) {
                    //Schiebe Puck an Rand von Batter
                    polarCoord.distance -= radiusSum;
                    var batterBorderCoord = Coord.polarToCartesian(polarCoord.distance, polarCoord.angle);
                    puck.coord.add(batterBorderCoord);
                    puck.setPosition();
                    //Drehe um 180° zum zentrum
                    puck.moveTo = (polarCoord.angle + Math.PI) % (2 * Math.PI);

                    puck.speed += SPEED_INCREASE_STEP;
                    puck.addScore();
                    console.info("Puck ist nun " + puck.score + " wert");
                }
            });
        }
    }, {
        key: "detectGoalCollision",

        /**
         * Erkenne Tor
         */
        value: function detectGoalCollision() {
            var _this5 = this;

            var Puck = require("./Puck");
            var puck = this._gameObjects.get("puck");

            [this._gameObjects.get("goal-top"), this._gameObjects.get("goal-bottom")].forEach(function (e) {
                "use strict";
                var start = e.coord.unit.x;
                var end = start + e.width;
                //Oberes Tor
                if (puck.coord.unit.y <= 0 && puck.coord.unit.x - Puck.radius / 2 > start && puck.coord.unit.x + Puck.radius / 2 < end) {
                    _this5.stop();
                    $(window).trigger("game:goal", {
                        player: "top",
                        score: puck.score
                    });
                }

                if (puck.coord.unit.y + 2 * Puck.radius >= VERT_UNITS - Puck.radius && puck.coord.unit.x - Puck.radius / 2 > start && puck.coord.unit.x + Puck.radius / 2 < end) {
                    _this5.stop();
                    $(window).trigger("game:goal", {
                        player: "bottom",
                        score: puck.score
                    });
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
        key: "refreshRate",

        /**
         * Aktualisierungsrate des Spielfelds
         */
        get: function () {
            "use strict";
            return REFRESH_RATE_MS;
        }
    }, {
        key: "collisionDirection",

        /**
         * Berechnet Austrittswinkel
         * @param originAngle
         * @param collidingAngle
         * @returns {number} rad des neuen Winkels
         */
        value: function collisionDirection(originAngle, collidingAngle) {
            "use strict";
            var fullCircleRad = 2 * Math.PI;
            return (fullCircleRad + originAngle + 2 * collidingAngle - 2 * originAngle) % fullCircleRad;
        }
    }]);

    return Field;
})();

module.exports = Field;

},{"./Batter":1,"./Coord":2,"./GameObject":4,"./Puck":6}],4:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Coord = require("./Coord");

var GameObject = (function () {
    /**
     * @param id ID um Element im DOM zu markieren und Objekt zu vergleichen
     * @param html Jquery-HTML-element
     * @param xSize UNITS
     * @param ySize UNITS
     */

    function GameObject(id, html, xSize, ySize) {
        "use strict";

        _classCallCheck(this, GameObject);

        this._coord = new Coord();
        this._size = new Coord(xSize, ySize);
        //Konkreter Instanz-Name
        this._ID = id;
        //Basis-Klasse wird als Daten-Typ für Validierung verwendet
        this._html = html.attr("id", id);
        this._moveTo = 0;
        this._speed = 0;
    }

    _createClass(GameObject, [{
        key: "size",

        /**
         * Größe des Game-Objekts
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return this._size;
        }
    }, {
        key: "moveTo",

        /**
         * Winkel der Bewegungsrichtung in rad!!!!!
         * @returns {number} Winkel in rad!
         */
        get: function () {
            "use strict";
            return this._moveTo;
        },

        /**
         * Winkel, der Bewegungsrichtung in rad
         * 0° == recht, 90° == unten
         * @param {number} angle
         */
        set: function (angle) {
            "use strict";
            this._moveTo = angle;
        }
    }, {
        key: "ID",

        /**
         * Die repäsentative ID eines jeden Objects
         * @returns {String}
         */
        get: function () {
            "use strict";
            return this._ID;
        }
    }, {
        key: "coord",

        /**
         * Die Koordinaten eines jeden GameObjects
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return this._coord;
        },

        /**
         * Setzt Koordinaten
         * @param {Coord} coord
         */
        set: function (coord) {
            "use strict";
            this._coord = coord;
        }
    }, {
        key: "html",

        /**
         * Das repräsentative DOM-Element
         * @returns {*}
         */
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
            var Coord = require("./Coord");
            return Coord.polarToCartesian(this._speed, this._moveTo);
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
                throw Error("Must be a integer");
            }
            this._speed = speedValue;
        }
    }, {
        key: "setPosition",

        /**
         * Bewegt Gameobject an Position
         * @link http://jsperf.com/translate3d-vs-xy/28
         */
        value: function setPosition() {
            "use strict";
            var domobject = this._html[0];
            domobject.style.transform = "translate3d(" + this._coord.pixel.x + "px," + this._coord.pixel.y + "px,0)";
        }
    }, {
        key: "calcPosition",

        /**
         * Berechnet die nächste Position des GameObjects
         */
        value: function calcPosition() {
            "use strict";
            this.coord.add(this.speedAsCoord);
        }
    }]);

    return GameObject;
})();

module.exports = GameObject;

},{"./Coord":2}],5:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by Marko Grgic on 28.05.2015.
 */
var GameObject = require("./GameObject");
var Coord = require("./Coord");
var Field = require("./Field");
var Puck = require("./Puck");

var GOAL_HEIGHT = Field.unitHeight / 20;
var GOAL_WIDTH = Field.unitWidth / 4;

var Goal = (function (_GameObject) {
    function Goal(facing) {
        var _this2 = this;

        "use strict";

        _classCallCheck(this, Goal);

        var _this = this;

        _get(Object.getPrototypeOf(Goal.prototype), "constructor", this).call(this, "goal-" + facing, $("<span class=\"goals\"/>"), GOAL_WIDTH, GOAL_HEIGHT);
        this._facing = facing;

        $(window).on("resize", function () {
            _get(Object.getPrototypeOf(Goal.prototype), "size", _this).refreshFromUnits();

            _get(Object.getPrototypeOf(Goal.prototype), "html", _this).css({
                width: _get(Object.getPrototypeOf(Goal.prototype), "size", _this).pixel.x,
                height: _get(Object.getPrototypeOf(Goal.prototype), "size", _this).pixel.y
            });

            _this2.calcPosition();
        }).trigger("resize");
    }

    _inherits(Goal, _GameObject);

    _createClass(Goal, [{
        key: "width",
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Goal.prototype), "size", this).unit.x;
        }
    }, {
        key: "height",
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Goal.prototype), "size", this).unit.y;
        }
    }, {
        key: "calcPosition",

        /**
         * Berechnet Position
         */
        value: function calcPosition() {
            "use strict";
            _get(Object.getPrototypeOf(Goal.prototype), "calcPosition", this).call(this);
            this.setPosition();
        }
    }], [{
        key: "position",
        get: function () {
            "use strict";
            return {
                TOP: "top",
                BOTTOM: "bottom"
            };
        }
    }]);

    return Goal;
})(GameObject);

module.exports = Goal;

},{"./Coord":2,"./Field":3,"./GameObject":4,"./Puck":6}],6:[function(require,module,exports){
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
var SCORE_START = 50;
var SCORE_STEP = 25;

var Puck = (function (_GameObject) {
    function Puck() {
        "use strict";

        _classCallCheck(this, Puck);

        var _this = this;

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this, "puck", $("<b />"), PUCK_RADIUS_UNITS * 2, PUCK_RADIUS_UNITS * 2);

        this._score = 50;
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
        key: "score",

        /**
         * Liefert Punktestand
         */
        get: function () {
            "use strict";
            return this._score;
        }
    }, {
        key: "addScore",

        /**
         * Erhöht Punktestand
         */
        value: function addScore() {
            "use strict";
            this._score += SCORE_STEP;
        }
    }, {
        key: "resetScore",
        value: function resetScore() {
            "use strict";
            this._score = SCORE_START;
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
    }, {
        key: "centerCoord",

        /**
         * Liefert Mittelpunkt-Koordinaten
         * @returns {Coord}
         */
        get: function () {
            "use strict";
            return _get(Object.getPrototypeOf(Puck.prototype), "coord", this).clone().add(new Coord(PUCK_RADIUS_UNITS, PUCK_RADIUS_UNITS));
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
         * Berechnet Position uns setzt Object anschließend an Position
         */
        value: function calcPosition() {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "calcPosition", this).call(this);
            this.setPosition();
        }
    }], [{
        key: "radius",

        /**
         * Liefert Puck-Radius in units
         * @returns {number}
         */
        get: function () {
            "use strict";
            return PUCK_RADIUS_UNITS;
        }
    }]);

    return Puck;
})(GameObject);

module.exports = Puck;

},{"./Coord":2,"./GameObject":4}],7:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 20:03
 */

var singleton = Symbol();
var singletonEnforcer = Symbol();

var SocketManager = (function () {
    function SocketManager(enforcer) {
        var _this = this;

        "use strict";

        _classCallCheck(this, SocketManager);

        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }
        this._startCB = null;
        this._stopCB = null;
        this._socket = io.connect();
        this._socket.on("game:start", function () {
            $(".modal").closeModal();
            _this._startCB();
        });
    }

    _createClass(SocketManager, [{
        key: "startgameCallback",

        /**
         * Setzt die Start-Funktion um das Spiel zu beginnen
         * @param func
         */
        set: function (func) {
            "use strict";
            if (typeof func !== "function") {
                throw new Error("Musst be a Function-referenz");
            }
            this._startCB = func;
        }
    }, {
        key: "stopgameCallback",

        /**
         * Setzt die Stop-Funktion um das Spiel zu stoppen
         * @param func
         */
        set: function (func) {
            "use strict";
            if (typeof func !== "function") {
                throw new Error("Musst be a Function-referenz");
            }
            this._stopCB = func;
        }
    }, {
        key: "newPlayer",

        /**
         * Neuen Spieler am Server anmelden
         * @param playername
         * @param {Function} cb
         */
        value: function newPlayer(playername, cb) {
            "use strict";
            this._socket.emit("player:new", { name: playername }, function (res) {
                console.info(res.status);
                cb(res);
            });
        }
    }, {
        key: "playerAmount",

        /**
         * Erzeugt neue SPiel-Instanz
         * @param cb
         */
        value: function playerAmount(cb) {
            "use strict";
            this._socket.emit("player:amount", {}, function (res) {
                console.info(res.status);
                cb(res);
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
                this[singleton] = new SocketManager(singletonEnforcer);
            }
            return this[singleton];
        }
    }]);

    return SocketManager;
})();

module.exports = SocketManager;

},{}],8:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");
var SocketManager = require("./SocketManager");
var Goal = require("./Goal");
var modalFormLogic = require("./modalFormLogic");

$(function () {

    //Zeichne Spielfeld
    var field = Field.instance;
    var puck = new Puck();

    //Startcoords
    puck.coord = new Coord(Field.unitWidth / 2 - Puck.radius, Field.unitHeight / 2);
    //StartSpeed
    puck.speed = 0;
    puck.moveTo = 0;

    var goalTop = new Goal(Goal.position.TOP);
    var goalBottom = new Goal(Goal.position.BOTTOM);

    //Startcoords
    goalTop.coord = new Coord(Field.unitWidth / 4 * 1.5, 0 - goalTop.size.unit.y / 2);
    goalBottom.coord = new Coord(Field.unitWidth / 4 * 1.5, Field.unitHeight - goalBottom.size.unit.y / 2);
    modalFormLogic.checkPlayerAmount();
    modalFormLogic.startup();

    SocketManager.instance.startgameCallback = function (facing) {
        "use strict";
        var playerTop = new Batter(Batter.position.TOP);
        var playerBottom = new Batter(Batter.position.BOTTOM);
        playerTop.coord = new Coord(Field.unitWidth / 2 - Batter.radius, Field.unitHeight / 4);
        playerBottom.coord = new Coord(Field.unitWidth / 2 - Batter.radius, 3 * (Field.unitHeight / 4));
        var field = Field.instance;
        // Deploy game objects and start
        field.deployGameObject(goalTop);
        field.deployGameObject(goalBottom);
        //field.deployGameObject(playerTop);
        field.deployGameObject(playerBottom);
        field.deployGameObject(puck);
        field.build();
        field.play();
    };

    SocketManager.instance.stopgameCallback = function () {
        "use strict";
        Field.instance.stop();
    };

    $(window).on("game:goal", function (event, data) {
        "use strict";
        console.log("TOOOR", data);
        field.reset();
        field.play();
    });

    //Shadow-Animation
    //$(window).on("game:tick", ()=> {
    //    $.fn.realshadow.reset();
    //    console.log(puck.coord.pixel.x + field.html.offset().left );
    //    $('.batters').realshadow({
    //        pageX: puck.coord.pixel.x + field.html.offset().left + field.html.width()/2,
    //        pageY: puck.coord.pixel.y,
    //        color: "41,255,242",    // shadow color, rgb 0..255, default: '0,0,0'
    //        type: 'drop' // shadow type
    //    });
    //});
});

},{"./Batter":1,"./Coord":2,"./Field":3,"./Goal":5,"./Puck":6,"./SocketManager":7,"./modalFormLogic":9}],9:[function(require,module,exports){
/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
"use strict";

var SocketManager = require("./SocketManager");

var modalFormLogic = {
    startup: function startup() {
        "use strict";

        $("#enterName_Modal").openModal({
            ready: function ready() {
                "use strict";
                $("#player_name").focus();
            },
            dismissible: false
        });

        $("#submit_player_name_form").on("click", function (e) {
            e.preventDefault();
            $("#player_name_form").submit();
        });

        $("#player_name_form").on("submit", function (e) {
            e.preventDefault();
            var playerName = $("#player_name");
            if (playerName.val().length < 1) {
                Materialize.toast("Bitte geben Sie einen Namen ein!", 4000, "red darken-3");
                playerName.addClass("invalid");
            } else {
                SocketManager.instance.newPlayer(playerName.val(), function (res) {

                    if (res.status === "player:nameTaken") {
                        Materialize.toast(res.msg, 4000, "red darken-3");
                        playerName.addClass("invalid");
                    }

                    if (res.status === "player:ok") {

                        //$("#enterName_Modal").closeModal();
                        modalFormLogic.checkPlayerAmount(true);
                    }
                });
            }
        });
    },
    checkPlayerAmount: function checkPlayerAmount() {
        "use strict";
        var check4waiting = arguments[0] === undefined ? false : arguments[0];
        SocketManager.instance.playerAmount(function (res) {

            if (check4waiting && res.status === "player:waiting") {
                $("#waiting_Modal").openModal({
                    dismissible: false
                });
                return;
            }
            if (res.status === "player:full") {
                $("#serverFull_Modal").openModal({
                    dismissible: false
                });
                return;
            }
        });
    }
};

module.exports = modalFormLogic;

},{"./SocketManager":7}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9CYXR0ZXIuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0dvYWwuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9QdWNrLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvU29ja2V0TWFuYWdlci5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL21haW4uanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tb2RhbEZvcm1Mb2dpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FD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OiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXJrbyBHcmdpYyBvbiAyOC4wNS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBHYW1lT2JqZWN0ID0gcmVxdWlyZShcIi4vR2FtZU9iamVjdFwiKTtcclxudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkXCIpO1xyXG5jb25zdCBCQVRURVJfUkFESVVTX1VOSVRTID0gMzI7XHJcblxyXG5jbGFzcyBCYXR0ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKGZhY2luZykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICBzdXBlcihcImJhdHRlci1cIiArIGZhY2luZywgJCgnPGIgY2xhc3M9XCJiYXR0ZXJzXCIvPicpLCBCQVRURVJfUkFESVVTX1VOSVRTICogMiwgQkFUVEVSX1JBRElVU19VTklUUyAqIDIpO1xyXG5cclxuICAgICAgICB0aGlzLl9mYWNpbmcgPSBmYWNpbmc7XHJcbiAgICAgICAgdGhpcy5waXhlbGVkUmFkaXVzID0gRmllbGQudW5pdHMycGl4ZWwoQkFUVEVSX1JBRElVU19VTklUUyk7XHJcblxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgKGUpPT4ge1xyXG4gICAgICAgICAgICBzdXBlci5zaXplLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHN1cGVyLnNpemUucGl4ZWwueVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FsY1Bvc2l0aW9uKGUpO1xyXG4gICAgICAgIH0pLnRyaWdnZXIoXCJyZXNpemVcIik7XHJcblxyXG4gICAgICAgIC8vb24gTW91c2Vtb3ZlLCBQb3NpdGlvbiBuZXUgYmVyZWNobmVuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJtb3VzZW1vdmVcIiwgJC50aHJvdHRsZShGaWVsZC5yZWZyZXNoUmF0ZSwgKGUpPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGNQb3NpdGlvbihlKTtcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBUT1A6IFwidG9wXCIsXHJcbiAgICAgICAgICAgIEJPVFRPTTogXCJib3R0b21cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgUmFkaXVzIGluIFVuaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IHJhZGl1cygpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gQkFUVEVSX1JBRElVU19VTklUU1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBNaXR0ZWxwdW5rdC1Lb29yZGluYXRlblxyXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxyXG4gICAgICovXHJcbiAgICBnZXQgY2VudGVyQ29vcmQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvb3JkLmNsb25lKCkuYWRkKFxyXG4gICAgICAgICAgICBuZXcgQ29vcmQoQkFUVEVSX1JBRElVU19VTklUUywgQkFUVEVSX1JBRElVU19VTklUUylcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IG7DpGNoc3RlIFBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxyXG4gICAgICovXHJcbiAgICBnZXROZXh0UG9zaXRpb24oZXZlbnQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgZmllbGRMZWZ0T2Zmc2V0ID0gRmllbGQuaW5zdGFuY2UuaHRtbC5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICAgIGxldCBtb3VzZVggPSBldmVudC5wYWdlWDtcclxuICAgICAgICBsZXQgbW91c2VZID0gZXZlbnQucGFnZVk7XHJcbiAgICAgICAgbGV0IHhDb29yZCA9IDA7XHJcbiAgICAgICAgbGV0IHlDb29yZCA9IDA7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XHJcblxyXG4gICAgICAgIGlmIChtb3VzZVggLSB0aGlzLnBpeGVsZWRSYWRpdXMgPD0gZmllbGRMZWZ0T2Zmc2V0KSB7IC8vbGVmdCBvdmVyZmxvd1xyXG4gICAgICAgICAgICB4Q29vcmQgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobW91c2VYID49IChmaWVsZC53aWR0aCArIGZpZWxkTGVmdE9mZnNldCAtIHRoaXMucGl4ZWxlZFJhZGl1cykpIHsgLy9yaWdodCBvdmVyZmxvd1xyXG4gICAgICAgICAgICB4Q29vcmQgPSBGaWVsZC51bml0V2lkdGggLSAoQkFUVEVSX1JBRElVU19VTklUUyAqIDIpO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vaW4gZmllbGRcclxuICAgICAgICAgICAgeENvb3JkID0gRmllbGQucGl4ZWwydW5pdHMobW91c2VYIC0gZmllbGRMZWZ0T2Zmc2V0KSAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGV0IG1vdXNlWXVuaXRzID0gRmllbGQucGl4ZWwydW5pdHMobW91c2VZKTtcclxuICAgICAgICB5Q29vcmQgPSBtb3VzZVl1bml0cyAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mYWNpbmcgPT0gJ2JvdHRvbScpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb3VzZVl1bml0cyA8PSAoRmllbGQudW5pdEhlaWdodCAvIDIgKSArIEJBVFRFUl9SQURJVVNfVU5JVFMpIHsgLy9PYmVya2FudGUtRmVsZG1pdHRlXHJcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC51bml0SGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3VzZVl1bml0cyA+IEZpZWxkLnVuaXRIZWlnaHQgLSBCQVRURVJfUkFESVVTX1VOSVRTKSB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC51bml0SGVpZ2h0IC0gQkFUVEVSX1JBRElVU19VTklUUyAqIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mYWNpbmcgPT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgaWYgKG1vdXNlWSA+PSAoZmllbGQuaGVpZ2h0IC8gMiAtIHRoaXMucGl4ZWxlZFJhZGl1cykpIHsgLy9VbnRlcmthbnRlLUZlbGRtaXR0ZVxyXG4gICAgICAgICAgICAgICAgeUNvb3JkID0gRmllbGQucGl4ZWwydW5pdHMoZmllbGQuaGVpZ2h0IC8gMiAtIHRoaXMucGl4ZWxlZFJhZGl1cykgLSBCQVRURVJfUkFESVVTX1VOSVRTO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vdXNlWSA8IHRoaXMucGl4ZWxlZFJhZGl1cykge1xyXG4gICAgICAgICAgICAgICAgeUNvb3JkID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHt4OiB4Q29vcmQsIHk6IHlDb29yZH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXJlY2huZXQgUG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgY2FsY1Bvc2l0aW9uKGUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAoKHR5cGVvZiBlICE9IFwidW5kZWZpbmVkXCIpICYmIChlLnR5cGUgPT0gXCJtb3VzZW1vdmVcIikpIHsgLy9jYW4gb25seSByZXRyaWV2ZSBtb3VzZSBwb3MgaWYgbW91c2Ugd2FzIG1vdmVkXHJcbiAgICAgICAgICAgIGxldCBvbGRQb3MgPSB0aGlzLmNvb3JkLnVuaXQ7XHJcbiAgICAgICAgICAgIHRoaXMuY29vcmQudW5pdCA9IHRoaXMuZ2V0TmV4dFBvc2l0aW9uKGUpO1xyXG4gICAgICAgICAgICBsZXQgeERpc3QgPSB0aGlzLmNvb3JkLnVuaXQueCAtIG9sZFBvcy54O1xyXG4gICAgICAgICAgICBsZXQgeURpc3QgPSB0aGlzLmNvb3JkLnVuaXQueSAtIG9sZFBvcy55O1xyXG4gICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coeERpc3QsIDIpICsgTWF0aC5wb3coeURpc3QsIDIpKTtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IGRpc3RhbmNlO1xyXG4gICAgICAgICAgICAvL1RPRE86IG1vdmVUb1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmF0dGVyO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcclxuICogRGF0ZTogMTUuMDUuMjAxNVxyXG4gKiBUaW1lOiAxNTo1M1xyXG4gKi9cclxuXHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkLmpzXCIpO1xyXG5jb25zdCBVTklUUyA9IFwidVwiO1xyXG5jb25zdCBQSVhFTCA9IFwicHhcIjtcclxuY2xhc3MgQ29vcmQge1xyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHhcclxuICAgICAqIEBwYXJhbSB5XHJcbiAgICAgKiBAcGFyYW0ge1VOSVRTIHwgUElYRUx9IHR5cGVcclxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fCp9XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgdHlwZSA9IFVOSVRTKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiQ29vcmRcIjtcclxuICAgICAgICB0aGlzLl9waXhlbCA9IHt4OiAwLCB5OiAwfTtcclxuICAgICAgICB0aGlzLl91bml0ID0ge3g6IDAsIHk6IDB9O1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PT0gVU5JVFMpIHtcclxuICAgICAgICAgICAgdGhpcy51bml0ID0ge3g6IHgsIHk6IHl9O1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBpeGVsID0ge3g6IHgsIHk6IHl9O1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hGcm9tUGl4ZWxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB0eXBlKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTXVsdGlwbGl6aWVydCBLb29yZGluYXRlblxyXG4gICAgICogQHBhcmFtIGNvb3JkXHJcbiAgICAgKi9cclxuICAgIG11bHRpcGx5KGNvb3JkKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy51bml0LnggKiBjb29yZC51bml0LngsXHJcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICogY29vcmQudW5pdC55XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGl2aWRpZXJ0cyBLb29yZGluYXRlbiBkdXJjaFxyXG4gICAgICogQHBhcmFtIGNvb3JkIHRlaWxlclxyXG4gICAgICovXHJcbiAgICBkaXZpZGUoY29vcmQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl91bml0ID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAvIGNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgLyBjb29yZC51bml0LnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEZyb21Vbml0cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRpZXJ0IEtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcGFyYW0gY29vcmQgS29vcmRpbmF0ZSwgZGllIGFkZGllcnQgd2VyZGVuIHNvbGxcclxuICAgICAqL1xyXG4gICAgYWRkKGNvb3JkKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy51bml0LnggKyBjb29yZC51bml0LngsXHJcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICsgY29vcmQudW5pdC55XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3Vic3RyYWhpZXJ0IEtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcGFyYW0gY29vcmRcclxuICAgICAqL1xyXG4gICAgc3ViKGNvb3JkKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fdW5pdCA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy51bml0LnggLSBjb29yZC51bml0LngsXHJcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55IC0gY29vcmQudW5pdC55XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0enQgUGl4ZWxcclxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcclxuICAgICAqL1xyXG4gICAgc2V0IHBpeGVsKHh5T2JqZWN0KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwaXhlbCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BpeGVsID0geHlPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoRnJvbVBpeGVscygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBQaXhlbC1Lb21wb250ZW50ZSBkZXIgS29vcmRpbmF0ZVxyXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XHJcbiAgICAgKi9cclxuICAgIGdldCBwaXhlbCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGl4ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR6dCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW5cclxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcclxuICAgICAqL1xyXG4gICAgc2V0IHVuaXQoeHlPYmplY3QpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBhIHggYW5kIHkgY29tcG9uZW50XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91bml0ID0geHlPYmplY3Q7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoRnJvbVVuaXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IERhcnN0ZWxsdW5nZWluaGVpdCBkZXIgS29vcmRpbmF0ZVxyXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XHJcbiAgICAgKi9cclxuICAgIGdldCB1bml0KCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91bml0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xvbmUgQ29vcmRpbmF0ZW5cclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgY2xvbmUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZCh0aGlzLl91bml0LngsIHRoaXMuX3VuaXQueSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFrdHVhbGlzaWVydCBwaXhlbCB2b24gdW5pdHMgYXVzZ2VoZW5kXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2hGcm9tVW5pdHMoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFrdHVhbGlzaWVydCB1bml0cyB2b24gcGl4ZWwgYXVzZ2VoZW5kXHJcbiAgICAgKi9cclxuICAgIHJlZnJlc2hGcm9tUGl4ZWxzKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3VuaXQgPSBGaWVsZC5waXhlbDJ1bml0cyh0aGlzLl9waXhlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLb252ZXJ0aWVydCBrYXJ0ZXNpc2NoZSBLb29yZGluYXRlbiB6dSBQb2xhcmtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBsaW5rIGh0dHA6Ly93d3cudzNzY2hvb2xzLmNvbS9qc3JlZi9qc3JlZl9hdGFuMi5hc3BcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNhcnRlc2lhblRvUG9sYXIoeCwgeSkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICh4ID09IDAgJiYgeSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkl0J3Mgbm90IHBvc3NpYmxlIHRvIGdldCB0aGUgcG9sYXItQ29vcmRzIGZyb20gb3JpZ2luXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgICAgICAgYW5nbGUgPSBhbmdsZSA8IDAgPyBhbmdsZSArIE1hdGguUEkgKiAyIDogYW5nbGU7XHJcblxyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4LCAyKSArIE1hdGgucG93KHksIDIpKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhbmdsZTogYW5nbGUsXHJcbiAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0YW5jZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWNobmV0IFBvbGFya29vcmRpbmF0ZSBpbiBrYXJ0ZXNpY2hlIHVtXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlVG8gaW4gcmFkXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmQgfCBvYmplY3R9XHJcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IGFzTmV3Q29vcmQgbGllZmVydCBlaW5lIG5ldWUgQ29vcmQtSW5zdGFuelxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcG9sYXJUb0NhcnRlc2lhbihkaXN0YW5jZSwgbW92ZVRvLCBhc05ld0Nvb3JkID0gdHJ1ZSkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICAgICAvL1BvbGFya29vcmRpbmF0ZW4tS29udmVyc2lvblxyXG4gICAgICAgIGxldCB4ID0gTWF0aC5jb3MobW92ZVRvKSAqIGRpc3RhbmNlO1xyXG4gICAgICAgIGxldCB5ID0gTWF0aC5zaW4obW92ZVRvKSAqIGRpc3RhbmNlO1xyXG4gICAgICAgIC8vIHJ1bmRlblxyXG4gICAgICAgIHggPSBNYXRoLnJvdW5kKHggKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIHkgPSBNYXRoLnJvdW5kKHkgKiAxMDApIC8gMTAwO1xyXG5cclxuICAgICAgICByZXR1cm4gYXNOZXdDb29yZCA/IG5ldyBDb29yZCh4LCB5KSA6IHt4OiB4LCB5OiB5fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdyYWQgaW4gcmFkXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkZWcycmFkKGRlZykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBkZWcgKiAoTWF0aC5QSSAvIDE4MClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJhZCBpbiBHcmFkXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByYWQyZGVnKHJhZCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiByYWQgKiAoMTgwIC8gTWF0aC5QSSlcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IENvb3JkOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE0LjA1LjIwMTVcclxuICogVGltZTogMTg6MDhcclxuICovXHJcblxyXG5jb25zdCBSQVRJTyA9IDAuNjY2NjY2O1xyXG5jb25zdCBSRUZSRVNIX1JBVEVfTVMgPSAzMDtcclxuY29uc3QgVkVSVF9VTklUUyA9IDEwMDA7XHJcbmNvbnN0IEhPUlpfVU5JVFMgPSBWRVJUX1VOSVRTICogUkFUSU87XHJcbmNvbnN0IFZFQ19CT1RUT01fVE9QID0gTWF0aC5QSTsgLy9yYWRcclxuY29uc3QgVkVDX0xFRlRfUklHSFQgPSBNYXRoLlBJICogMC41OyAvLyByYWRcclxuY29uc3QgU1BFRURfSU5DUkVBU0VfU1RFUCA9IDI7XHJcblxyXG5sZXQgc2luZ2xldG9uID0gU3ltYm9sKCk7XHJcbmxldCBzaW5nbGV0b25FbmZvcmNlciA9IFN5bWJvbCgpO1xyXG5cclxuLyoqXHJcbiAqIFNwaWVsZmVsZFxyXG4gKiBTZWl0ZW4gbcO8c3NlbiBpbSBWZXJow6RsdG5pcyAzOjIgYW5nZWxlZ3Qgd2VyZGVuXHJcbiAqIEBsaW5rOiBodHRwOi8vdHVyZi5taXNzb3VyaS5lZHUvc3RhdC9pbWFnZXMvZmllbGQvZGltaG9ja2V5LmdpZlxyXG4gKlxyXG4gKi9cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IoZW5mb3JjZXIpIHtcclxuXHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgaWYgKGVuZm9yY2VyICE9IHNpbmdsZXRvbkVuZm9yY2VyKSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiQ2Fubm90IGNvbnN0cnVjdCBzaW5nbGV0b25cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuX2luaXRpYWxHYW1lT2JqZWN0U3BlY3MgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5fSUQgPSBcImZpZWxkXCI7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fZmllbGRIVE1MID0gJChcIjxzZWN0aW9uIGlkPVxcXCJmaWVsZFxcXCI+XCIpO1xyXG4gICAgICAgIHRoaXMuX3BsYXlJbnN0YW5jZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShcclxuICAgICAgICAgICAgJC50aHJvdHRsZShSRUZSRVNIX1JBVEVfTVMsICgpPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTcGllbGZlbGQgc29sbHRlIG51ciBlaW5lIEluc3Rhbnogc2VpblxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXNbc2luZ2xldG9uXSA9IG5ldyBGaWVsZChzaW5nbGV0b25FbmZvcmNlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW3NpbmdsZXRvbl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXYW5kZWwgRGFyc3RlbGx1bmdzZWluaGVpdGVuIGluIFBpeGVsIHVtXHJcbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9IHVuaXRcclxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdW5pdHMycGl4ZWwodW5pdCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdW5pdCAhPT0gXCJudW1iZXJcIiAmJiAodHlwZW9mIHVuaXQgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4odW5pdC55KSB8fCBpc05hTih1bml0LngpKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0czJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuaXQgLyBIT1JaX1VOSVRTICogZmllbGQud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZlcnRVbml0UmF0aW8gPSB1bml0LnkgLyBWRVJUX1VOSVRTO1xyXG4gICAgICAgICAgICBsZXQgaG9yVW5pdFJhdGlvID0gdW5pdC54IC8gSE9SWl9VTklUUztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiBmaWVsZC53aWR0aCAqIGhvclVuaXRSYXRpbyxcclxuICAgICAgICAgICAgICAgIHk6IGZpZWxkLmhlaWdodCAqIHZlcnRVbml0UmF0aW9cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXYW5kZWx0IFBpZWwgaW4gRGFyc3RlbGx1bmdzZWluaGVpdGVuIHVtXHJcbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9IHBpeGVsXHJcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBpeGVsMnVuaXRzKHBpeGVsKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCAhPT0gXCJudW1iZXJcIiAmJiAodHlwZW9mIHBpeGVsICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHBpeGVsLnkpIHx8IGlzTmFOKHBpeGVsLngpKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXhlbCAvIGZpZWxkLndpZHRoICogSE9SWl9VTklUUztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaGVpZ2h0UmF0aW8gPSBwaXhlbC55IC8gZmllbGQuaGVpZ2h0O1xyXG4gICAgICAgICAgICBsZXQgd2lkdGhSYXRpbyA9IHBpeGVsLnggLyBmaWVsZC53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB4OiB3aWR0aFJhdGlvICogSE9SWl9VTklUUyxcclxuICAgICAgICAgICAgICAgIHk6IGhlaWdodFJhdGlvICogVkVSVF9VTklUU1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEjDtmhlIGluIFVuaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IHVuaXRIZWlnaHQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIFZFUlRfVU5JVFM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXZWl0ZSBpbiBVbml0c1xyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCB1bml0V2lkdGgoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIEhPUlpfVU5JVFM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBa3R1YWxpc2llcnVuZ3NyYXRlIGRlcyBTcGllbGZlbGRzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgcmVmcmVzaFJhdGUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIFJFRlJFU0hfUkFURV9NUztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlaXRlIGluIFBpeGVsXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSMO2aGUgaW4gUGl4ZWxcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgcmVwcsOkc2VudGF0aXZlcyBET00tRWxlbWVudCBhbHMgSnF1ZXJ5XHJcbiAgICAgKiBAcmV0dXJucyB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldCBodG1sKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWVsZEhUTUw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXJlY2huZXQgZGllIEJyZWl0ZSBkZXMgRmVsZGVzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfY2FsY1JhdGlvU2l6ZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAkKFwiYm9keVwiKS5oZWlnaHQoKTtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHRoaXMuX2hlaWdodCAqIFJBVElPO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGxhdHppZXJ0IGRhcyBGZWxkIGltIEJyb3dzZXJcclxuICAgICAqL1xyXG4gICAgYnVpbGQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xyXG4gICAgICAgIC8vRW50ZmVybmUgYWx0ZXMgU3BpZWxmZWxkXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpZWxkSFRNTCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fSUQpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuX2ZpZWxkSFRNTCk7XHJcbiAgICAgICAgdGhpcy5fZmllbGRIVE1MLmNzcyh7XHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgICAgIG1hcmdpbkxlZnQ6IHRoaXMuX3dpZHRoICogLS41IC8vNCBjZW50ZXItYWxpZ25tZW50XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmZvckVhY2goKGUpPT4ge1xyXG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fSUQpLmFwcGVuZChlLmh0bWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogWmVpY2huZXQgYWxsZSBHYW1lb2JqZWN0cyBlaW5cclxuICAgICAqL1xyXG4gICAgcGxheSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9wbGF5SW5zdGFuY2UgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCk9PiB7XHJcbiAgICAgICAgICAgIC8vQmVyZWNobmUgUG9zaXRpb24gYWxsZXIgT2JqZWt0ZVxyXG4gICAgICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcclxuICAgICAgICAgICAgICAgIGUuY2FsY1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmRldGVjdEdvYWxDb2xsaXNpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5zb2x2ZVB1Y2tCb3JkZXJDb2xsaXNpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc29sdmVCYXR0ZXJDb2xsaXNpb25zKCk7XHJcblxyXG4gICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcihcImdhbWU6dGlja1wiKTtcclxuXHJcbiAgICAgICAgfSwgUkVGUkVTSF9SQVRFX01TKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3BwdCBTcGllbFxyXG4gICAgICovXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuX3BsYXlJbnN0YW5jZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR6dCBTcGllbGVsZW1lbnRlIGF1ZiBBdXNnYW5nc3p1c3RhbmQgenVyw7xja1xyXG4gICAgICovXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgcHVjayA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcInB1Y2tcIik7XHJcbiAgICAgICAgcHVjay5zcGVlZCA9IDA7XHJcbiAgICAgICAgcHVjay5yZXNldFNjb3JlKCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XHJcbiAgICAgICAgICAgIGUuY29vcmQudW5pdCA9IHRoaXMuX2luaXRpYWxHYW1lT2JqZWN0U3BlY3MuZ2V0KGUuSUQpLnBvcztcclxuICAgICAgICAgICAgZS5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRsO8Z3QgbmV1ZSBTcGllbGVsZW1lbnRlIGhpbnp1XHJcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdFxyXG4gICAgICovXHJcbiAgICBkZXBsb3lHYW1lT2JqZWN0KGdhbWVPYmplY3QpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcblxyXG4gICAgICAgIGlmICghZ2FtZU9iamVjdCBpbnN0YW5jZW9mIEdhbWVPYmplY3QpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhIGdhbWVvYmplY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnYW1lT2JqZWN0LnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuc2V0KGdhbWVPYmplY3QuSUQsIGdhbWVPYmplY3QpO1xyXG4gICAgICAgIHRoaXMuX2luaXRpYWxHYW1lT2JqZWN0U3BlY3Muc2V0KGdhbWVPYmplY3QuSUQsIHtcclxuICAgICAgICAgICAgcG9zOiB7XHJcbiAgICAgICAgICAgICAgICB4OiBnYW1lT2JqZWN0LmNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgICAgIHk6IGdhbWVPYmplY3QuY29vcmQudW5pdC55XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEzDtnN0IFdhbmRrb2xsaXNpb25lbiBhdWZcclxuICAgICAqL1xyXG4gICAgc29sdmVQdWNrQm9yZGVyQ29sbGlzaW9ucygpIHtcclxuICAgICAgICBsZXQgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuICAgICAgICBsZXQgUHVjayA9IHJlcXVpcmUoXCIuL1B1Y2tcIik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fZ2FtZU9iamVjdHMuaGFzKFwicHVja1wiKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBQdWNrIGF0IEdhbWUhXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHVjayA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcInB1Y2tcIik7XHJcblxyXG4gICAgICAgIGlmICghcHVjayBpbnN0YW5jZW9mIFB1Y2spIHsgLy9rb3JyZWt0ZSBJbnN0YW56XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVQb3MgPSBwdWNrLmNvb3JkLnVuaXQ7XHJcbiAgICAgICAgbGV0IGVTaXplID0gcHVjay5zaXplLnVuaXQ7XHJcbiAgICAgICAgdmFyIHdhbGxEaXJlY3Rpb247XHJcblxyXG4gICAgICAgIC8vUmlnaHQgYm9yZGVyXHJcbiAgICAgICAgaWYgKGVQb3MueCArIGVTaXplLnggPiBIT1JaX1VOSVRTKSB7XHJcbiAgICAgICAgICAgIHB1Y2suY29vcmQudW5pdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IEhPUlpfVU5JVFMgLSBwdWNrLnNpemUudW5pdC54LFxyXG4gICAgICAgICAgICAgICAgeTogcHVjay5jb29yZC51bml0LnlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2FsbERpcmVjdGlvbiA9IFZFQ19MRUZUX1JJR0hUO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIC8vIExlZnQgYm9yZGVyP1xyXG4gICAgICAgIGlmIChlUG9zLnggPCAwKSB7XHJcbiAgICAgICAgICAgIHB1Y2suY29vcmQudW5pdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgICAgICB5OiBwdWNrLmNvb3JkLnVuaXQueVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3YWxsRGlyZWN0aW9uID0gVkVDX0xFRlRfUklHSFQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0JvdHRvbSBib3JkZXI/XHJcbiAgICAgICAgaWYgKGVQb3MueSArIGVTaXplLnkgPiBWRVJUX1VOSVRTKSB7XHJcbiAgICAgICAgICAgIHB1Y2suY29vcmQudW5pdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IHB1Y2suY29vcmQudW5pdC54LFxyXG4gICAgICAgICAgICAgICAgeTogVkVSVF9VTklUUyAtIHB1Y2suc2l6ZS51bml0LnlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2FsbERpcmVjdGlvbiA9IFZFQ19CT1RUT01fVE9QO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIC8vVG9wIGJvcmRlcj9cclxuICAgICAgICBpZiAoZVBvcy55IDwgMCkge1xyXG4gICAgICAgICAgICBwdWNrLmNvb3JkLnVuaXQgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBwdWNrLmNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgICAgIHk6IDBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgd2FsbERpcmVjdGlvbiA9IFZFQ19CT1RUT01fVE9QO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdhbGxEaXJlY3Rpb24gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHB1Y2subW92ZVRvID0gRmllbGQuY29sbGlzaW9uRGlyZWN0aW9uKHB1Y2subW92ZVRvLCB3YWxsRGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgcHVjay5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEzDtnN0IFNjaGzDpGdlci1Lb2xsaXNpb25lbiBhdWZcclxuICAgICAqL1xyXG4gICAgc29sdmVCYXR0ZXJDb2xsaXNpb25zKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuICAgICAgICB2YXIgQmF0dGVyID0gcmVxdWlyZShcIi4vQmF0dGVyXCIpO1xyXG4gICAgICAgIHZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5cclxuICAgICAgICBsZXQgcHVjayA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcInB1Y2tcIik7XHJcblxyXG4gICAgICAgIGxldCBiYXR0ZXJzID0gW107XHJcbiAgICAgICAgbGV0IGJhdHRlckJvdHRvbSA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcImJhdHRlci1ib3R0b21cIik7XHJcbiAgICAgICAgbGV0IGJhdHRlclRvcCA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcImJhdHRlci10b3BcIik7XHJcblxyXG4gICAgICAgIGlmIChiYXR0ZXJCb3R0b20gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBiYXR0ZXJzLnB1c2goYmF0dGVyQm90dG9tKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYmF0dGVyVG9wICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYmF0dGVycy5wdXNoKGJhdHRlclRvcClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhdHRlcnMuZm9yRWFjaCgoZSk9PiB7XHJcbiAgICAgICAgICAgIGxldCB4RGlzdCA9IGUuY2VudGVyQ29vcmQudW5pdC54IC0gcHVjay5jZW50ZXJDb29yZC51bml0Lng7XHJcbiAgICAgICAgICAgIGxldCB5RGlzdCA9IGUuY2VudGVyQ29vcmQudW5pdC55IC0gcHVjay5jZW50ZXJDb29yZC51bml0Lnk7XHJcbiAgICAgICAgICAgIGxldCBwb2xhckNvb3JkID0gQ29vcmQuY2FydGVzaWFuVG9Qb2xhcih4RGlzdCwgeURpc3QpO1xyXG4gICAgICAgICAgICBsZXQgcmFkaXVzU3VtID0gUHVjay5yYWRpdXMgKyBCYXR0ZXIucmFkaXVzO1xyXG4gICAgICAgICAgICAvL0JvdW5jZWQhXHJcbiAgICAgICAgICAgIGlmIChwb2xhckNvb3JkLmRpc3RhbmNlIDwgcmFkaXVzU3VtKSB7XHJcbiAgICAgICAgICAgICAgICAvL1NjaGllYmUgUHVjayBhbiBSYW5kIHZvbiBCYXR0ZXJcclxuICAgICAgICAgICAgICAgIHBvbGFyQ29vcmQuZGlzdGFuY2UgLT0gcmFkaXVzU3VtO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJhdHRlckJvcmRlckNvb3JkID0gQ29vcmQucG9sYXJUb0NhcnRlc2lhbihwb2xhckNvb3JkLmRpc3RhbmNlLCBwb2xhckNvb3JkLmFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIHB1Y2suY29vcmQuYWRkKGJhdHRlckJvcmRlckNvb3JkKTtcclxuICAgICAgICAgICAgICAgIHB1Y2suc2V0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIC8vRHJlaGUgdW0gMTgwwrAgenVtIHplbnRydW1cclxuICAgICAgICAgICAgICAgIHB1Y2subW92ZVRvID0gKHBvbGFyQ29vcmQuYW5nbGUgKyBNYXRoLlBJKSAlICgyICogTWF0aC5QSSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcHVjay5zcGVlZCArPSBTUEVFRF9JTkNSRUFTRV9TVEVQO1xyXG4gICAgICAgICAgICAgICAgcHVjay5hZGRTY29yZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKFwiUHVjayBpc3QgbnVuIFwiICsgcHVjay5zY29yZSArIFwiIHdlcnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBBdXN0cml0dHN3aW5rZWxcclxuICAgICAqIEBwYXJhbSBvcmlnaW5BbmdsZVxyXG4gICAgICogQHBhcmFtIGNvbGxpZGluZ0FuZ2xlXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWQgZGVzIG5ldWVuIFdpbmtlbHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbGxpc2lvbkRpcmVjdGlvbihvcmlnaW5BbmdsZSwgY29sbGlkaW5nQW5nbGUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgZnVsbENpcmNsZVJhZCA9IDIgKiBNYXRoLlBJO1xyXG4gICAgICAgIHJldHVybiAoZnVsbENpcmNsZVJhZCArIG9yaWdpbkFuZ2xlICsgMiAqIGNvbGxpZGluZ0FuZ2xlIC0gMiAqIG9yaWdpbkFuZ2xlKSAlIGZ1bGxDaXJjbGVSYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFcmtlbm5lIFRvclxyXG4gICAgICovXHJcbiAgICBkZXRlY3RHb2FsQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGxldCBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuICAgICAgICBsZXQgcHVjayA9IHRoaXMuX2dhbWVPYmplY3RzLmdldChcInB1Y2tcIik7XHJcblxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwiZ29hbC10b3BcIiksXHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmdldChcImdvYWwtYm90dG9tXCIpXHJcbiAgICAgICAgXS5mb3JFYWNoKFxyXG4gICAgICAgICAgICAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IGUuY29vcmQudW5pdC54O1xyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IHN0YXJ0ICsgZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIC8vT2JlcmVzIFRvclxyXG4gICAgICAgICAgICAgICAgaWYgKHB1Y2suY29vcmQudW5pdC55IDw9IDBcclxuICAgICAgICAgICAgICAgICAgICAmJiBwdWNrLmNvb3JkLnVuaXQueCAtIFB1Y2sucmFkaXVzIC8gMiA+IHN0YXJ0XHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcHVjay5jb29yZC51bml0LnggKyBQdWNrLnJhZGl1cyAvIDIgPCBlbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcihcImdhbWU6Z29hbFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjogXCJ0b3BcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IHB1Y2suc2NvcmVcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgocHVjay5jb29yZC51bml0LnkgKyAyICogUHVjay5yYWRpdXMpID49IFZFUlRfVU5JVFMgLSBQdWNrLnJhZGl1c1xyXG4gICAgICAgICAgICAgICAgICAgICYmIHB1Y2suY29vcmQudW5pdC54IC0gUHVjay5yYWRpdXMgLyAyID4gc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICAmJiBwdWNrLmNvb3JkLnVuaXQueCArIFB1Y2sucmFkaXVzIC8gMiA8IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKFwiZ2FtZTpnb2FsXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyOiBcImJvdHRvbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogcHVjay5zY29yZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7IiwibGV0IENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcblxyXG5jbGFzcyBHYW1lT2JqZWN0IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGlkIElEIHVtIEVsZW1lbnQgaW0gRE9NIHp1IG1hcmtpZXJlbiB1bmQgT2JqZWt0IHp1IHZlcmdsZWljaGVuXHJcbiAgICAgKiBAcGFyYW0gaHRtbCBKcXVlcnktSFRNTC1lbGVtZW50XHJcbiAgICAgKiBAcGFyYW0geFNpemUgVU5JVFNcclxuICAgICAqIEBwYXJhbSB5U2l6ZSBVTklUU1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgaHRtbCwgeFNpemUsIHlTaXplKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fY29vcmQgPSBuZXcgQ29vcmQoKTtcclxuICAgICAgICB0aGlzLl9zaXplID0gbmV3IENvb3JkKHhTaXplLCB5U2l6ZSk7XHJcbiAgICAgICAgLy9Lb25rcmV0ZXIgSW5zdGFuei1OYW1lXHJcbiAgICAgICAgdGhpcy5fSUQgPSBpZDtcclxuICAgICAgICAvL0Jhc2lzLUtsYXNzZSB3aXJkIGFscyBEYXRlbi1UeXAgZsO8ciBWYWxpZGllcnVuZyB2ZXJ3ZW5kZXRcclxuICAgICAgICB0aGlzLl9odG1sID0gaHRtbC5hdHRyKFwiaWRcIiwgaWQpO1xyXG4gICAgICAgIHRoaXMuX21vdmVUbyA9IDA7XHJcbiAgICAgICAgdGhpcy5fc3BlZWQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR3LDtsOfZSBkZXMgR2FtZS1PYmpla3RzXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2lua2VsIGRlciBCZXdlZ3VuZ3NyaWNodHVuZyBpbiByYWQhISEhIVxyXG4gICAgICogQHJldHVybnMge251bWJlcn0gV2lua2VsIGluIHJhZCFcclxuICAgICAqL1xyXG4gICAgZ2V0IG1vdmVUbygpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW92ZVRvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2lua2VsLCBkZXIgQmV3ZWd1bmdzcmljaHR1bmcgaW4gcmFkXHJcbiAgICAgKiAwwrAgPT0gcmVjaHQsIDkwwrAgPT0gdW50ZW5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZVxyXG4gICAgICovXHJcbiAgICBzZXQgbW92ZVRvKGFuZ2xlKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fbW92ZVRvID0gYW5nbGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGllIHJlcMOkc2VudGF0aXZlIElEIGVpbmVzIGplZGVuIE9iamVjdHNcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldCBJRCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fSUQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaWUgS29vcmRpbmF0ZW4gZWluZXMgamVkZW4gR2FtZU9iamVjdHNcclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgZ2V0IGNvb3JkKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb29yZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHp0IEtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcGFyYW0ge0Nvb3JkfSBjb29yZFxyXG4gICAgICovXHJcbiAgICBzZXQgY29vcmQoY29vcmQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9jb29yZCA9IGNvb3JkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGFzIHJlcHLDpHNlbnRhdGl2ZSBET00tRWxlbWVudFxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKi9cclxuICAgIGdldCBodG1sKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9odG1sO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBkaWUgR2VzY2h3aW5kaWdrZWl0IGluIFgvWS1Lb21wb25lbnRlXHJcbiAgICAgKi9cclxuICAgIGdldCBzcGVlZEFzQ29vcmQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcbiAgICAgICAgcmV0dXJuIENvb3JkLnBvbGFyVG9DYXJ0ZXNpYW4odGhpcy5fc3BlZWQsIHRoaXMuX21vdmVUbyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXNjaHdpbmRpZ2tlaXQvenVyw7xja2dlbGVndGUgRGlzdGFueiBqZSBUaWNrXHJcbiAgICAgKiBAcmV0dXJucyB7aW50fVxyXG4gICAgICovXHJcbiAgICBnZXQgc3BlZWQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwZWVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VzY2h3aW5kaWdrZWl0L3p1csO8Y2tnZWxlZ3RlIERpc3RhbnogamUgVGlja1xyXG4gICAgICogQHBhcmFtIHtpbnR9IHNwZWVkVmFsdWVcclxuICAgICAqL1xyXG4gICAgc2V0IHNwZWVkKHNwZWVkVmFsdWUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHNwZWVkVmFsdWUgIT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJNdXN0IGJlIGEgaW50ZWdlclwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zcGVlZCA9IHNwZWVkVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXdlZ3QgR2FtZW9iamVjdCBhbiBQb3NpdGlvblxyXG4gICAgICogQGxpbmsgaHR0cDovL2pzcGVyZi5jb20vdHJhbnNsYXRlM2QtdnMteHkvMjhcclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgbGV0IGRvbW9iamVjdCA9IHRoaXMuX2h0bWxbMF07XHJcbiAgICAgICAgZG9tb2JqZWN0LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyB0aGlzLl9jb29yZC5waXhlbC54ICsgXCJweCxcIiArIHRoaXMuX2Nvb3JkLnBpeGVsLnkgKyBcInB4LDApXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXJlY2huZXQgZGllIG7DpGNoc3RlIFBvc2l0aW9uIGRlcyBHYW1lT2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBjYWxjUG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5jb29yZC5hZGQodGhpcy5zcGVlZEFzQ29vcmQpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZU9iamVjdDsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXJrbyBHcmdpYyBvbiAyOC4wNS4yMDE1LlxyXG4gKi9cclxudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuXHJcbmNvbnN0IEdPQUxfSEVJR0hUID0gRmllbGQudW5pdEhlaWdodCAvIDIwO1xyXG5jb25zdCBHT0FMX1dJRFRIID0gRmllbGQudW5pdFdpZHRoIC8gNDtcclxuXHJcblxyXG5jbGFzcyBHb2FsIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihmYWNpbmcpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlcihcImdvYWwtXCIgKyBmYWNpbmcsICQoJzxzcGFuIGNsYXNzPVwiZ29hbHNcIi8+JyksIEdPQUxfV0lEVEgsIEdPQUxfSEVJR0hUKTtcclxuICAgICAgICB0aGlzLl9mYWNpbmcgPSBmYWNpbmc7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCAoKT0+IHtcclxuICAgICAgICAgICAgc3VwZXIuc2l6ZS5yZWZyZXNoRnJvbVVuaXRzKCk7XHJcblxyXG4gICAgICAgICAgICBzdXBlci5odG1sLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogc3VwZXIuc2l6ZS5waXhlbC54LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzdXBlci5zaXplLnBpeGVsLnlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbGNQb3NpdGlvbigpO1xyXG4gICAgICAgIH0pLnRyaWdnZXIoXCJyZXNpemVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBwb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBUT1A6IFwidG9wXCIsXHJcbiAgICAgICAgICAgIEJPVFRPTTogXCJib3R0b21cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemUudW5pdC54XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2l6ZS51bml0Lnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCZXJlY2huZXQgUG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgY2FsY1Bvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLmNhbGNQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR29hbDsiLCIvKipcclxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XHJcbiAqIFRpbWU6IDE1OjI2XHJcbiAqL1xyXG5cclxudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuY29uc3QgVkVMT0NJVFkgPSAtMC41OyAvL2dnZi4gc3DDpHRlciBhdXN0YXVzY2hlbiBnZWdlbiBGdW5rdGlvbiBmKHQpXHJcbmNvbnN0IFBVQ0tfUkFESVVTX1VOSVRTID0gMTY7XHJcbmNvbnN0IFNDT1JFX1NUQVJUID0gNTA7XHJcbmNvbnN0IFNDT1JFX1NURVAgPSAyNTtcclxuXHJcbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlcihcInB1Y2tcIiwgJChcIjxiIC8+XCIpLCBQVUNLX1JBRElVU19VTklUUyAqIDIsIFBVQ0tfUkFESVVTX1VOSVRTICogMik7XHJcblxyXG4gICAgICAgIHRoaXMuX3Njb3JlID0gNTA7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsICgpPT4ge1xyXG5cclxuICAgICAgICAgICAgc3VwZXIuc2l6ZS5yZWZyZXNoRnJvbVVuaXRzKCk7XHJcblxyXG4gICAgICAgICAgICBzdXBlci5odG1sLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogc3VwZXIuc2l6ZS5waXhlbC54LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzdXBlci5zaXplLnBpeGVsLnlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkudHJpZ2dlcihcInJlc2l6ZVwiKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IFB1bmt0ZXN0YW5kXHJcbiAgICAgKi9cclxuICAgIGdldCBzY29yZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFcmjDtmh0IFB1bmt0ZXN0YW5kXHJcbiAgICAgKi9cclxuICAgIGFkZFNjb3JlKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3Njb3JlICs9IFNDT1JFX1NURVA7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRTY29yZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9zY29yZSA9IFNDT1JFX1NUQVJUO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBQdWNrLVJhZGl1cyBpbiB1bml0c1xyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCByYWRpdXMoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIFBVQ0tfUkFESVVTX1VOSVRTO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBNaXR0ZWxwdW5rdC1Lb29yZGluYXRlblxyXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxyXG4gICAgICovXHJcbiAgICBnZXQgY2VudGVyQ29vcmQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvb3JkLmNsb25lKCkuYWRkKFxyXG4gICAgICAgICAgICBuZXcgQ29vcmQoUFVDS19SQURJVVNfVU5JVFMsIFBVQ0tfUkFESVVTX1VOSVRTKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHp0IFB1Y2sgYXVmIFBvc2l0aW9uXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLnNldFBvc2l0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBQb3NpdGlvbiB1bnMgc2V0enQgT2JqZWN0IGFuc2NobGllw59lbmQgYW4gUG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgY2FsY1Bvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyLmNhbGNQb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFB1Y2s7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAzMS4wNS4yMDE1XG4gKiBUaW1lOiAyMDowM1xuICovXG5cbmxldCBzaW5nbGV0b24gPSBTeW1ib2woKTtcbmxldCBzaW5nbGV0b25FbmZvcmNlciA9IFN5bWJvbCgpO1xuXG5jbGFzcyBTb2NrZXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihlbmZvcmNlcikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGVuZm9yY2VyICE9IHNpbmdsZXRvbkVuZm9yY2VyKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbm5vdCBjb25zdHJ1Y3Qgc2luZ2xldG9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RhcnRDQiA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0b3BDQiA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvLmNvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKFwiZ2FtZTpzdGFydFwiLCAoKT0+IHtcbiAgICAgICAgICAgICQoXCIubW9kYWxcIikuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRDQigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBkaWUgU3RhcnQtRnVua3Rpb24gdW0gZGFzIFNwaWVsIHp1IGJlZ2lubmVuXG4gICAgICogQHBhcmFtIGZ1bmNcbiAgICAgKi9cbiAgICBzZXQgc3RhcnRnYW1lQ2FsbGJhY2soZnVuYykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3N0IGJlIGEgRnVuY3Rpb24tcmVmZXJlbnpcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGFydENCID0gZnVuYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBkaWUgU3RvcC1GdW5rdGlvbiB1bSBkYXMgU3BpZWwgenUgc3RvcHBlblxuICAgICAqIEBwYXJhbSBmdW5jXG4gICAgICovXG4gICAgc2V0IHN0b3BnYW1lQ2FsbGJhY2soZnVuYykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3N0IGJlIGEgRnVuY3Rpb24tcmVmZXJlbnpcIilcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdG9wQ0IgPSBmdW5jO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzW3NpbmdsZXRvbl0gPSBuZXcgU29ja2V0TWFuYWdlcihzaW5nbGV0b25FbmZvcmNlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbc2luZ2xldG9uXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOZXVlbiBTcGllbGVyIGFtIFNlcnZlciBhbm1lbGRlblxuICAgICAqIEBwYXJhbSBwbGF5ZXJuYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICAgKi9cbiAgICBuZXdQbGF5ZXIocGxheWVybmFtZSwgY2IpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KFwicGxheWVyOm5ld1wiLCB7bmFtZTogcGxheWVybmFtZX0sIChyZXMpPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHJlcy5zdGF0dXMpO1xuICAgICAgICAgICAgY2IocmVzKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFcnpldWd0IG5ldWUgU1BpZWwtSW5zdGFuelxuICAgICAqIEBwYXJhbSBjYlxuICAgICAqL1xuICAgIHBsYXllckFtb3VudChjYikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVtaXQoXCJwbGF5ZXI6YW1vdW50XCIsIHt9LCAocmVzKT0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhyZXMuc3RhdHVzKTtcbiAgICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxubW9kdWxlLmV4cG9ydHMgPSBTb2NrZXRNYW5hZ2VyOyIsIi8vTm90IHVzZWQgYW55bW9yZVxyXG4vL3JlcXVpcmUoXCIuL19fdGVjaGRlbW9cIik7XHJcblxyXG5cclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxudmFyIEJhdHRlciA9IHJlcXVpcmUoXCIuL0JhdHRlclwiKTtcclxudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcbnZhciBTb2NrZXRNYW5hZ2VyID0gcmVxdWlyZShcIi4vU29ja2V0TWFuYWdlclwiKTtcclxudmFyIEdvYWwgPSByZXF1aXJlKFwiLi9Hb2FsXCIpO1xyXG52YXIgbW9kYWxGb3JtTG9naWMgPSByZXF1aXJlKFwiLi9tb2RhbEZvcm1Mb2dpY1wiKTtcclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAvL1plaWNobmUgU3BpZWxmZWxkXHJcbiAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcclxuICAgIGxldCBwdWNrID0gbmV3IFB1Y2soKTtcclxuXHJcbiAgICAvL1N0YXJ0Y29vcmRzXHJcbiAgICBwdWNrLmNvb3JkID0gbmV3IENvb3JkKEZpZWxkLnVuaXRXaWR0aCAvIDIgLSBQdWNrLnJhZGl1cywgRmllbGQudW5pdEhlaWdodCAvIDIpO1xyXG4gICAgLy9TdGFydFNwZWVkXHJcbiAgICBwdWNrLnNwZWVkID0gMDtcclxuICAgIHB1Y2subW92ZVRvID0gMDtcclxuXHJcbiAgICBsZXQgZ29hbFRvcCA9IG5ldyBHb2FsKEdvYWwucG9zaXRpb24uVE9QKTtcclxuICAgIGxldCBnb2FsQm90dG9tID0gbmV3IEdvYWwoR29hbC5wb3NpdGlvbi5CT1RUT00pO1xyXG5cclxuICAgIC8vU3RhcnRjb29yZHNcclxuICAgIGdvYWxUb3AuY29vcmQgPSBuZXcgQ29vcmQoKEZpZWxkLnVuaXRXaWR0aCAvIDQpICogMS41LCAwIC0gKGdvYWxUb3Auc2l6ZS51bml0LnkgLyAyKSk7XHJcbiAgICBnb2FsQm90dG9tLmNvb3JkID0gbmV3IENvb3JkKChGaWVsZC51bml0V2lkdGggLyA0KSAqIDEuNSwgRmllbGQudW5pdEhlaWdodCAtIChnb2FsQm90dG9tLnNpemUudW5pdC55IC8gMikpO1xyXG4gICAgbW9kYWxGb3JtTG9naWMuY2hlY2tQbGF5ZXJBbW91bnQoKTtcclxuICAgIG1vZGFsRm9ybUxvZ2ljLnN0YXJ0dXAoKTtcclxuXHJcbiAgICBTb2NrZXRNYW5hZ2VyLmluc3RhbmNlLnN0YXJ0Z2FtZUNhbGxiYWNrID0gKGZhY2luZyk9PiB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgbGV0IHBsYXllclRvcCA9IG5ldyBCYXR0ZXIoQmF0dGVyLnBvc2l0aW9uLlRPUCk7XHJcbiAgICAgICAgbGV0IHBsYXllckJvdHRvbSA9IG5ldyBCYXR0ZXIoQmF0dGVyLnBvc2l0aW9uLkJPVFRPTSk7XHJcbiAgICAgICAgcGxheWVyVG9wLmNvb3JkID0gbmV3IENvb3JkKEZpZWxkLnVuaXRXaWR0aCAvIDIgLSBCYXR0ZXIucmFkaXVzLCBGaWVsZC51bml0SGVpZ2h0IC8gNCk7XHJcbiAgICAgICAgcGxheWVyQm90dG9tLmNvb3JkID0gbmV3IENvb3JkKEZpZWxkLnVuaXRXaWR0aCAvIDIgLSBCYXR0ZXIucmFkaXVzLCAzICogKEZpZWxkLnVuaXRIZWlnaHQgLyA0KSk7XHJcbiAgICAgICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XHJcbiAgICAgICAgLy8gRGVwbG95IGdhbWUgb2JqZWN0cyBhbmQgc3RhcnRcclxuICAgICAgICBmaWVsZC5kZXBsb3lHYW1lT2JqZWN0KGdvYWxUb3ApO1xyXG4gICAgICAgIGZpZWxkLmRlcGxveUdhbWVPYmplY3QoZ29hbEJvdHRvbSk7XHJcbiAgICAgICAgLy9maWVsZC5kZXBsb3lHYW1lT2JqZWN0KHBsYXllclRvcCk7XHJcbiAgICAgICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwbGF5ZXJCb3R0b20pO1xyXG4gICAgICAgIGZpZWxkLmRlcGxveUdhbWVPYmplY3QocHVjayk7XHJcbiAgICAgICAgZmllbGQuYnVpbGQoKTtcclxuICAgICAgICBmaWVsZC5wbGF5KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFNvY2tldE1hbmFnZXIuaW5zdGFuY2Uuc3RvcGdhbWVDYWxsYmFjayA9ICgpPT4ge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIEZpZWxkLmluc3RhbmNlLnN0b3AoKTtcclxuICAgIH07XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKFwiZ2FtZTpnb2FsXCIsIChldmVudCwgZGF0YSk9PiB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUT09PUlwiLCBkYXRhKTtcclxuICAgICAgICBmaWVsZC5yZXNldCgpO1xyXG4gICAgICAgIGZpZWxkLnBsYXkoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vU2hhZG93LUFuaW1hdGlvblxyXG4gICAgLy8kKHdpbmRvdykub24oXCJnYW1lOnRpY2tcIiwgKCk9PiB7XHJcbiAgICAvLyAgICAkLmZuLnJlYWxzaGFkb3cucmVzZXQoKTtcclxuICAgIC8vICAgIGNvbnNvbGUubG9nKHB1Y2suY29vcmQucGl4ZWwueCArIGZpZWxkLmh0bWwub2Zmc2V0KCkubGVmdCApO1xyXG4gICAgLy8gICAgJCgnLmJhdHRlcnMnKS5yZWFsc2hhZG93KHtcclxuICAgIC8vICAgICAgICBwYWdlWDogcHVjay5jb29yZC5waXhlbC54ICsgZmllbGQuaHRtbC5vZmZzZXQoKS5sZWZ0ICsgZmllbGQuaHRtbC53aWR0aCgpLzIsXHJcbiAgICAvLyAgICAgICAgcGFnZVk6IHB1Y2suY29vcmQucGl4ZWwueSxcclxuICAgIC8vICAgICAgICBjb2xvcjogXCI0MSwyNTUsMjQyXCIsICAgIC8vIHNoYWRvdyBjb2xvciwgcmdiIDAuLjI1NSwgZGVmYXVsdDogJzAsMCwwJ1xyXG4gICAgLy8gICAgICAgIHR5cGU6ICdkcm9wJyAvLyBzaGFkb3cgdHlwZVxyXG4gICAgLy8gICAgfSk7XHJcbiAgICAvL30pO1xyXG5cclxufSk7XHJcblxyXG5cclxuXHJcbiIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMzEuMDUuMjAxNVxuICogVGltZTogMTg6NTdcbiAqL1xudmFyIFNvY2tldE1hbmFnZXIgPSByZXF1aXJlKFwiLi9Tb2NrZXRNYW5hZ2VyXCIpO1xuXG52YXIgbW9kYWxGb3JtTG9naWMgPSB7XG4gICAgc3RhcnR1cDogKCk9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgICQoJyNlbnRlck5hbWVfTW9kYWwnKS5vcGVuTW9kYWwoe1xuICAgICAgICAgICAgcmVhZHk6ICgpPT4ge1xuICAgICAgICAgICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICAgICAgICAgICQoJyNwbGF5ZXJfbmFtZScpLmZvY3VzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzbWlzc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgJChcIiNzdWJtaXRfcGxheWVyX25hbWVfZm9ybVwiKS5vbihcImNsaWNrXCIsIChlKT0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQoXCIjcGxheWVyX25hbWVfZm9ybVwiKS5zdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAkKFwiI3BsYXllcl9uYW1lX2Zvcm1cIikub24oXCJzdWJtaXRcIiwgKGUpPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IHBsYXllck5hbWUgPSAkKFwiI3BsYXllcl9uYW1lXCIpO1xuICAgICAgICAgICAgaWYgKHBsYXllck5hbWUudmFsKCkubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KCdCaXR0ZSBnZWJlbiBTaWUgZWluZW4gTmFtZW4gZWluIScsIDQwMDAsIFwicmVkIGRhcmtlbi0zXCIpO1xuICAgICAgICAgICAgICAgIHBsYXllck5hbWUuYWRkQ2xhc3MoXCJpbnZhbGlkXCIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFNvY2tldE1hbmFnZXIuaW5zdGFuY2UubmV3UGxheWVyKHBsYXllck5hbWUudmFsKCksIChyZXMpPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSBcInBsYXllcjpuYW1lVGFrZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWF0ZXJpYWxpemUudG9hc3QocmVzLm1zZywgNDAwMCwgXCJyZWQgZGFya2VuLTNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJOYW1lLmFkZENsYXNzKFwiaW52YWxpZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSBcInBsYXllcjpva1wiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJChcIiNlbnRlck5hbWVfTW9kYWxcIikuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxGb3JtTG9naWMuY2hlY2tQbGF5ZXJBbW91bnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBjaGVja1BsYXllckFtb3VudDogKGNoZWNrNHdhaXRpbmcgPSBmYWxzZSk9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBTb2NrZXRNYW5hZ2VyLmluc3RhbmNlLnBsYXllckFtb3VudCgocmVzKT0+IHtcblxuICAgICAgICAgICAgaWYgKGNoZWNrNHdhaXRpbmcgJiYgcmVzLnN0YXR1cyA9PT0gXCJwbGF5ZXI6d2FpdGluZ1wiKSB7XG4gICAgICAgICAgICAgICAgJChcIiN3YWl0aW5nX01vZGFsXCIpLm9wZW5Nb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NpYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSBcInBsYXllcjpmdWxsXCIpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3NlcnZlckZ1bGxfTW9kYWxcIikub3Blbk1vZGFsKHtcbiAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2libGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vZGFsRm9ybUxvZ2ljOyJdfQ==
