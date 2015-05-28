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
    function Batter(name, facing) {
        "use strict";

        _classCallCheck(this, Batter);

        _get(Object.getPrototypeOf(Batter.prototype), "constructor", this).call(this, name, $("<b id=\"batter_" + name + "\" />"), BATTER_RADIUS_UNITS * 2, BATTER_RADIUS_UNITS * 2);
        this._facing = facing;
        this.pixeledRadius = Field.units2pixel({ x: BATTER_RADIUS_UNITS, y: 1 }).x;

        _get(Object.getPrototypeOf(Batter.prototype), "html", this).css({
            width: _get(Object.getPrototypeOf(Batter.prototype), "size", this).pixel.x,
            height: _get(Object.getPrototypeOf(Batter.prototype), "size", this).pixel.y
        });
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
            console.log(fieldLeftOffset);
            xCoord = mouseX;
            yCoord = mouseY;

            if (mouseX - this.pixeledRadius <= fieldLeftOffset) {
                //left overflow
                xCoord = 0;
            } else if (mouseX >= Field.instance._width + fieldLeftOffset - this.pixeledRadius) {
                //right overflow
                var coordDump = {
                    x: Field.instance._width,
                    y: mouseY
                };
                xCoord = Field.pixel2units(coordDump).x - BATTER_RADIUS_UNITS * 2;
            } else {
                //in field
                var coordDump = {
                    x: mouseX - fieldLeftOffset,
                    y: mouseY
                };
                xCoord = Field.pixel2units(coordDump).x - BATTER_RADIUS_UNITS;
            }

            if (this._facing == "bottom") {
                if (mouseY <= Field.instance._height / 2 - this.pixeledRadius) {
                    yCoord = Field.instance._height / 2;
                    console.log(this._facing);
                } else {
                    var coordDump = {
                        x: mouseX - fieldLeftOffset,
                        y: mouseY
                    };
                    yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
                }
            }

            if (this._facing == "top") {
                if (mouseY >= Field.instance._height / 2 - this.pixeledRadius) {
                    var coordDump = {
                        x: mouseX - fieldLeftOffset,
                        y: Field.instance._height / 2 - this.pixeledRadius
                    };
                    yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
                } else {
                    var coordDump = {
                        x: mouseX - fieldLeftOffset,
                        y: mouseY
                    };
                    yCoord = Field.pixel2units(coordDump).y - BATTER_RADIUS_UNITS;
                }
            }

            console.log(mouseX + ", " + Field.instance.html.css("left"));

            this.coord.unit = { x: xCoord, y: yCoord };
            this.setPosition();
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
    }, {
        key: "html",
        get: function () {
            "use strict";
            return this._fieldHTML;
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
            if (typeof unit !== "number" && (typeof pixel !== "object" || isNaN(pixel.y) || isNaN(pixel.x))) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }
            var field = Field.instance;

            if (typeof unit == "number") {
                return pixel.x / field.width * HORZ_UNITS;
            } else {
                var heightRatio = pixel.y / field.height;
                var widthRatio = pixel.x / field.width;

                return {
                    x: widthRatio * HORZ_UNITS,
                    y: heightRatio * VERT_UNITS
                };
            }
        }
    }]);

    return Field;
})();

module.exports = Field;

},{"./Coord":2}],4:[function(require,module,exports){
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

},{"./Coord":2}],5:[function(require,module,exports){
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

},{"./Coord":2,"./GameObject":4}],6:[function(require,module,exports){
/**
 * Reine Tech-demo, kann ausgeblendet werden
 */

'use strict';

module.exports = (function () {

    var socket = io.connect();

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            var h = Math.random() * 16; //weil hexa
            color += letters[Math.floor(h)];
        }
        return color;
    }

    $(document).on('mousemove', function (event) {
        socket.emit('mouse_activity', { x: event.pageX, y: event.pageY });
    });

    socket.on('userPositions', function (positions) {
        for (var i in positions) {
            var coords = positions[i];
            if (coords !== null) {
                var e = $('#' + i);
                if (!e.length) {
                    $('body').append('<b id="' + i + '">+</b>');
                    e = $('#' + i);
                    e.css('backgroundColor', getRandomColor());
                }
                e.css('left', coords.x - 10);
                e.css('top', coords.y - 10);
            }
        }
    });
    socket.on('userAmount', function (amount) {
        $('#userAmount').text(amount);
    });
})();

},{}],7:[function(require,module,exports){
//Not used anymore
"use strict";

require("./__techdemo");

var Field = require("./Field");
var Puck = require("./Puck");
var Batter = require("./Batter");
var Coord = require("./Coord");

$(function () {
    //Zeichne Spielfeld
    var field = Field.instance;
    var puck = new Puck();

    puck.coord = new Coord(0, 80);
    puck.speed = 15;
    puck.moveTo = 45; // nach links bitte

    //var player1 = new Batter('player1', 'top');
    var player2 = new Batter("player2", "bottom");
    //player1.coord = new Coord(field._width/2,field._height/4);
    player2.coord = new Coord(field._width / 2, 3 * (field._height / 4));

    field.deployGameObject(puck);
    //field.deployGameObject(player1);
    field.deployGameObject(player2);
    field.build();
    //field.play();

    $(document).on("mousemove", $.throttle(0, function (event) {
        player2.refreshPosition(event);
    }));
});

},{"./Batter":1,"./Coord":2,"./Field":3,"./Puck":5,"./__techdemo":6}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9NYXJrbyBHcmdpYy9jb2RpbmcvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvQmF0dGVyLmpzIiwiQzovVXNlcnMvTWFya28gR3JnaWMvY29kaW5nL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0Nvb3JkLmpzIiwiQzovVXNlcnMvTWFya28gR3JnaWMvY29kaW5nL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvTWFya28gR3JnaWMvY29kaW5nL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0dhbWVPYmplY3QuanMiLCJDOi9Vc2Vycy9NYXJrbyBHcmdpYy9jb2RpbmcvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvUHVjay5qcyIsIkM6L1VzZXJzL01hcmtvIEdyZ2ljL2NvZGluZy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9fX3RlY2hkZW1vLmpzIiwiQzovVXNlcnMvTWFya28gR3JnaWMvY29kaW5nL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztBQ0lBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDOztJQUV6QixNQUFNO0FBQ0csYUFEVCxNQUFNLENBQ0ksSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN0QixvQkFBWSxD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b250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IE1hcmtvIEdyZ2ljIG9uIDI4LjA1LjIwMTUuXG4gKi9cblxudmFyIEdhbWVPYmplY3QgPSByZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xudmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcbmNvbnN0IEJBVFRFUl9SQURJVVNfVU5JVFMgPSAzMjtcblxuY2xhc3MgQmF0dGVyIGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZmFjaW5nKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBzdXBlcihuYW1lLCAkKFwiPGIgaWQ9XFxcImJhdHRlcl9cIiArIG5hbWUgKyBcIlxcXCIgLz5cIiksIEJBVFRFUl9SQURJVVNfVU5JVFMgKiAyLCBCQVRURVJfUkFESVVTX1VOSVRTICogMik7XG4gICAgICAgIHRoaXMuX2ZhY2luZyA9IGZhY2luZztcbiAgICAgICAgdGhpcy5waXhlbGVkUmFkaXVzID0gRmllbGQudW5pdHMycGl4ZWwoe3g6IEJBVFRFUl9SQURJVVNfVU5JVFMsIHk6IDF9KS54O1xuXG4gICAgICAgIHN1cGVyLmh0bWwuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBzdXBlci5zaXplLnBpeGVsLngsXG4gICAgICAgICAgICBoZWlnaHQ6IHN1cGVyLnNpemUucGl4ZWwueVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgYmFzZVR5cGUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBzdXBlci50eXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgZGllIFB1Y2stZ3LDtsOfZVxuICAgICAqIEByZXR1cm5zIHtDb29yZH1cbiAgICAgKi9cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiBzdXBlci5zaXplO1xuICAgIH1cblxuICAgIHJlZnJlc2hQb3NpdGlvbihldmVudCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgbGV0IGZpZWxkTGVmdE9mZnNldCA9IEZpZWxkLmluc3RhbmNlLmh0bWwub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgbGV0IG1vdXNlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICBsZXQgbW91c2VZID0gZXZlbnQucGFnZVk7XG4gICAgICAgIGxldCB4Q29vcmQgPSAwO1xuICAgICAgICBsZXQgeUNvb3JkID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coZmllbGRMZWZ0T2Zmc2V0KTtcbiAgICAgICAgeENvb3JkID0gbW91c2VYO1xuICAgICAgICB5Q29vcmQgPSBtb3VzZVk7XG5cbiAgICAgICAgaWYgKG1vdXNlWCAtIHRoaXMucGl4ZWxlZFJhZGl1cyA8PSBmaWVsZExlZnRPZmZzZXQpIHsgLy9sZWZ0IG92ZXJmbG93XG4gICAgICAgICAgICB4Q29vcmQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYobW91c2VYID49IChGaWVsZC5pbnN0YW5jZS5fd2lkdGggKyBmaWVsZExlZnRPZmZzZXQgLSB0aGlzLnBpeGVsZWRSYWRpdXMpKSB7IC8vcmlnaHQgb3ZlcmZsb3dcbiAgICAgICAgICAgIGxldCBjb29yZER1bXAgPSB7XG4gICAgICAgICAgICAgICAgeDogRmllbGQuaW5zdGFuY2UuX3dpZHRoLFxuICAgICAgICAgICAgICAgIHk6IG1vdXNlWVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhDb29yZCA9IEZpZWxkLnBpeGVsMnVuaXRzKGNvb3JkRHVtcCkueCAtIChCQVRURVJfUkFESVVTX1VOSVRTICogMik7XG4gICAgICAgIH0gZWxzZSB7IC8vaW4gZmllbGRcbiAgICAgICAgICAgIGxldCBjb29yZER1bXAgPSB7XG4gICAgICAgICAgICAgICAgeDogbW91c2VYIC0gZmllbGRMZWZ0T2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IG1vdXNlWVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhDb29yZCA9IEZpZWxkLnBpeGVsMnVuaXRzKGNvb3JkRHVtcCkueCAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZmFjaW5nID09ICdib3R0b20nKSB7XG4gICAgICAgICAgICBpZiAobW91c2VZIDw9IChGaWVsZC5pbnN0YW5jZS5faGVpZ2h0IC8gMiAtIHRoaXMucGl4ZWxlZFJhZGl1cykpIHtcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC5pbnN0YW5jZS5faGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9mYWNpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY29vcmREdW1wID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBtb3VzZVggLSBmaWVsZExlZnRPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIHk6IG1vdXNlWVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeUNvb3JkID0gRmllbGQucGl4ZWwydW5pdHMoY29vcmREdW1wKS55IC0gQkFUVEVSX1JBRElVU19VTklUUztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mYWNpbmcgPT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIGlmIChtb3VzZVkgPj0gKEZpZWxkLmluc3RhbmNlLl9oZWlnaHQgLyAyIC0gdGhpcy5waXhlbGVkUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgIGxldCBjb29yZER1bXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlWCAtIGZpZWxkTGVmdE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgeTogRmllbGQuaW5zdGFuY2UuX2hlaWdodCAvIDIgLSB0aGlzLnBpeGVsZWRSYWRpdXNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHlDb29yZCA9IEZpZWxkLnBpeGVsMnVuaXRzKGNvb3JkRHVtcCkueSAtIEJBVFRFUl9SQURJVVNfVU5JVFM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjb29yZER1bXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IG1vdXNlWCAtIGZpZWxkTGVmdE9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgeTogbW91c2VZXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB5Q29vcmQgPSBGaWVsZC5waXhlbDJ1bml0cyhjb29yZER1bXApLnkgLSBCQVRURVJfUkFESVVTX1VOSVRTO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBjb25zb2xlLmxvZyhtb3VzZVggKyAnLCAnICsgRmllbGQuaW5zdGFuY2UuaHRtbC5jc3MoJ2xlZnQnKSk7XG5cblxuICAgICAgICB0aGlzLmNvb3JkLnVuaXQgPSB7eDogeENvb3JkLCB5OiB5Q29vcmR9O1xuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKClcblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXR0ZXI7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTUuMDUuMjAxNVxuICogVGltZTogMTU6NTNcbiAqL1xuXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZC5qc1wiKTtcbmNvbnN0IFVOSVRTID0gXCJ1XCI7XG5jb25zdCBQSVhFTCA9IFwicHhcIjtcbmNsYXNzIENvb3JkIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4XG4gICAgICogQHBhcmFtIHlcbiAgICAgKiBAcGFyYW0ge1VOSVRTIHwgUElYRUx9IHR5cGVcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfXwqfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgdHlwZSA9IFVOSVRTKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl90eXBlID0gXCJDb29yZFwiO1xuICAgICAgICB0aGlzLl9waXhlbCA9IHt4OiAwLCB5OiAwfTtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHt4OiAwLCB5OiAwfTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gVU5JVFMpIHtcbiAgICAgICAgICAgIHRoaXMudW5pdCA9IHt4OiB4LCB5OiB5fTtcbiAgICAgICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBpeGVsID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgdGhpcy5fdW5pdCA9IEZpZWxkLnBpeGVsMnVuaXRzKHRoaXMuX3BpeGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCB0eXBlKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGl6aWVydCBLb29yZGluYXRlblxuICAgICAqIEBwYXJhbSBjb29yZFxuICAgICAqL1xuICAgIG11bHRpcGx5KGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggKiBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAqIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpdmlkaWVydHMgS29vcmRpbmF0ZW4gZHVyY2hcbiAgICAgKiBAcGFyYW0gY29vcmQgdGVpbGVyXG4gICAgICovXG4gICAgZGl2aWRlKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggLyBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAvIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZGllcnQgS29vcmRpbmF0ZW5cbiAgICAgKiBAcGFyYW0gY29vcmQgS29vcmRpbmF0ZSwgZGllIGFkZGllcnQgd2VyZGVuIHNvbGxcbiAgICAgKi9cbiAgICBhZGQoY29vcmQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3VuaXQgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnVuaXQueCArIGNvb3JkLnVuaXQueCxcbiAgICAgICAgICAgIHk6IHRoaXMudW5pdC55ICsgY29vcmQudW5pdC55XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3BpeGVsID0gRmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic3RyYWhpZXJ0IEtvb3JkaW5hdGVuXG4gICAgICogQHBhcmFtIGNvb3JkXG4gICAgICovXG4gICAgc3ViKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl91bml0ID0ge1xuICAgICAgICAgICAgeDogdGhpcy51bml0LnggLSBjb29yZC51bml0LngsXG4gICAgICAgICAgICB5OiB0aGlzLnVuaXQueSAtIGNvb3JkLnVuaXQueVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9waXhlbCA9IEZpZWxkLnVuaXRzMnBpeGVsKHRoaXMuX3VuaXQpO1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IFBpeGVsXG4gICAgICogQHBhcmFtIHt7eDpudW1iZXIseTpudW1iZXJ9fSB4eU9iamVjdFxuICAgICAqL1xuICAgIHNldCBwaXhlbCh4eU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGl4ZWwgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBhIHggYW5kIHkgY29tcG9uZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BpeGVsID0geHlPYmplY3Q7XG4gICAgICAgIHRoaXMuX3VuaXQgPSBGaWVsZC5waXhlbDJ1bml0cyh0aGlzLl9waXhlbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBQaXhlbC1Lb21wb250ZW50ZSBkZXIgS29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHt7eDpudW1iZXIseTpudW1iZXJ9fVxuICAgICAqL1xuICAgIGdldCBwaXhlbCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl9waXhlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW5cbiAgICAgKiBAcGFyYW0ge3t4Om51bWJlcix5Om51bWJlcn19IHh5T2JqZWN0XG4gICAgICovXG4gICAgc2V0IHVuaXQoeHlPYmplY3QpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgeHlPYmplY3QgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4oeHlPYmplY3QueSkgfHwgaXNOYU4oeHlPYmplY3QueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBhIHggYW5kIHkgY29tcG9uZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VuaXQgPSB4eU9iamVjdDtcbiAgICAgICAgdGhpcy5fcGl4ZWwgPSBGaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaWVmZXJ0IERhcnN0ZWxsdW5nZWluaGVpdCBkZXIgS29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHt7eDpudW1iZXIseTpudW1iZXJ9fVxuICAgICAqL1xuICAgIGdldCB1bml0KCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VuaXQ7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBDb29yZDsiLCIvKipcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcbiAqIERhdGU6IDE0LjA1LjIwMTVcbiAqIFRpbWU6IDE4OjA4XG4gKi9cblxuY29uc3QgUkFUSU8gPSAwLjY2NjY2NjtcbmNvbnN0IFJFRlJFU0hfUkFURV9NUyA9IDMwO1xuY29uc3QgQ09MTElESU5HX0RFVEVDVElPTl9SQVRFID0gMTA7XG5jb25zdCBWRVJUX1VOSVRTID0gMTAwMDtcbmNvbnN0IEhPUlpfVU5JVFMgPSBWRVJUX1VOSVRTICogUkFUSU87XG5cbmxldCBzaW5nbGV0b24gPSBTeW1ib2woKTtcbmxldCBzaW5nbGV0b25FbmZvcmNlciA9IFN5bWJvbCgpO1xuXG4vKipcbiAqIFNwaWVsZmVsZFxuICogU2VpdGVuIG3DvHNzZW4gaW0gVmVyaMOkbHRuaXMgMzoyIGFuZ2VsZWd0IHdlcmRlblxuICogQGxpbms6IGh0dHA6Ly90dXJmLm1pc3NvdXJpLmVkdS9zdGF0L2ltYWdlcy9maWVsZC9kaW1ob2NrZXkuZ2lmXG4gKlxuICovXG5jbGFzcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoZW5mb3JjZXIpIHtcblxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGVuZm9yY2VyICE9IHNpbmdsZXRvbkVuZm9yY2VyKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbm5vdCBjb25zdHJ1Y3Qgc2luZ2xldG9uXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IFwiRmllbGRcIjtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5fd2lkdGggPSAwO1xuICAgICAgICB0aGlzLl9maWVsZEhUTUwgPSAkKFwiPHNlY3Rpb24gaWQ9XFxcImZpZWxkXFxcIj5cIik7XG5cbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuXG4gICAgICAgICQod2luZG93KS5yZXNpemUoXG4gICAgICAgICAgICAkLnRocm90dGxlKFJFRlJFU0hfUkFURV9NUywgKCk9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGllbGZlbGQgc29sbHRlIG51ciBlaW5lIEluc3Rhbnogc2VpblxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICh0aGlzW3NpbmdsZXRvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpc1tzaW5nbGV0b25dID0gbmV3IEZpZWxkKHNpbmdsZXRvbkVuZm9yY2VyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1tzaW5nbGV0b25dO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJlcmVjaG5ldCBkaWUgQnJlaXRlIGRlcyBGZWxkZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jYWxjUmF0aW9TaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gJChcImJvZHlcIikuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gdGhpcy5faGVpZ2h0ICogUkFUSU87XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBXYW5kZWwgRGFyc3RlbGx1bmdzZWluaGVpdGVuIGluIFBpeGVsIHVtXG4gICAgICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVtYmVyfSB1bml0XG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHVuaXRzMnBpeGVsKHVuaXQpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdCAhPT0gXCJudW1iZXJcIiAmJiAodHlwZW9mIHVuaXQgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4odW5pdC55KSB8fCBpc05hTih1bml0LngpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdHMycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcbiAgICAgICAgXG5cbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB1bml0IC8gSE9SWl9VTklUUyAqIGZpZWxkLndpZHRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHZlcnRVbml0UmF0aW8gPSB1bml0LnkgLyBWRVJUX1VOSVRTO1xuICAgICAgICAgICAgbGV0IGhvclVuaXRSYXRpbyA9IHVuaXQueCAvIEhPUlpfVU5JVFM7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogZmllbGQud2lkdGggKiBob3JVbml0UmF0aW8sXG4gICAgICAgICAgICAgICAgeTogZmllbGQuaGVpZ2h0ICogdmVydFVuaXRSYXRpb1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbHQgUGllbCBpbiBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9IHBpeGVsXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHBpeGVsMnVuaXRzKHBpeGVsKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHVuaXQgIT09IFwibnVtYmVyXCIgJiYgKHR5cGVvZiBwaXhlbCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTihwaXhlbC55KSB8fCBpc05hTihwaXhlbC54KSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcblxuICAgICAgICBpZiAodHlwZW9mIHVuaXQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHBpeGVsLnggLyBmaWVsZC53aWR0aCAqIEhPUlpfVU5JVFM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0UmF0aW8gPSBwaXhlbC55IC8gZmllbGQuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHdpZHRoUmF0aW8gPSBwaXhlbC54IC8gZmllbGQud2lkdGg7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogd2lkdGhSYXRpbyAqIEhPUlpfVU5JVFMsXG4gICAgICAgICAgICAgICAgeTogaGVpZ2h0UmF0aW8gKiBWRVJUX1VOSVRTXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxuICAgICAqL1xuICAgIGJ1aWxkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgICAgICAvL0VudGZlcm5lIGFsdGVzIFNwaWVsZmVsZFxuICAgICAgICBpZiAodGhpcy5fZmllbGRIVE1MICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5fbmFtZS50b0xvd2VyQ2FzZSgpKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLl9maWVsZEhUTUwpO1xuICAgICAgICB0aGlzLl9maWVsZEhUTUwuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5faGVpZ2h0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuX3dpZHRoLFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy5fd2lkdGggKiAtLjUgLy80IGNlbnRlci1hbGlnbm1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSk9PiB7XG4gICAgICAgICAgICAkKFwiI2ZpZWxkXCIpLmFwcGVuZChlLmh0bWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBaZWljaG5ldCBhbGxlIEdhbWVvYmplY3RzIGVpblxuICAgICAqL1xuICAgIHBsYXkoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCk9PiB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+IHtcbiAgICAgICAgICAgICAgICBlLmNhbGNQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc29sdmVDb2xsaXNpb25zKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCBSRUZSRVNIX1JBVEVfTVMpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRsO8Z3QgbmV1ZSBTcGllbGVsZW1lbnRlIGhpbnp1XG4gICAgICogQHBhcmFtIGdhbWVPYmplY3RcbiAgICAgKi9cbiAgICBkZXBsb3lHYW1lT2JqZWN0KGdhbWVPYmplY3QpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmIChnYW1lT2JqZWN0LnR5cGUgIT09IFwiR2FtZU9iamVjdFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGEgZ2FtZW9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBnYW1lT2JqZWN0LnNldFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLnNldChnYW1lT2JqZWN0Lm5hbWUsIGdhbWVPYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEzDtnN0IGtvbGxpc2lvbmVuIGF1ZlxuICAgICAqL1xuICAgIHNvbHZlQ29sbGlzaW9ucygpIHtcbiAgICAgICAgdmFyIENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLmZvckVhY2goKGUpPT4ge1xuICAgICAgICAgICAgLy/DnGJlcmxhdWYgcmVjaHRzXG4gICAgICAgICAgICBsZXQgZVBvcyA9IGUuY29vcmQudW5pdDtcbiAgICAgICAgICAgIGxldCBlU2l6ZSA9IGUuc2l6ZS51bml0O1xuXG4gICAgICAgICAgICAvL0xlZnQgYm9yZGVyXG4gICAgICAgICAgICBpZiAoZVBvcy54ICsgZVNpemUueCA+IEhPUlpfVU5JVFMpIHtcbiAgICAgICAgICAgICAgICAvL1NldHp0ZSBQdWNrIGFuIGRpZSBXYW5kXG4gICAgICAgICAgICAgICAgZS5jb29yZCA9IG5ldyBDb29yZChIT1JaX1VOSVRTIC0gZS5zaXplLnVuaXQueCwgZS5jb29yZC51bml0LnkpO1xuICAgICAgICAgICAgICAgIGUuc2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgIC8vcXVpcmt5XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8gPSB0aGlzLmNvbGxpc2lvbkRpcmVjdGlvbihlLm1vdmVUbywgMC41ICogTWF0aC5QSSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIC8vIFJpZ2h0IGJvcmRlcj9cbiAgICAgICAgICAgIGlmIChlUG9zLnggPCAwKSB7XG4gICAgICAgICAgICAgICAgZS5tb3ZlVG8gPSB0aGlzLmNvbGxpc2lvbkRpcmVjdGlvbihlLm1vdmVUbywgMS41ICogTWF0aC5QSSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQm90dG9tIGJvcmRlclxuICAgICAgICAgICAgaWYgKGVQb3MueSArIGVTaXplLnkgPiBWRVJUX1VOSVRTKSB7XG4gICAgICAgICAgICAgICAgZS5jb29yZCA9IG5ldyBDb29yZChlLmNvb3JkLnVuaXQueCwgVkVSVF9VTklUUyAtIGUuc2l6ZS51bml0LnkpO1xuICAgICAgICAgICAgICAgIGUuc2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLm1vdmVUbyA9IHRoaXMuY29sbGlzaW9uRGlyZWN0aW9uKGUubW92ZVRvLCBNYXRoLlBJKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgLy9Ub3AgYm9yZGVyXG4gICAgICAgICAgICBpZiAoZVBvcy55IDwgMCkge1xuICAgICAgICAgICAgICAgIGUubW92ZVRvID0gdGhpcy5jb2xsaXNpb25EaXJlY3Rpb24oZS5tb3ZlVG8sIE1hdGguUEkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbGxpc2lvbkRpcmVjdGlvbihvcmlnaW5BbmdsZSwgY29sbGlkaW5nQW5nbGUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGxldCBjb2xBbmdsZSA9IGNvbGxpZGluZ0FuZ2xlICogKDE4MCAvIE1hdGguUEkpO1xuICAgICAgICBsZXQgb3JnQW5nbGUgPSBvcmlnaW5BbmdsZSAqICgxODAgLyBNYXRoLlBJKTtcbiAgICAgICAgbGV0IGRBbmdsZSA9IDIgKiBjb2xBbmdsZSAtIDIgKiBvcmdBbmdsZTtcbiAgICAgICAgcmV0dXJuICgzNjAgKyBvcmdBbmdsZSArIGRBbmdsZSkgJSAzNjA7XG4gICAgfVxuXG4gICAgZ2V0IGh0bWwoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5fZmllbGRIVE1MO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7IiwibGV0IENvb3JkID0gcmVxdWlyZShcIi4vQ29vcmRcIik7XG5cbmNsYXNzIEdhbWVPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGh0bWwsIHhTaXplLCB5U2l6ZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY29vcmQgPSBuZXcgQ29vcmQoKTtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IG5ldyBDb29yZCh4U2l6ZSwgeVNpemUpO1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiR2FtZU9iamVjdFwiO1xuICAgICAgICB0aGlzLl9odG1sID0gaHRtbDtcblxuICAgICAgICB0aGlzLl9tb3ZlVG8gPSAwO1xuICAgICAgICB0aGlzLl9zcGVlZCA9IDU7XG5cbiAgICB9XG5cbiAgICBnZXQgdHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cblxuICAgIGdldCBzaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2lua2VsIGRlciBCRXdlZ3VuZ3NyaWNodHVuZyBpbiByYWQhXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgbW92ZVRvKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vdmVUbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaW5rZWwsIGRlciBCZXdlZ3VuZ3NyaWNodHVuZ1xuICAgICAqIDDCsCA9PSByZWNodCwgOTDCsCA9PSB1bnRlblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZVxuICAgICAqL1xuICAgIHNldCBtb3ZlVG8oYW5nbGUpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgYW5nbGUgIT09IFwibnVtYmVyXCIgfHwgYW5nbGUgPCAwIHx8IGFuZ2xlID4gMzYwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGFuIEludGVnZXIgYmV0d2VlbiAwwrAgYW5kIDM2MMKwXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVRvID0gKE1hdGguUEkgLyAxODApICogYW5nbGU7XG4gICAgfVxuXG4gICAgc2V0UG9zaXRpb24oKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9odG1sLmNzcyh7XG4gICAgICAgICAgICB0b3A6IHRoaXMuX2Nvb3JkLnBpeGVsLnksXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLl9jb29yZC5waXhlbC54XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2FsY1Bvc2l0aW9uKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5jb29yZC5hZGQodGhpcy5zcGVlZEFzQ29vcmQpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGNvb3JkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY29vcmQ7XG4gICAgfVxuXG4gICAgc2V0IGNvb3JkKGNvb3JkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jb29yZCA9IGNvb3JkO1xuICAgIH1cblxuICAgIGdldCBodG1sKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0bWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBkaWUgR2VzY2h3aW5kaWdrZWl0IGluIFgvWS1Lb21wb25lbnRlXG4gICAgICovXG4gICAgZ2V0IHNwZWVkQXNDb29yZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIC8vUG9sYXJrb29yZGluYXRlbi1Lb252ZXJzaW9uXG4gICAgICAgIGxldCB4ID0gTWF0aC5jb3ModGhpcy5fbW92ZVRvKSAqIHRoaXMuX3NwZWVkO1xuICAgICAgICBsZXQgeSA9IE1hdGguc2luKHRoaXMuX21vdmVUbykgKiB0aGlzLl9zcGVlZDtcbiAgICAgICAgLy8gcnVuZGVuXG4gICAgICAgIHggPSBNYXRoLnJvdW5kKHggKiAxMDApIC8gMTAwO1xuICAgICAgICB5ID0gTWF0aC5yb3VuZCh5ICogMTAwKSAvIDEwMDtcblxuICAgICAgICByZXR1cm4gbmV3IENvb3JkKHgsIHkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VzY2h3aW5kaWdrZWl0L3p1csO8Y2tnZWxlZ3RlIERpc3RhbnogamUgVGlja1xuICAgICAqIEByZXR1cm5zIHtpbnR9XG4gICAgICovXG4gICAgZ2V0IHNwZWVkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwZWVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlc2Nod2luZGlna2VpdC96dXLDvGNrZ2VsZWd0ZSBEaXN0YW56IGplIFRpY2tcbiAgICAgKiBAcGFyYW0ge2ludH0gc3BlZWRWYWx1ZVxuICAgICAqL1xuICAgIHNldCBzcGVlZChzcGVlZFZhbHVlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc3BlZWRWYWx1ZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJNdXNzIGJlIGEgaW50ZWdlclwiKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NwZWVkID0gc3BlZWRWYWx1ZTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVPYmplY3Q7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XG4gKiBUaW1lOiAxNToyNlxuICovXG5cbnZhciBHYW1lT2JqZWN0ID0gcmVxdWlyZShcIi4vR2FtZU9iamVjdFwiKTtcbnZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuY29uc3QgVkVMT0NJVFkgPSAtMC41OyAvL2dnZi4gc3DDpHRlciBhdXN0YXVzY2hlbiBnZWdlbiBGdW5rdGlvbiBmKHQpXG5jb25zdCBQVUNLX1JBRElVU19VTklUUyA9IDE2O1xuXG5jbGFzcyBQdWNrIGV4dGVuZHMgR2FtZU9iamVjdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyKFwiUHVja1wiLCAkKFwiPGIgaWQ9XFxcInB1Y2tcXFwiIC8+XCIpLCBQVUNLX1JBRElVU19VTklUUyAqIDIsIFBVQ0tfUkFESVVTX1VOSVRTICogMik7XG5cblxuXG5cbiAgICAgICAgc3VwZXIuaHRtbC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHN1cGVyLnNpemUucGl4ZWwueCxcbiAgICAgICAgICAgIGhlaWdodDogc3VwZXIuc2l6ZS5waXhlbC55XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBiYXNlVHlwZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLnR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgUHVjayBhdWYgUG9zaXRpb25cbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLnNldFBvc2l0aW9uKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZXJlY2huZXQgUG9zaXRpb24sIG9obmUgc2llIHp1IHNldHplblxuICAgICAqL1xuICAgIGNhbGNQb3NpdGlvbigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHN1cGVyLmNhbGNQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBkaWUgUHVjay1ncsO2w59lXG4gICAgICogQHJldHVybnMge0Nvb3JkfVxuICAgICAqL1xuICAgIGdldCBzaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNpemU7XG4gICAgfVxuXG5cbn1cbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvKipcbiAqIFJlaW5lIFRlY2gtZGVtbywga2FubiBhdXNnZWJsZW5kZXQgd2VyZGVuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUNvbG9yKCkge1xuICAgICAgICB2YXIgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gICAgICAgIHZhciBjb2xvciA9ICcjJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBoID0gTWF0aC5yYW5kb20oKSAqIDE2Oy8vd2VpbCBoZXhhXG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGguZmxvb3IoaCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoXCJtb3VzZV9hY3Rpdml0eVwiLCB7eDogZXZlbnQucGFnZVgsIHk6IGV2ZW50LnBhZ2VZfSk7XG4gICAgfSk7XG5cblxuICAgIHNvY2tldC5vbihcInVzZXJQb3NpdGlvbnNcIiwgZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHBvc2l0aW9ucykge1xuICAgICAgICAgICAgdmFyIGNvb3JkcyA9IHBvc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGlmIChjb29yZHMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9ICQoXCIjXCIgKyBpKTtcbiAgICAgICAgICAgICAgICBpZiAoIWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCgnPGIgaWQ9XCInICsgaSArICdcIj4rPC9iPicpO1xuICAgICAgICAgICAgICAgICAgICBlID0gJChcIiNcIiArIGkpO1xuICAgICAgICAgICAgICAgICAgICBlLmNzcyhcImJhY2tncm91bmRDb2xvclwiLCBnZXRSYW5kb21Db2xvcigpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLmNzcyhcImxlZnRcIiwgY29vcmRzLnggLSAxMCk7XG4gICAgICAgICAgICAgICAgZS5jc3MoXCJ0b3BcIiwgY29vcmRzLnkgLSAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBzb2NrZXQub24oJ3VzZXJBbW91bnQnLCBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgICQoXCIjdXNlckFtb3VudFwiKS50ZXh0KGFtb3VudCk7XG4gICAgfSk7XG59KSgpOyIsIi8vTm90IHVzZWQgYW55bW9yZVxucmVxdWlyZShcIi4vX190ZWNoZGVtb1wiKTtcblxuXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcbnZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcbnZhciBCYXR0ZXIgPSByZXF1aXJlKFwiLi9CYXR0ZXJcIik7XG52YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcblxuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAvL1plaWNobmUgU3BpZWxmZWxkXG4gICAgbGV0IGZpZWxkID0gRmllbGQuaW5zdGFuY2U7XG4gICAgbGV0IHB1Y2sgPSBuZXcgUHVjaygpO1xuXG4gICAgcHVjay5jb29yZCA9IG5ldyBDb29yZCgwLCA4MCk7XG4gICAgcHVjay5zcGVlZCA9IDE1O1xuICAgIHB1Y2subW92ZVRvID0gNDU7IC8vIG5hY2ggbGlua3MgYml0dGVcblxuICAgIC8vdmFyIHBsYXllcjEgPSBuZXcgQmF0dGVyKCdwbGF5ZXIxJywgJ3RvcCcpO1xuICAgIHZhciBwbGF5ZXIyID0gbmV3IEJhdHRlcigncGxheWVyMicsICdib3R0b20nKTtcbiAgICAvL3BsYXllcjEuY29vcmQgPSBuZXcgQ29vcmQoZmllbGQuX3dpZHRoLzIsZmllbGQuX2hlaWdodC80KTtcbiAgICBwbGF5ZXIyLmNvb3JkID0gbmV3IENvb3JkKGZpZWxkLl93aWR0aC8yLDMqKGZpZWxkLl9oZWlnaHQvNCkpO1xuXG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwdWNrKTtcbiAgICAvL2ZpZWxkLmRlcGxveUdhbWVPYmplY3QocGxheWVyMSk7XG4gICAgZmllbGQuZGVwbG95R2FtZU9iamVjdChwbGF5ZXIyKTtcbiAgICBmaWVsZC5idWlsZCgpO1xuICAgIC8vZmllbGQucGxheSgpO1xuXG4gICAgJChkb2N1bWVudCkub24oXCJtb3VzZW1vdmVcIiwgJC50aHJvdHRsZSggMCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHBsYXllcjIucmVmcmVzaFBvc2l0aW9uKGV2ZW50KTtcbiAgICB9KSk7XG59KTtcblxuXG5cbiJdfQ==
