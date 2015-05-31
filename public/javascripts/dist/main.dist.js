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
//Not used anymore
//require("./__techdemo");

"use strict";

var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");
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
    puck.moveTo = Coord.deg2rad(45); // nach links bitte

    var playerTop = new Batter(Batter.position.TOP);
    var playerBottom = new Batter(Batter.position.BOTTOM);
    var gloalTop = new Goal(Goal.position.TOP);
    var goalBottom = new Goal(Goal.position.BOTTOM);

    //Startcoords
    playerTop.coord = new Coord(Field.unitWidth / 2 - Batter.radius, Field.unitHeight / 4);
    playerBottom.coord = new Coord(Field.unitWidth / 2 - Batter.radius, 3 * (Field.unitHeight / 4));
    gloalTop.coord = new Coord(Field.unitWidth / 4 * 1.5, 0 - gloalTop.size.unit.y / 2);
    goalBottom.coord = new Coord(Field.unitWidth / 4 * 1.5, Field.unitHeight - goalBottom.size.unit.y / 2);

    // Deploy game objects and start
    field.deployGameObject(gloalTop);
    field.deployGameObject(goalBottom);
    //field.deployGameObject(playerTop);
    field.deployGameObject(playerBottom);
    field.deployGameObject(puck);
    field.build();
    field.play();

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
    modalFormLogic();
});

},{"./Batter":1,"./Coord":2,"./Field":3,"./Goal":5,"./Puck":6,"./modalFormLogic":8}],8:[function(require,module,exports){
/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 18:57
 */
"use strict";

module.exports = function () {
    "use strict";

    $("#enterName_Modal").openModal({
        ready: function ready() {
            "use strict";
            $("#player_name").focus();
        }
    });
    $("#submit_player_name_form").on("click", function () {
        $("#player_name_form").submit();
    });

    $("#player_name_form").on("submit", function (e) {
        e.preventDefault();
        var playerName = $("#player_name");
        if (playerName.val().length < 1) {
            Materialize.toast("Bitte geben Sie einen Namen ein!", 4000, "red darken-3");
            playerName.addClass("invalid");
        } else {}
    });
};

},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9CYXR0ZXIuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0dvYWwuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9QdWNrLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvbWFpbi5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL21vZGFsRm9ybUxvZ2ljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FB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LEVBQUUsQ0FBQztDQUNwQixDQUFDLENBQUM7Ozs7Ozs7Ozs7QUMzREgsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFLO0FBQ2xCLGdCQUFZLENBQUM7O0FBRWIsS0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxDQUFDO0FBQzVCLGFBQUssRUFBRSxpQkFBSztBQUNSLHdCQUFZLENBQUM7QUFDYixhQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDN0I7S0FDSixDQUFDLENBQUM7QUFDSCxLQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQUs7QUFDM0MsU0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDbkMsQ0FBQyxDQUFDOztBQUVILEtBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBQyxDQUFDLEVBQUk7QUFDdEMsU0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLFlBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxZQUFJLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzdCLHVCQUFXLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUMzRSxzQkFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUNqQyxNQUFNLEVBRU47S0FDSixDQUFDLENBQUM7Q0FDTixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1hcmtvIEdyZ2ljIG9uIDI4LjA1LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbmNvbnN0IEJBVFRFUl9SQURJVVNfVU5JVFMgPSAzMjtcclxuXHJcbmNsYXNzIEJhdHRlciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG4gICAgY29uc3RydWN0b3IoZmFjaW5nKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIHN1cGVyKFwiYmF0dGVyLVwiICsgZmFjaW5nLCAkKCc8YiBjbGFzcz1cImJhdHRlcnNcIi8+JyksIEJBVFRFUl9SQURJVVNfVU5JVFMgKiAyLCBCQVRURVJfUkFESVVTX1VOSVRTICogMik7XHJcblxyXG4gICAgICAgIHRoaXMuX2ZhY2luZyA9IGZhY2luZztcclxuICAgICAgICB0aGlzLnBpeGVsZWRSYWRpdXMgPSBGaWVsZC51bml0czJwaXhlbChCQVRURVJfUkFESVVTX1VOSVRTKTtcclxuXHJcblxyXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCAoZSk9PiB7XHJcbiAgICAgICAgICAgIHN1cGVyLnNpemUucmVmcmVzaEZyb21Vbml0cygpO1xyXG5cclxuICAgICAgICAgICAgc3VwZXIuaHRtbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHN1cGVyLnNpemUucGl4ZWwueCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogc3VwZXIuc2l6ZS5waXhlbC55XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWxjUG9zaXRpb24oZSk7XHJcbiAgICAgICAgfSkudHJpZ2dlcihcInJlc2l6ZVwiKTtcclxuXHJcbiAgICAgICAgLy9vbiBNb3VzZW1vdmUsIFBvc2l0aW9uIG5ldSBiZXJlY2huZW5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlbW92ZVwiLCAkLnRocm90dGxlKEZpZWxkLnJlZnJlc2hSYXRlLCAoZSk9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY1Bvc2l0aW9uKGUpO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHBvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFRPUDogXCJ0b3BcIixcclxuICAgICAgICAgICAgQk9UVE9NOiBcImJvdHRvbVwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCBSYWRpdXMgaW4gVW5pdHNcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgcmFkaXVzKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBCQVRURVJfUkFESVVTX1VOSVRTXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IGRpZSBQdWNrLWdyw7bDn2VcclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IE1pdHRlbHB1bmt0LUtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBjZW50ZXJDb29yZCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gc3VwZXIuY29vcmQuY2xvbmUoKS5hZGQoXHJcbiAgICAgICAgICAgIG5ldyBDb29yZChCQVRURVJfUkFESVVTX1VOSVRTLCBCQVRURVJfUkFESVVTX1VOSVRTKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgbsOkY2hzdGUgUG9zaXRpb25cclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19XHJcbiAgICAgKi9cclxuICAgIGdldE5leHRQb3NpdGlvbihldmVudCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGxldCBmaWVsZExlZnRPZmZzZXQgPSBGaWVsZC5pbnN0YW5jZS5odG1sLm9mZnNldCgpLmxlZnQ7XHJcbiAgICAgICAgbGV0IG1vdXNlWCA9IGV2ZW50LnBhZ2VYO1xyXG4gICAgICAgIGxldCBtb3VzZVkgPSBldmVudC5wYWdlWTtcclxuICAgICAgICBsZXQgeENvb3JkID0gMDtcclxuICAgICAgICBsZXQgeUNvb3JkID0gMDtcclxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcclxuXHJcbiAgICAgICAgaWYgKG1vdXNlWCAtIHRoaXMucGl4ZWxlZFJhZGl1cyA8PSBmaWVsZExlZnRPZmZzZXQpIHsgLy9sZWZ0IG92ZXJmbG93XHJcbiAgICAgICAgICAgIHhDb29yZCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtb3VzZVggPj0gKGZpZWxkLndpZHRoICsgZmllbGRMZWZ0T2Zmc2V0IC0gdGhpcy5waXhlbGVkUmFkaXVzKSkgeyAvL3JpZ2h0IG92ZXJmbG93XHJcbiAgICAgICAgICAgIHhDb29yZCA9IEZpZWxkLnVuaXRXaWR0aCAtIChCQVRURVJfUkFESVVTX1VOSVRTICogMik7XHJcbiAgICAgICAgfSBlbHNlIHsgLy9pbiBmaWVsZFxyXG4gICAgICAgICAgICB4Q29vcmQgPSBGaWVsZC5waXhlbDJ1bml0cyhtb3VzZVggLSBmaWVsZExlZnRPZmZzZXQpIC0gQkFUVEVSX1JBRElVU19VTklUUztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgbW91c2VZdW5pdHMgPSBGaWVsZC5waXhlbDJ1bml0cyhtb3VzZVkpO1xyXG4gICAgICAgIHlDb29yZCA9IG1vdXNlWXVuaXRzIC0gQkFUVEVSX1JBRElVU19VTklUUztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZhY2luZyA9PSAnYm90dG9tJykge1xyXG5cclxuICAgICAgICAgICAgaWYgKG1vdXNlWXVuaXRzIDw9IChGaWVsZC51bml0SGVpZ2h0IC8gMiApICsgQkFUVEVSX1JBRElVU19VTklUUykgeyAvL09iZXJrYW50ZS1GZWxkbWl0dGVcclxuICAgICAgICAgICAgICAgIHlDb29yZCA9IEZpZWxkLnVuaXRIZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vdXNlWXVuaXRzID4gRmllbGQudW5pdEhlaWdodCAtIEJBVFRFUl9SQURJVVNfVU5JVFMpIHtcclxuICAgICAgICAgICAgICAgIHlDb29yZCA9IEZpZWxkLnVuaXRIZWlnaHQgLSBCQVRURVJfUkFESVVTX1VOSVRTICogMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZhY2luZyA9PSAndG9wJykge1xyXG4gICAgICAgICAgICBpZiAobW91c2VZID49IChmaWVsZC5oZWlnaHQgLyAyIC0gdGhpcy5waXhlbGVkUmFkaXVzKSkgeyAvL1VudGVya2FudGUtRmVsZG1pdHRlXHJcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC5waXhlbDJ1bml0cyhmaWVsZC5oZWlnaHQgLyAyIC0gdGhpcy5waXhlbGVkUmFkaXVzKSAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW91c2VZIDwgdGhpcy5waXhlbGVkUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge3g6IHhDb29yZCwgeTogeUNvb3JkfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBQb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBjYWxjUG9zaXRpb24oZSkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICgodHlwZW9mIGUgIT0gXCJ1bmRlZmluZWRcIikgJiYgKGUudHlwZSA9PSBcIm1vdXNlbW92ZVwiKSkgeyAvL2NhbiBvbmx5IHJldHJpZXZlIG1vdXNlIHBvcyBpZiBtb3VzZSB3YXMgbW92ZWRcclxuICAgICAgICAgICAgbGV0IG9sZFBvcyA9IHRoaXMuY29vcmQudW5pdDtcclxuICAgICAgICAgICAgdGhpcy5jb29yZC51bml0ID0gdGhpcy5nZXROZXh0UG9zaXRpb24oZSk7XHJcbiAgICAgICAgICAgIGxldCB4RGlzdCA9IHRoaXMuY29vcmQudW5pdC54IC0gb2xkUG9zLng7XHJcbiAgICAgICAgICAgIGxldCB5RGlzdCA9IHRoaXMuY29vcmQudW5pdC55IC0gb2xkUG9zLnk7XHJcbiAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4RGlzdCwgMikgKyBNYXRoLnBvdyh5RGlzdCwgMikpO1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIC8vVE9ETzogbW92ZVRvXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXR0ZXI7XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XHJcbiAqIFRpbWU6IDE1OjUzXHJcbiAqL1xyXG5cclxudmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGQuanNcIik7XHJcbmNvbnN0IFVOSVRTID0gXCJ1XCI7XHJcbmNvbnN0IFBJWEVMID0gXCJweFwiO1xyXG5jbGFzcyBDb29yZCB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geFxyXG4gICAgICogQHBhcmFtIHlcclxuICAgICAqIEBwYXJhbSB7VU5JVFMgfCBQSVhFTH0gdHlwZVxyXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn18Kn1cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB0eXBlID0gVU5JVFMpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl90eXBlID0gXCJDb29yZFwiO1xyXG4gICAgICAgIHRoaXMuX3BpeGVsID0ge3g6IDAsIHk6IDB9O1xyXG4gICAgICAgIHRoaXMuX3VuaXQgPSB7eDogMCwgeTogMH07XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09PSBVTklUUykge1xyXG4gICAgICAgICAgICB0aGlzLnVuaXQgPSB7eDogeCwgeTogeX07XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEZyb21Vbml0cygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGl4ZWwgPSB7eDogeCwgeTogeX07XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEZyb21QaXhlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNdWx0aXBsaXppZXJ0IEtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcGFyYW0gY29vcmRcclxuICAgICAqL1xyXG4gICAgbXVsdGlwbHkoY29vcmQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl91bml0ID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAqIGNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgKiBjb29yZC51bml0LnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEZyb21Vbml0cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXZpZGllcnRzIEtvb3JkaW5hdGVuIGR1cmNoXHJcbiAgICAgKiBAcGFyYW0gY29vcmQgdGVpbGVyXHJcbiAgICAgKi9cclxuICAgIGRpdmlkZShjb29yZCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMudW5pdC54IC8gY29vcmQudW5pdC54LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAvIGNvb3JkLnVuaXQueVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoRnJvbVVuaXRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZGllcnQgS29vcmRpbmF0ZW5cclxuICAgICAqIEBwYXJhbSBjb29yZCBLb29yZGluYXRlLCBkaWUgYWRkaWVydCB3ZXJkZW4gc29sbFxyXG4gICAgICovXHJcbiAgICBhZGQoY29vcmQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl91bml0ID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCArIGNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgKyBjb29yZC51bml0LnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEZyb21Vbml0cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzdHJhaGllcnQgS29vcmRpbmF0ZW5cclxuICAgICAqIEBwYXJhbSBjb29yZFxyXG4gICAgICovXHJcbiAgICBzdWIoY29vcmQpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl91bml0ID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCAtIGNvb3JkLnVuaXQueCxcclxuICAgICAgICAgICAgeTogdGhpcy51bml0LnkgLSBjb29yZC51bml0LnlcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVmcmVzaEZyb21Vbml0cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR6dCBQaXhlbFxyXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSB4eU9iamVjdFxyXG4gICAgICovXHJcbiAgICBzZXQgcGl4ZWwoeHlPYmplY3QpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInBpeGVsIG11c3QgYmUgYW4gb2JqZWN0IHdpdGggYSB4IGFuZCB5IGNvbXBvbmVudFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSB4eU9iamVjdDtcclxuICAgICAgICB0aGlzLnJlZnJlc2hGcm9tUGl4ZWxzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IFBpeGVsLUtvbXBvbnRlbnRlIGRlciBLb29yZGluYXRlXHJcbiAgICAgKiBAcmV0dXJucyB7e3g6bnVtYmVyLHk6bnVtYmVyfX1cclxuICAgICAqL1xyXG4gICAgZ2V0IHBpeGVsKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waXhlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHp0IERhcnN0ZWxsdW5nc2VpbmhlaXRlblxyXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSB4eU9iamVjdFxyXG4gICAgICovXHJcbiAgICBzZXQgdW5pdCh4eU9iamVjdCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICh0eXBlb2YgeHlPYmplY3QgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4oeHlPYmplY3QueSkgfHwgaXNOYU4oeHlPYmplY3QueCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VuaXQgPSB4eU9iamVjdDtcclxuICAgICAgICB0aGlzLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgRGFyc3RlbGx1bmdlaW5oZWl0IGRlciBLb29yZGluYXRlXHJcbiAgICAgKiBAcmV0dXJucyB7e3g6bnVtYmVyLHk6bnVtYmVyfX1cclxuICAgICAqL1xyXG4gICAgZ2V0IHVuaXQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VuaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9uZSBDb29yZGluYXRlblxyXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxyXG4gICAgICovXHJcbiAgICBjbG9uZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gbmV3IENvb3JkKHRoaXMuX3VuaXQueCwgdGhpcy5fdW5pdC55KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWt0dWFsaXNpZXJ0IHBpeGVsIHZvbiB1bml0cyBhdXNnZWhlbmRcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaEZyb21Vbml0cygpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWt0dWFsaXNpZXJ0IHVuaXRzIHZvbiBwaXhlbCBhdXNnZWhlbmRcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaEZyb21QaXhlbHMoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fdW5pdCA9IEZpZWxkLnBpeGVsMnVuaXRzKHRoaXMuX3BpeGVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtvbnZlcnRpZXJ0IGthcnRlc2lzY2hlIEtvb3JkaW5hdGVuIHp1IFBvbGFya29vcmRpbmF0ZW5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQGxpbmsgaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL2pzcmVmL2pzcmVmX2F0YW4yLmFzcFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY2FydGVzaWFuVG9Qb2xhcih4LCB5KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgaWYgKHggPT0gMCAmJiB5ID09IDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSXQncyBub3QgcG9zc2libGUgdG8gZ2V0IHRoZSBwb2xhci1Db29yZHMgZnJvbSBvcmlnaW5cIilcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuMih5LCB4KTtcclxuICAgICAgICBhbmdsZSA9IGFuZ2xlIDwgMCA/IGFuZ2xlICsgTWF0aC5QSSAqIDIgOiBhbmdsZTtcclxuXHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFuZ2xlOiBhbmdsZSxcclxuICAgICAgICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY2huZXQgUG9sYXJrb29yZGluYXRlIGluIGthcnRlc2ljaGUgdW1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1vdmVUbyBpbiByYWRcclxuICAgICAqIEByZXR1cm5zIHtDb29yZCB8IG9iamVjdH1cclxuICAgICAqIEBwYXJhbSB7Ym9vbH0gYXNOZXdDb29yZCBsaWVmZXJ0IGVpbmUgbmV1ZSBDb29yZC1JbnN0YW56XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwb2xhclRvQ2FydGVzaWFuKGRpc3RhbmNlLCBtb3ZlVG8sIGFzTmV3Q29vcmQgPSB0cnVlKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgICAgIC8vUG9sYXJrb29yZGluYXRlbi1Lb252ZXJzaW9uXHJcbiAgICAgICAgbGV0IHggPSBNYXRoLmNvcyhtb3ZlVG8pICogZGlzdGFuY2U7XHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLnNpbihtb3ZlVG8pICogZGlzdGFuY2U7XHJcbiAgICAgICAgLy8gcnVuZGVuXHJcbiAgICAgICAgeCA9IE1hdGgucm91bmQoeCAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgeSA9IE1hdGgucm91bmQoeSAqIDEwMCkgLyAxMDA7XHJcblxyXG4gICAgICAgIHJldHVybiBhc05ld0Nvb3JkID8gbmV3IENvb3JkKHgsIHkpIDoge3g6IHgsIHk6IHl9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR3JhZCBpbiByYWRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRlZzJyYWQoZGVnKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIGRlZyAqIChNYXRoLlBJIC8gMTgwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmFkIGluIEdyYWRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJhZDJkZWcocmFkKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHJhZCAqICgxODAgLyBNYXRoLlBJKVxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gQ29vcmQ7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcclxuICogRGF0ZTogMTQuMDUuMjAxNVxyXG4gKiBUaW1lOiAxODowOFxyXG4gKi9cclxuXHJcbmNvbnN0IFJBVElPID0gMC42NjY2NjY7XHJcbmNvbnN0IFJFRlJFU0hfUkFURV9NUyA9IDMwO1xyXG5jb25zdCBWRVJUX1VOSVRTID0gMTAwMDtcclxuY29uc3QgSE9SWl9VTklUUyA9IFZFUlRfVU5JVFMgKiBSQVRJTztcclxuY29uc3QgVkVDX0JPVFRPTV9UT1AgPSBNYXRoLlBJOyAvL3JhZFxyXG5jb25zdCBWRUNfTEVGVF9SSUdIVCA9IE1hdGguUEkgKiAwLjU7IC8vIHJhZFxyXG5jb25zdCBTUEVFRF9JTkNSRUFTRV9TVEVQID0gMjtcclxuXHJcbmxldCBzaW5nbGV0b24gPSBTeW1ib2woKTtcclxubGV0IHNpbmdsZXRvbkVuZm9yY2VyID0gU3ltYm9sKCk7XHJcblxyXG4vKipcclxuICogU3BpZWxmZWxkXHJcbiAqIFNlaXRlbiBtw7xzc2VuIGltIFZlcmjDpGx0bmlzIDM6MiBhbmdlbGVndCB3ZXJkZW5cclxuICogQGxpbms6IGh0dHA6Ly90dXJmLm1pc3NvdXJpLmVkdS9zdGF0L2ltYWdlcy9maWVsZC9kaW1ob2NrZXkuZ2lmXHJcbiAqXHJcbiAqL1xyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbmZvcmNlcikge1xyXG5cclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAoZW5mb3JjZXIgIT0gc2luZ2xldG9uRW5mb3JjZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgY29uc3RydWN0IHNpbmdsZXRvblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdGlhbEdhbWVPYmplY3RTcGVjcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLl9JRCA9IFwiZmllbGRcIjtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gMDtcclxuICAgICAgICB0aGlzLl9maWVsZEhUTUwgPSAkKFwiPHNlY3Rpb24gaWQ9XFxcImZpZWxkXFxcIj5cIik7XHJcbiAgICAgICAgdGhpcy5fcGxheUluc3RhbmNlID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKFxyXG4gICAgICAgICAgICAkLnRocm90dGxlKFJFRlJFU0hfUkFURV9NUywgKCk9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICBpZiAodGhpc1tzaW5nbGV0b25dID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpc1tzaW5nbGV0b25dID0gbmV3IEZpZWxkKHNpbmdsZXRvbkVuZm9yY2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbc2luZ2xldG9uXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdhbmRlbCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gaW4gUGl4ZWwgdW1cclxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bWJlcn0gdW5pdFxyXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB1bml0czJwaXhlbCh1bml0KSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ICE9PSBcIm51bWJlclwiICYmICh0eXBlb2YgdW5pdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih1bml0LnkpIHx8IGlzTmFOKHVuaXQueCkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXRzMnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHVuaXQgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5pdCAvIEhPUlpfVU5JVFMgKiBmaWVsZC53aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdmVydFVuaXRSYXRpbyA9IHVuaXQueSAvIFZFUlRfVU5JVFM7XHJcbiAgICAgICAgICAgIGxldCBob3JVbml0UmF0aW8gPSB1bml0LnggLyBIT1JaX1VOSVRTO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IGZpZWxkLndpZHRoICogaG9yVW5pdFJhdGlvLFxyXG4gICAgICAgICAgICAgICAgeTogZmllbGQuaGVpZ2h0ICogdmVydFVuaXRSYXRpb1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdhbmRlbHQgUGllbCBpbiBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gdW1cclxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bWJlcn0gcGl4ZWxcclxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGl4ZWwydW5pdHMocGl4ZWwpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBpZiAodHlwZW9mIHBpeGVsICE9PSBcIm51bWJlclwiICYmICh0eXBlb2YgcGl4ZWwgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4ocGl4ZWwueSkgfHwgaXNOYU4ocGl4ZWwueCkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XHJcblxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHBpeGVsID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpeGVsIC8gZmllbGQud2lkdGggKiBIT1JaX1VOSVRTO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBoZWlnaHRSYXRpbyA9IHBpeGVsLnkgLyBmaWVsZC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGxldCB3aWR0aFJhdGlvID0gcGl4ZWwueCAvIGZpZWxkLndpZHRoO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHg6IHdpZHRoUmF0aW8gKiBIT1JaX1VOSVRTLFxyXG4gICAgICAgICAgICAgICAgeTogaGVpZ2h0UmF0aW8gKiBWRVJUX1VOSVRTXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSMO2aGUgaW4gVW5pdHNcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgdW5pdEhlaWdodCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gVkVSVF9VTklUUztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlaXRlIGluIFVuaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IHVuaXRXaWR0aCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gSE9SWl9VTklUUztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFrdHVhbGlzaWVydW5nc3JhdGUgZGVzIFNwaWVsZmVsZHNcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCByZWZyZXNoUmF0ZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gUkVGUkVTSF9SQVRFX01TO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2VpdGUgaW4gUGl4ZWxcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIw7ZoZSBpbiBQaXhlbFxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGllZmVydCByZXByw6RzZW50YXRpdmVzIERPTS1FbGVtZW50IGFscyBKcXVlcnlcclxuICAgICAqIEByZXR1cm5zIHsqfGpRdWVyeXxIVE1MRWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgZ2V0IGh0bWwoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpZWxkSFRNTDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBkaWUgQnJlaXRlIGRlcyBGZWxkZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9jYWxjUmF0aW9TaXplKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9ICQoXCJib2R5XCIpLmhlaWdodCgpO1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdGhpcy5faGVpZ2h0ICogUkFUSU87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxyXG4gICAgICovXHJcbiAgICBidWlsZCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XHJcbiAgICAgICAgLy9FbnRmZXJuZSBhbHRlcyBTcGllbGZlbGRcclxuICAgICAgICBpZiAodGhpcy5fZmllbGRIVE1MICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9JRCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5fZmllbGRIVE1MKTtcclxuICAgICAgICB0aGlzLl9maWVsZEhUTUwuY3NzKHtcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl93aWR0aCxcclxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy5fd2lkdGggKiAtLjUgLy80IGNlbnRlci1hbGlnbm1lbnRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XHJcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9JRCkuYXBwZW5kKGUuaHRtbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBaZWljaG5ldCBhbGxlIEdhbWVvYmplY3RzIGVpblxyXG4gICAgICovXHJcbiAgICBwbGF5KCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3BsYXlJbnN0YW5jZSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKT0+IHtcclxuICAgICAgICAgICAgLy9CZXJlY2huZSBQb3NpdGlvbiBhbGxlciBPYmpla3RlXHJcbiAgICAgICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmZvckVhY2goKGUpPT4ge1xyXG4gICAgICAgICAgICAgICAgZS5jYWxjUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGV0ZWN0R29hbENvbGxpc2lvbigpO1xyXG4gICAgICAgICAgICB0aGlzLnNvbHZlUHVja0JvcmRlckNvbGxpc2lvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy5zb2x2ZUJhdHRlckNvbGxpc2lvbnMoKTtcclxuXHJcbiAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKFwiZ2FtZTp0aWNrXCIpO1xyXG5cclxuICAgICAgICB9LCBSRUZSRVNIX1JBVEVfTVMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3RvcHB0IFNwaWVsXHJcbiAgICAgKi9cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5fcGxheUluc3RhbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHp0IFNwaWVsZWxlbWVudGUgYXVmIEF1c2dhbmdzenVzdGFuZCB6dXLDvGNrXHJcbiAgICAgKi9cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGxldCBwdWNrID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwicHVja1wiKTtcclxuICAgICAgICBwdWNrLnNwZWVkID0gMDtcclxuICAgICAgICBwdWNrLnJlc2V0U2NvcmUoKTtcclxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcclxuICAgICAgICAgICAgZS5jb29yZC51bml0ID0gdGhpcy5faW5pdGlhbEdhbWVPYmplY3RTcGVjcy5nZXQoZS5JRCkucG9zO1xyXG4gICAgICAgICAgICBlLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGw7xndCBuZXVlIFNwaWVsZWxlbWVudGUgaGluenVcclxuICAgICAqIEBwYXJhbSBnYW1lT2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGRlcGxveUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGxldCBHYW1lT2JqZWN0ID0gcmVxdWlyZShcIi4vR2FtZU9iamVjdFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCFnYW1lT2JqZWN0IGluc3RhbmNlb2YgR2FtZU9iamVjdCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGEgZ2FtZW9iamVjdFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdhbWVPYmplY3Quc2V0UG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5zZXQoZ2FtZU9iamVjdC5JRCwgZ2FtZU9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5faW5pdGlhbEdhbWVPYmplY3RTcGVjcy5zZXQoZ2FtZU9iamVjdC5JRCwge1xyXG4gICAgICAgICAgICBwb3M6IHtcclxuICAgICAgICAgICAgICAgIHg6IGdhbWVPYmplY3QuY29vcmQudW5pdC54LFxyXG4gICAgICAgICAgICAgICAgeTogZ2FtZU9iamVjdC5jb29yZC51bml0LnlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTMO2c3QgV2FuZGtvbGxpc2lvbmVuIGF1ZlxyXG4gICAgICovXHJcbiAgICBzb2x2ZVB1Y2tCb3JkZXJDb2xsaXNpb25zKCkge1xyXG4gICAgICAgIGxldCBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG4gICAgICAgIGxldCBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9nYW1lT2JqZWN0cy5oYXMoXCJwdWNrXCIpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIFB1Y2sgYXQgR2FtZSFcIilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwdWNrID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwicHVja1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCFwdWNrIGluc3RhbmNlb2YgUHVjaykgeyAvL2tvcnJla3RlIEluc3RhbnpcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZVBvcyA9IHB1Y2suY29vcmQudW5pdDtcclxuICAgICAgICBsZXQgZVNpemUgPSBwdWNrLnNpemUudW5pdDtcclxuICAgICAgICB2YXIgd2FsbERpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgLy9SaWdodCBib3JkZXJcclxuICAgICAgICBpZiAoZVBvcy54ICsgZVNpemUueCA+IEhPUlpfVU5JVFMpIHtcclxuICAgICAgICAgICAgcHVjay5jb29yZC51bml0ID0ge1xyXG4gICAgICAgICAgICAgICAgeDogSE9SWl9VTklUUyAtIHB1Y2suc2l6ZS51bml0LngsXHJcbiAgICAgICAgICAgICAgICB5OiBwdWNrLmNvb3JkLnVuaXQueVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3YWxsRGlyZWN0aW9uID0gVkVDX0xFRlRfUklHSFQ7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgLy8gTGVmdCBib3JkZXI/XHJcbiAgICAgICAgaWYgKGVQb3MueCA8IDApIHtcclxuICAgICAgICAgICAgcHVjay5jb29yZC51bml0ID0ge1xyXG4gICAgICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgICAgIHk6IHB1Y2suY29vcmQudW5pdC55XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHdhbGxEaXJlY3Rpb24gPSBWRUNfTEVGVF9SSUdIVDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQm90dG9tIGJvcmRlcj9cclxuICAgICAgICBpZiAoZVBvcy55ICsgZVNpemUueSA+IFZFUlRfVU5JVFMpIHtcclxuICAgICAgICAgICAgcHVjay5jb29yZC51bml0ID0ge1xyXG4gICAgICAgICAgICAgICAgeDogcHVjay5jb29yZC51bml0LngsXHJcbiAgICAgICAgICAgICAgICB5OiBWRVJUX1VOSVRTIC0gcHVjay5zaXplLnVuaXQueVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3YWxsRGlyZWN0aW9uID0gVkVDX0JPVFRPTV9UT1A7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgLy9Ub3AgYm9yZGVyP1xyXG4gICAgICAgIGlmIChlUG9zLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHB1Y2suY29vcmQudW5pdCA9IHtcclxuICAgICAgICAgICAgICAgIHg6IHB1Y2suY29vcmQudW5pdC54LFxyXG4gICAgICAgICAgICAgICAgeTogMFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3YWxsRGlyZWN0aW9uID0gVkVDX0JPVFRPTV9UT1A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod2FsbERpcmVjdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcHVjay5tb3ZlVG8gPSBGaWVsZC5jb2xsaXNpb25EaXJlY3Rpb24ocHVjay5tb3ZlVG8sIHdhbGxEaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBwdWNrLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTMO2c3QgU2NobMOkZ2VyLUtvbGxpc2lvbmVuIGF1ZlxyXG4gICAgICovXHJcbiAgICBzb2x2ZUJhdHRlckNvbGxpc2lvbnMoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIFB1Y2sgPSByZXF1aXJlKFwiLi9QdWNrXCIpO1xyXG4gICAgICAgIHZhciBCYXR0ZXIgPSByZXF1aXJlKFwiLi9CYXR0ZXJcIik7XHJcbiAgICAgICAgdmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XHJcblxyXG4gICAgICAgIGxldCBwdWNrID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwicHVja1wiKTtcclxuXHJcbiAgICAgICAgbGV0IGJhdHRlcnMgPSBbXTtcclxuICAgICAgICBsZXQgYmF0dGVyQm90dG9tID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwiYmF0dGVyLWJvdHRvbVwiKTtcclxuICAgICAgICBsZXQgYmF0dGVyVG9wID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwiYmF0dGVyLXRvcFwiKTtcclxuXHJcbiAgICAgICAgaWYgKGJhdHRlckJvdHRvbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGJhdHRlcnMucHVzaChiYXR0ZXJCb3R0b20pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChiYXR0ZXJUb3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBiYXR0ZXJzLnB1c2goYmF0dGVyVG9wKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmF0dGVycy5mb3JFYWNoKChlKT0+IHtcclxuICAgICAgICAgICAgbGV0IHhEaXN0ID0gZS5jZW50ZXJDb29yZC51bml0LnggLSBwdWNrLmNlbnRlckNvb3JkLnVuaXQueDtcclxuICAgICAgICAgICAgbGV0IHlEaXN0ID0gZS5jZW50ZXJDb29yZC51bml0LnkgLSBwdWNrLmNlbnRlckNvb3JkLnVuaXQueTtcclxuICAgICAgICAgICAgbGV0IHBvbGFyQ29vcmQgPSBDb29yZC5jYXJ0ZXNpYW5Ub1BvbGFyKHhEaXN0LCB5RGlzdCk7XHJcbiAgICAgICAgICAgIGxldCByYWRpdXNTdW0gPSBQdWNrLnJhZGl1cyArIEJhdHRlci5yYWRpdXM7XHJcbiAgICAgICAgICAgIC8vQm91bmNlZCFcclxuICAgICAgICAgICAgaWYgKHBvbGFyQ29vcmQuZGlzdGFuY2UgPCByYWRpdXNTdW0pIHtcclxuICAgICAgICAgICAgICAgIC8vU2NoaWViZSBQdWNrIGFuIFJhbmQgdm9uIEJhdHRlclxyXG4gICAgICAgICAgICAgICAgcG9sYXJDb29yZC5kaXN0YW5jZSAtPSByYWRpdXNTdW07XHJcbiAgICAgICAgICAgICAgICBsZXQgYmF0dGVyQm9yZGVyQ29vcmQgPSBDb29yZC5wb2xhclRvQ2FydGVzaWFuKHBvbGFyQ29vcmQuZGlzdGFuY2UsIHBvbGFyQ29vcmQuYW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgcHVjay5jb29yZC5hZGQoYmF0dGVyQm9yZGVyQ29vcmQpO1xyXG4gICAgICAgICAgICAgICAgcHVjay5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgLy9EcmVoZSB1bSAxODDCsCB6dW0gemVudHJ1bVxyXG4gICAgICAgICAgICAgICAgcHVjay5tb3ZlVG8gPSAocG9sYXJDb29yZC5hbmdsZSArIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwdWNrLnNwZWVkICs9IFNQRUVEX0lOQ1JFQVNFX1NURVA7XHJcbiAgICAgICAgICAgICAgICBwdWNrLmFkZFNjb3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oXCJQdWNrIGlzdCBudW4gXCIgKyBwdWNrLnNjb3JlICsgXCIgd2VydFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmVyZWNobmV0IEF1c3RyaXR0c3dpbmtlbFxyXG4gICAgICogQHBhcmFtIG9yaWdpbkFuZ2xlXHJcbiAgICAgKiBAcGFyYW0gY29sbGlkaW5nQW5nbGVcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZCBkZXMgbmV1ZW4gV2lua2Vsc1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29sbGlzaW9uRGlyZWN0aW9uKG9yaWdpbkFuZ2xlLCBjb2xsaWRpbmdBbmdsZSkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGxldCBmdWxsQ2lyY2xlUmFkID0gMiAqIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIChmdWxsQ2lyY2xlUmFkICsgb3JpZ2luQW5nbGUgKyAyICogY29sbGlkaW5nQW5nbGUgLSAyICogb3JpZ2luQW5nbGUpICUgZnVsbENpcmNsZVJhZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVya2VubmUgVG9yXHJcbiAgICAgKi9cclxuICAgIGRldGVjdEdvYWxDb2xsaXNpb24oKSB7XHJcbiAgICAgICAgbGV0IFB1Y2sgPSByZXF1aXJlKFwiLi9QdWNrXCIpO1xyXG4gICAgICAgIGxldCBwdWNrID0gdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwicHVja1wiKTtcclxuXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5nZXQoXCJnb2FsLXRvcFwiKSxcclxuICAgICAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZ2V0KFwiZ29hbC1ib3R0b21cIilcclxuICAgICAgICBdLmZvckVhY2goXHJcbiAgICAgICAgICAgIChlKT0+IHtcclxuICAgICAgICAgICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gZS5jb29yZC51bml0Lng7XHJcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gc3RhcnQgKyBlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgLy9PYmVyZXMgVG9yXHJcbiAgICAgICAgICAgICAgICBpZiAocHVjay5jb29yZC51bml0LnkgPD0gMFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHB1Y2suY29vcmQudW5pdC54IC0gUHVjay5yYWRpdXMgLyAyID4gc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICAmJiBwdWNrLmNvb3JkLnVuaXQueCArIFB1Y2sucmFkaXVzIC8gMiA8IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKFwiZ2FtZTpnb2FsXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyOiBcInRvcFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogcHVjay5zY29yZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChwdWNrLmNvb3JkLnVuaXQueSArIDIgKiBQdWNrLnJhZGl1cykgPj0gVkVSVF9VTklUUyAtIFB1Y2sucmFkaXVzXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcHVjay5jb29yZC51bml0LnggLSBQdWNrLnJhZGl1cyAvIDIgPiBzdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHB1Y2suY29vcmQudW5pdC54ICsgUHVjay5yYWRpdXMgLyAyIDwgZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoXCJnYW1lOmdvYWxcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXI6IFwiYm90dG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiBwdWNrLnNjb3JlXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCJsZXQgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuXHJcbmNsYXNzIEdhbWVPYmplY3Qge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaWQgSUQgdW0gRWxlbWVudCBpbSBET00genUgbWFya2llcmVuIHVuZCBPYmpla3QgenUgdmVyZ2xlaWNoZW5cclxuICAgICAqIEBwYXJhbSBodG1sIEpxdWVyeS1IVE1MLWVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB4U2l6ZSBVTklUU1xyXG4gICAgICogQHBhcmFtIHlTaXplIFVOSVRTXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGlkLCBodG1sLCB4U2l6ZSwgeVNpemUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9jb29yZCA9IG5ldyBDb29yZCgpO1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSBuZXcgQ29vcmQoeFNpemUsIHlTaXplKTtcclxuICAgICAgICAvL0tvbmtyZXRlciBJbnN0YW56LU5hbWVcclxuICAgICAgICB0aGlzLl9JRCA9IGlkO1xyXG4gICAgICAgIC8vQmFzaXMtS2xhc3NlIHdpcmQgYWxzIERhdGVuLVR5cCBmw7xyIFZhbGlkaWVydW5nIHZlcndlbmRldFxyXG4gICAgICAgIHRoaXMuX2h0bWwgPSBodG1sLmF0dHIoXCJpZFwiLCBpZCk7XHJcbiAgICAgICAgdGhpcy5fbW92ZVRvID0gMDtcclxuICAgICAgICB0aGlzLl9zcGVlZCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHcsO2w59lIGRlcyBHYW1lLU9iamVrdHNcclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaW5rZWwgZGVyIEJld2VndW5nc3JpY2h0dW5nIGluIHJhZCEhISEhXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBXaW5rZWwgaW4gcmFkIVxyXG4gICAgICovXHJcbiAgICBnZXQgbW92ZVRvKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlVG87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaW5rZWwsIGRlciBCZXdlZ3VuZ3NyaWNodHVuZyBpbiByYWRcclxuICAgICAqIDDCsCA9PSByZWNodCwgOTDCsCA9PSB1bnRlblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlXHJcbiAgICAgKi9cclxuICAgIHNldCBtb3ZlVG8oYW5nbGUpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLl9tb3ZlVG8gPSBhbmdsZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaWUgcmVww6RzZW50YXRpdmUgSUQgZWluZXMgamVkZW4gT2JqZWN0c1xyXG4gICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0IElEKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9JRDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpZSBLb29yZGluYXRlbiBlaW5lcyBqZWRlbiBHYW1lT2JqZWN0c1xyXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxyXG4gICAgICovXHJcbiAgICBnZXQgY29vcmQoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0enQgS29vcmRpbmF0ZW5cclxuICAgICAqIEBwYXJhbSB7Q29vcmR9IGNvb3JkXHJcbiAgICAgKi9cclxuICAgIHNldCBjb29yZChjb29yZCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX2Nvb3JkID0gY29vcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXMgcmVwcsOkc2VudGF0aXZlIERPTS1FbGVtZW50XHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGh0bWwoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IGRpZSBHZXNjaHdpbmRpZ2tlaXQgaW4gWC9ZLUtvbXBvbmVudGVcclxuICAgICAqL1xyXG4gICAgZ2V0IHNwZWVkQXNDb29yZCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB2YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuICAgICAgICByZXR1cm4gQ29vcmQucG9sYXJUb0NhcnRlc2lhbih0aGlzLl9zcGVlZCwgdGhpcy5fbW92ZVRvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlc2Nod2luZGlna2VpdC96dXLDvGNrZ2VsZWd0ZSBEaXN0YW56IGplIFRpY2tcclxuICAgICAqIEByZXR1cm5zIHtpbnR9XHJcbiAgICAgKi9cclxuICAgIGdldCBzcGVlZCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3BlZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXNjaHdpbmRpZ2tlaXQvenVyw7xja2dlbGVndGUgRGlzdGFueiBqZSBUaWNrXHJcbiAgICAgKiBAcGFyYW0ge2ludH0gc3BlZWRWYWx1ZVxyXG4gICAgICovXHJcbiAgICBzZXQgc3BlZWQoc3BlZWRWYWx1ZSkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc3BlZWRWYWx1ZSAhPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIk11c3QgYmUgYSBpbnRlZ2VyXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NwZWVkID0gc3BlZWRWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJld2VndCBHYW1lb2JqZWN0IGFuIFBvc2l0aW9uXHJcbiAgICAgKiBAbGluayBodHRwOi8vanNwZXJmLmNvbS90cmFuc2xhdGUzZC12cy14eS8yOFxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBsZXQgZG9tb2JqZWN0ID0gdGhpcy5faHRtbFswXTtcclxuICAgICAgICBkb21vYmplY3Quc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMuX2Nvb3JkLnBpeGVsLnggKyBcInB4LFwiICsgdGhpcy5fY29vcmQucGl4ZWwueSArIFwicHgsMClcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBkaWUgbsOkY2hzdGUgUG9zaXRpb24gZGVzIEdhbWVPYmplY3RzXHJcbiAgICAgKi9cclxuICAgIGNhbGNQb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICB0aGlzLmNvb3JkLmFkZCh0aGlzLnNwZWVkQXNDb29yZCk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lT2JqZWN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1hcmtvIEdyZ2ljIG9uIDI4LjA1LjIwMTUuXHJcbiAqL1xyXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcclxudmFyIFB1Y2sgPSByZXF1aXJlKFwiLi9QdWNrXCIpO1xyXG5cclxuY29uc3QgR09BTF9IRUlHSFQgPSBGaWVsZC51bml0SGVpZ2h0IC8gMjA7XHJcbmNvbnN0IEdPQUxfV0lEVEggPSBGaWVsZC51bml0V2lkdGggLyA0O1xyXG5cclxuXHJcbmNsYXNzIEdvYWwgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKGZhY2luZykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyKFwiZ29hbC1cIiArIGZhY2luZywgJCgnPHNwYW4gY2xhc3M9XCJnb2Fsc1wiLz4nKSwgR09BTF9XSURUSCwgR09BTF9IRUlHSFQpO1xyXG4gICAgICAgIHRoaXMuX2ZhY2luZyA9IGZhY2luZztcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsICgpPT4ge1xyXG4gICAgICAgICAgICBzdXBlci5zaXplLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHN1cGVyLnNpemUucGl4ZWwueVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FsY1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgfSkudHJpZ2dlcihcInJlc2l6ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHBvc2l0aW9uKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFRPUDogXCJ0b3BcIixcclxuICAgICAgICAgICAgQk9UVE9NOiBcImJvdHRvbVwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2l6ZS51bml0LnhcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zaXplLnVuaXQueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJlcmVjaG5ldCBQb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBjYWxjUG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIuY2FsY1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHb2FsOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE1LjA1LjIwMTVcclxuICogVGltZTogMTU6MjZcclxuICovXHJcblxyXG52YXIgR2FtZU9iamVjdCA9IHJlcXVpcmUoXCIuL0dhbWVPYmplY3RcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG5jb25zdCBWRUxPQ0lUWSA9IC0wLjU7IC8vZ2dmLiBzcMOkdGVyIGF1c3RhdXNjaGVuIGdlZ2VuIEZ1bmt0aW9uIGYodClcclxuY29uc3QgUFVDS19SQURJVVNfVU5JVFMgPSAxNjtcclxuY29uc3QgU0NPUkVfU1RBUlQgPSA1MDtcclxuY29uc3QgU0NPUkVfU1RFUCA9IDI1O1xyXG5cclxuY2xhc3MgUHVjayBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyKFwicHVja1wiLCAkKFwiPGIgLz5cIiksIFBVQ0tfUkFESVVTX1VOSVRTICogMiwgUFVDS19SQURJVVNfVU5JVFMgKiAyKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2NvcmUgPSA1MDtcclxuICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgKCk9PiB7XHJcblxyXG4gICAgICAgICAgICBzdXBlci5zaXplLnJlZnJlc2hGcm9tVW5pdHMoKTtcclxuXHJcbiAgICAgICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHN1cGVyLnNpemUucGl4ZWwueVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KS50cmlnZ2VyKFwicmVzaXplXCIpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpZWZlcnQgUHVua3Rlc3RhbmRcclxuICAgICAqL1xyXG4gICAgZ2V0IHNjb3JlKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY29yZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVyaMO2aHQgUHVua3Rlc3RhbmRcclxuICAgICAqL1xyXG4gICAgYWRkU2NvcmUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUgKz0gU0NPUkVfU1RFUDtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFNjb3JlKCkge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHRoaXMuX3Njb3JlID0gU0NPUkVfU1RBUlQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IGRpZSBQdWNrLWdyw7bDn2VcclxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IFB1Y2stUmFkaXVzIGluIHVuaXRzXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IHJhZGl1cygpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gUFVDS19SQURJVVNfVU5JVFM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWVmZXJ0IE1pdHRlbHB1bmt0LUtvb3JkaW5hdGVuXHJcbiAgICAgKiBAcmV0dXJucyB7Q29vcmR9XHJcbiAgICAgKi9cclxuICAgIGdldCBjZW50ZXJDb29yZCgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICByZXR1cm4gc3VwZXIuY29vcmQuY2xvbmUoKS5hZGQoXHJcbiAgICAgICAgICAgIG5ldyBDb29yZChQVUNLX1JBRElVU19VTklUUywgUFVDS19SQURJVVNfVU5JVFMpXHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0enQgUHVjayBhdWYgUG9zaXRpb25cclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIuc2V0UG9zaXRpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmVyZWNobmV0IFBvc2l0aW9uIHVucyBzZXR6dCBPYmplY3QgYW5zY2hsaWXDn2VuZCBhbiBQb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBjYWxjUG9zaXRpb24oKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIuY2FsY1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkXCIpO1xyXG52YXIgUHVjayA9IHJlcXVpcmUoXCIuL1B1Y2tcIik7XHJcbnZhciBCYXR0ZXIgPSByZXF1aXJlKFwiLi9CYXR0ZXJcIik7XHJcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG52YXIgR29hbCA9IHJlcXVpcmUoXCIuL0dvYWxcIik7XHJcbnZhciBtb2RhbEZvcm1Mb2dpYyA9IHJlcXVpcmUoXCIuL21vZGFsRm9ybUxvZ2ljXCIpO1xyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuICAgIC8vWmVpY2huZSBTcGllbGZlbGRcclxuICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xyXG4gICAgbGV0IHB1Y2sgPSBuZXcgUHVjaygpO1xyXG5cclxuICAgIC8vU3RhcnRjb29yZHNcclxuICAgIHB1Y2suY29vcmQgPSBuZXcgQ29vcmQoRmllbGQudW5pdFdpZHRoIC8gMiAtIFB1Y2sucmFkaXVzLCBGaWVsZC51bml0SGVpZ2h0IC8gMik7XHJcbiAgICAvL1N0YXJ0U3BlZWRcclxuICAgIHB1Y2suc3BlZWQgPSAwO1xyXG4gICAgcHVjay5tb3ZlVG8gPSBDb29yZC5kZWcycmFkKDQ1KTsgLy8gbmFjaCBsaW5rcyBiaXR0ZVxyXG5cclxuXHJcbiAgICBsZXQgcGxheWVyVG9wID0gbmV3IEJhdHRlcihCYXR0ZXIucG9zaXRpb24uVE9QKTtcclxuICAgIGxldCBwbGF5ZXJCb3R0b20gPSBuZXcgQmF0dGVyKEJhdHRlci5wb3NpdGlvbi5CT1RUT00pO1xyXG4gICAgbGV0IGdsb2FsVG9wID0gbmV3IEdvYWwoR29hbC5wb3NpdGlvbi5UT1ApO1xyXG4gICAgbGV0IGdvYWxCb3R0b20gPSBuZXcgR29hbChHb2FsLnBvc2l0aW9uLkJPVFRPTSk7XHJcblxyXG4gICAgLy9TdGFydGNvb3Jkc1xyXG4gICAgcGxheWVyVG9wLmNvb3JkID0gbmV3IENvb3JkKEZpZWxkLnVuaXRXaWR0aCAvIDIgLSBCYXR0ZXIucmFkaXVzLCBGaWVsZC51bml0SGVpZ2h0IC8gNCk7XHJcbiAgICBwbGF5ZXJCb3R0b20uY29vcmQgPSBuZXcgQ29vcmQoRmllbGQudW5pdFdpZHRoIC8gMiAtIEJhdHRlci5yYWRpdXMsIDMgKiAoRmllbGQudW5pdEhlaWdodCAvIDQpKTtcclxuICAgIGdsb2FsVG9wLmNvb3JkID0gbmV3IENvb3JkKChGaWVsZC51bml0V2lkdGggLyA0KSAqIDEuNSwgMCAtIChnbG9hbFRvcC5zaXplLnVuaXQueSAvIDIpKTtcclxuICAgIGdvYWxCb3R0b20uY29vcmQgPSBuZXcgQ29vcmQoKEZpZWxkLnVuaXRXaWR0aCAvIDQpICogMS41LCBGaWVsZC51bml0SGVpZ2h0IC0gKGdvYWxCb3R0b20uc2l6ZS51bml0LnkgLyAyKSk7XHJcblxyXG4gICAgLy8gRGVwbG95IGdhbWUgb2JqZWN0cyBhbmQgc3RhcnRcclxuICAgIGZpZWxkLmRlcGxveUdhbWVPYmplY3QoZ2xvYWxUb3ApO1xyXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChnb2FsQm90dG9tKTtcclxuICAgIC8vZmllbGQuZGVwbG95R2FtZU9iamVjdChwbGF5ZXJUb3ApO1xyXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwbGF5ZXJCb3R0b20pO1xyXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwdWNrKTtcclxuICAgIGZpZWxkLmJ1aWxkKCk7XHJcbiAgICBmaWVsZC5wbGF5KCk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKFwiZ2FtZTpnb2FsXCIsIChldmVudCwgZGF0YSk9PiB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUT09PUlwiLCBkYXRhKTtcclxuICAgICAgICBmaWVsZC5yZXNldCgpO1xyXG4gICAgICAgIGZpZWxkLnBsYXkoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vU2hhZG93LUFuaW1hdGlvblxyXG4gICAgLy8kKHdpbmRvdykub24oXCJnYW1lOnRpY2tcIiwgKCk9PiB7XHJcbiAgICAvLyAgICAkLmZuLnJlYWxzaGFkb3cucmVzZXQoKTtcclxuICAgIC8vICAgIGNvbnNvbGUubG9nKHB1Y2suY29vcmQucGl4ZWwueCArIGZpZWxkLmh0bWwub2Zmc2V0KCkubGVmdCApO1xyXG4gICAgLy8gICAgJCgnLmJhdHRlcnMnKS5yZWFsc2hhZG93KHtcclxuICAgIC8vICAgICAgICBwYWdlWDogcHVjay5jb29yZC5waXhlbC54ICsgZmllbGQuaHRtbC5vZmZzZXQoKS5sZWZ0ICsgZmllbGQuaHRtbC53aWR0aCgpLzIsXHJcbiAgICAvLyAgICAgICAgcGFnZVk6IHB1Y2suY29vcmQucGl4ZWwueSxcclxuICAgIC8vICAgICAgICBjb2xvcjogXCI0MSwyNTUsMjQyXCIsICAgIC8vIHNoYWRvdyBjb2xvciwgcmdiIDAuLjI1NSwgZGVmYXVsdDogJzAsMCwwJ1xyXG4gICAgLy8gICAgICAgIHR5cGU6ICdkcm9wJyAvLyBzaGFkb3cgdHlwZVxyXG4gICAgLy8gICAgfSk7XHJcbiAgICAvL30pO1xyXG4gICAgbW9kYWxGb3JtTG9naWMoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMzEuMDUuMjAxNVxuICogVGltZTogMTg6NTdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoKT0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICQoJyNlbnRlck5hbWVfTW9kYWwnKS5vcGVuTW9kYWwoe1xuICAgICAgICByZWFkeTogKCk9PiB7XG4gICAgICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgICAgICQoJyNwbGF5ZXJfbmFtZScpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKFwiI3N1Ym1pdF9wbGF5ZXJfbmFtZV9mb3JtXCIpLm9uKFwiY2xpY2tcIiwgKCk9PiB7XG4gICAgICAgICQoXCIjcGxheWVyX25hbWVfZm9ybVwiKS5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAgICQoXCIjcGxheWVyX25hbWVfZm9ybVwiKS5vbihcInN1Ym1pdFwiLCAoZSk9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IHBsYXllck5hbWUgPSAkKFwiI3BsYXllcl9uYW1lXCIpO1xuICAgICAgICBpZiAocGxheWVyTmFtZS52YWwoKS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBNYXRlcmlhbGl6ZS50b2FzdCgnQml0dGUgZ2ViZW4gU2llIGVpbmVuIE5hbWVuIGVpbiEnLCA0MDAwLCBcInJlZCBkYXJrZW4tM1wiKVxuICAgICAgICAgICAgcGxheWVyTmFtZS5hZGRDbGFzcyhcImludmFsaWRcIilcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4gICAgfSk7XG59OyJdfQ==
