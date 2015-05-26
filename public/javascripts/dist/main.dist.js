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

var Coord = (function () {
    function Coord() {
        "use strict";

        _classCallCheck(this, Coord);

        this._pixel = { x: 0, y: 0 };
        this._unit = { x: 0, y: 0 };
    }

    _createClass(Coord, [{
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
            this._pixel = Field.units2pixel(this._unit);
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
            this._unit = Field.pixel2units(this._pixel);
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
var REFRESH_RATE_MS = 200;
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

        _classCallCheck(this, Field);

        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this._gameObjects = new Map();
        this._name = "Field";
        this._height = 0;
        this._width = 0;
        this._fieldHTML = $("<section id=\"field\">");

        var fieldRef = this;
        $(window).resize($.throttle(REFRESH_RATE_MS, function () {
            fieldRef.build();
        }));
        this._calcRatioSize();
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
                console.log(e);
                $("#field").append(e.html);
            });
        }
    }, {
        key: "play",

        /**
         * Zeichnet alle Gameobjects ein
         */
        value: function play() {
            var _this = this;

            "use strict";
            window.setInterval(function () {
                _this._gameObjects.forEach(function (e, i) {
                    e.calcPosition();
                    console.log(e.coord.unit);
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
            gameObject.calcPosition();
            this._gameObjects.set(gameObject.name, gameObject);
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

},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Coord = require("./Coord");

var GameObject = (function () {
    function GameObject(name) {
        "use strict";

        _classCallCheck(this, GameObject);

        this._coord = new Coord();
        this._name = name;
        this._type = "GameObject";
        this._movement = {
            x: 30,
            y: 50
        };
    }

    _createClass(GameObject, [{
        key: "type",
        get: function () {
            "use strict";
            return this._type;
        }
    }, {
        key: "movement",
        set: function (XYobject) {
            "use strict";
            this._movement = XYobject;
        }
    }, {
        key: "calcPosition",
        value: function calcPosition() {
            "use strict";
            var pos = this._coord.unit;

            this.coord.unit = {
                x: pos.x + this._movement.x,
                y: pos.y + this._movement.y
            };
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
var velocity = -0.5; //ggf. später austauschen gegen Funktion f(t)

var Puck = (function (_GameObject) {
    function Puck() {
        "use strict";

        _classCallCheck(this, Puck);

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this, "Puck");

        this._puckHTML = $("<b id=\"puck\" />");
    }

    _inherits(Puck, _GameObject);

    _createClass(Puck, [{
        key: "BaseType",
        get: function () {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "type", this);
        }
    }, {
        key: "calcPosition",
        value: function calcPosition() {
            "use strict";
            _get(Object.getPrototypeOf(Puck.prototype), "calcPosition", this).call(this);
            this._puckHTML.css({
                top: _get(Object.getPrototypeOf(Puck.prototype), "coord", this).pixel.y,
                left: _get(Object.getPrototypeOf(Puck.prototype), "coord", this).pixel.x

            });
        }
    }, {
        key: "html",
        get: function () {
            "use strict";
            return this._puckHTML;
        }
    }]);

    return Puck;
})(GameObject);

module.exports = Puck;

},{"./GameObject":3}],5:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

function errorNotification(mess) {
    "use strict";
}

$(function () {
    //Zeichne Spielfeld
    var Field = require("./Field");
    var field = Field.instance;

    var Puck = require("./Puck");
    var puck = new Puck();

    field.deployGameObject(puck);
    field.build();
    field.play();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.unit = { x: 50, y: 100 };

    var dot = $("<span id=\"dot\">.</span>").css({
        position: "relative",
        top: coord.pixel.y,
        left: coord.pixel.x
    });
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztJQUM1QixLQUFLO0FBQ0ksYUFEVCxLQUFLLEdBQ087QUFDVixvQkFBWSxDQUFDOzs4QkFGZixLQUFLOztBQUdILFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUE7S0FDNUI7O2lCQUxDLEtBQUs7Ozs7Ozs7YUFXRSxVQUFDLFFBQVEsRUFBRTtBQUNoQix3QkFBWSxDQUFDO0FBQ2IsZ0JBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJ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QUFHLEVBQUMsQ0FBQzs7QUFFeEIsUUFBSSxHQUFHLEdBQUMsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ3ZDLGdCQUFRLEVBQUMsVUFBVTtBQUNuQixXQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xCLFlBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEIsQ0FBQyxDQUFDO0NBR04sQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTUuMDUuMjAxNVxuICogVGltZTogMTU6NTNcbiAqL1xuXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZC5qc1wiKTtcbmNsYXNzIENvb3JkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX3BpeGVsID0ge3g6IDAsIHk6IDB9O1xuICAgICAgICB0aGlzLl91bml0ID0ge3g6IDAsIHk6IDB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgUGl4ZWxcbiAgICAgKiBAcGFyYW0ge3t4Om51bWJlcix5Om51bWJlcn19IHh5T2JqZWN0XG4gICAgICovXG4gICAgc2V0IHBpeGVsKHh5T2JqZWN0KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAodHlwZW9mIHh5T2JqZWN0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHh5T2JqZWN0LnkpIHx8IGlzTmFOKHh5T2JqZWN0LngpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwaXhlbCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGl4ZWw9eHlPYmplY3Q7XG4gICAgICAgIHRoaXMuX3VuaXQ9RmllbGQucGl4ZWwydW5pdHModGhpcy5fcGl4ZWwpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaWVmZXJ0IFBpeGVsLUtvbXBvbnRlbnRlIGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge3t4Om51bWJlcix5Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IHBpeGVsKCl7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9waXhlbD1GaWVsZC51bml0czJwaXhlbCh0aGlzLl91bml0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpeGVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IERhcnN0ZWxsdW5nc2VpbmhlaXRlblxuICAgICAqIEBwYXJhbSB7e3g6bnVtYmVyLHk6bnVtYmVyfX0geHlPYmplY3RcbiAgICAgKi9cbiAgICBzZXQgdW5pdCh4eU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB4eU9iamVjdCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTih4eU9iamVjdC55KSB8fCBpc05hTih4eU9iamVjdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdCBtdXN0IGJlIGFuIG9iamVjdCB3aXRoIGEgeCBhbmQgeSBjb21wb25lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdW5pdD14eU9iamVjdDtcbiAgICAgICAgdGhpcy5fcGl4ZWw9RmllbGQudW5pdHMycGl4ZWwodGhpcy5fdW5pdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBEYXJzdGVsbHVuZ2VpbmhlaXQgZGVyIEtvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyB7e3g6bnVtYmVyLHk6bnVtYmVyfX1cbiAgICAgKi9cbiAgICBnZXQgdW5pdCgpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fdW5pdD1GaWVsZC5waXhlbDJ1bml0cyh0aGlzLl9waXhlbCk7XG4gICAgICAgIHJldHVybiB0aGlzLl91bml0O1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzPUNvb3JkOyIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTQuMDUuMjAxNVxuICogVGltZTogMTg6MDhcbiAqL1xuXG5jb25zdCBSQVRJTyA9IDAuNjY2NjY2O1xuY29uc3QgUkVGUkVTSF9SQVRFX01TID0gMjAwO1xuY29uc3QgVkVSVF9VTklUUyA9IDEwMDA7XG5jb25zdCBIT1JaX1VOSVRTID0gVkVSVF9VTklUUyAqIFJBVElPO1xuXG5sZXQgc2luZ2xldG9uID0gU3ltYm9sKCk7XG5sZXQgc2luZ2xldG9uRW5mb3JjZXIgPSBTeW1ib2woKTtcblxuLyoqXG4gKiBTcGllbGZlbGRcbiAqIFNlaXRlbiBtw7xzc2VuIGltIFZlcmjDpGx0bmlzIDM6MiBhbmdlbGVndCB3ZXJkZW5cbiAqIEBsaW5rOiBodHRwOi8vdHVyZi5taXNzb3VyaS5lZHUvc3RhdC9pbWFnZXMvZmllbGQvZGltaG9ja2V5LmdpZlxuICpcbiAqL1xuY2xhc3MgRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKGVuZm9yY2VyKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZW5mb3JjZXIgIT0gc2luZ2xldG9uRW5mb3JjZXIpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2Fubm90IGNvbnN0cnVjdCBzaW5nbGV0b25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9uYW1lID0gXCJGaWVsZFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLl93aWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX2ZpZWxkSFRNTCA9ICQoXCI8c2VjdGlvbiBpZD1cXFwiZmllbGRcXFwiPlwiKTtcblxuICAgICAgICB2YXIgZmllbGRSZWYgPSB0aGlzO1xuICAgICAgICAkKHdpbmRvdykucmVzaXplKFxuICAgICAgICAgICAgJC50aHJvdHRsZShSRUZSRVNIX1JBVEVfTVMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFJlZi5idWlsZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzW3NpbmdsZXRvbl0gPSBuZXcgRmllbGQoc2luZ2xldG9uRW5mb3JjZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3NpbmdsZXRvbl07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmVyZWNobmV0IGRpZSBCcmVpdGUgZGVzIEZlbGRlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGNSYXRpb1NpemUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSAkKFwiYm9keVwiKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB0aGlzLl9oZWlnaHQgKiBSQVRJTztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gaW4gUGl4ZWwgdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHVuaXRcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgdW5pdHMycGl4ZWwodW5pdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHVuaXQueSkgfHwgaXNOYU4odW5pdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgICAgICBsZXQgdmVydFVuaXRSYXRpbyA9IHVuaXQueSAvIFZFUlRfVU5JVFM7XG4gICAgICAgIGxldCBob3JVbml0UmF0aW8gPSB1bml0LnggLyBIT1JaX1VOSVRTO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBmaWVsZC53aWR0aCAqIGhvclVuaXRSYXRpbyxcbiAgICAgICAgICAgIHk6IGZpZWxkLmhlaWdodCAqIHZlcnRVbml0UmF0aW9cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYW5kZWx0IFBpZWwgaW4gRGFyc3RlbGx1bmdzZWluaGVpdGVuIHVtXG4gICAgICogQHBhcmFtIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fSBwaXhlbFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyBwaXhlbDJ1bml0cyhwaXhlbCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBwaXhlbCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTihwaXhlbC55KSB8fCBpc05hTihwaXhlbC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgICAgICBsZXQgaGVpZ2h0UmF0aW8gPSBwaXhlbC55IC8gZmllbGQuaGVpZ2h0O1xuICAgICAgICBsZXQgd2lkdGhSYXRpbyA9IHBpeGVsLnggLyBmaWVsZC53aWR0aDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogd2lkdGhSYXRpbyAqIEhPUlpfVU5JVFMsXG4gICAgICAgICAgICB5OiBoZWlnaHRSYXRpbyAqIFZFUlRfVU5JVFNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBsYXR6aWVydCBkYXMgRmVsZCBpbSBCcm93c2VyXG4gICAgICovXG4gICAgYnVpbGQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XG4gICAgICAgIC8vRW50ZmVybmUgYWx0ZXMgU3BpZWxmZWxkXG4gICAgICAgIGlmICh0aGlzLl9maWVsZEhUTUwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLl9uYW1lLnRvTG93ZXJDYXNlKCkpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuX2ZpZWxkSFRNTCk7XG4gICAgICAgIHRoaXMuX2ZpZWxkSFRNTC5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9oZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5fd2lkdGgsXG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiB0aGlzLl93aWR0aCAqIC0uNSAvLzQgY2VudGVyLWFsaWdubWVudFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9nYW1lT2JqZWN0cy5mb3JFYWNoKChlKT0+e1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAkKFwiI2ZpZWxkXCIpLmFwcGVuZChlLmh0bWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBaZWljaG5ldCBhbGxlIEdhbWVvYmplY3RzIGVpblxuICAgICAqL1xuICAgIHBsYXkoKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5fZ2FtZU9iamVjdHMuZm9yRWFjaCgoZSxpKT0+e1xuICAgICAgICAgICAgICAgIGUuY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5jb29yZC51bml0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFJFRlJFU0hfUkFURV9NUyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGw7xndCBuZXVlIFNwaWVsZWxlbWVudGUgaGluenVcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdFxuICAgICAqL1xuICAgIGRlcGxveUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGdhbWVPYmplY3QudHlwZSAhPT0gXCJHYW1lT2JqZWN0XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgYSBnYW1lb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGdhbWVPYmplY3QuY2FsY1Bvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuX2dhbWVPYmplY3RzLnNldChnYW1lT2JqZWN0Lm5hbWUsZ2FtZU9iamVjdCk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCJsZXQgQ29vcmQ9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xuY2xhc3MgR2FtZU9iamVjdHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jb29yZD1uZXcgQ29vcmQoKTtcbiAgICAgICAgdGhpcy5fbmFtZT1uYW1lO1xuICAgICAgICB0aGlzLl90eXBlPVwiR2FtZU9iamVjdFwiO1xuICAgICAgICB0aGlzLl9tb3ZlbWVudD17XG4gICAgICAgICAgICB4OjMwLFxuICAgICAgICAgICAgeTo1MFxuICAgICAgICB9XG5cbiAgICB9XG4gICAgZ2V0IHR5cGUoKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cbiAgICBzZXQgbW92ZW1lbnQoWFlvYmplY3Qpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fbW92ZW1lbnQ9WFlvYmplY3Q7XG4gICAgfVxuICAgIGNhbGNQb3NpdGlvbigpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgbGV0IHBvcz10aGlzLl9jb29yZC51bml0O1xuXG4gICAgICAgIHRoaXMuY29vcmQudW5pdD17XG4gICAgICAgICAgICB4OnBvcy54K3RoaXMuX21vdmVtZW50LngsXG4gICAgICAgICAgICB5OnBvcy55K3RoaXMuX21vdmVtZW50LnlcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgbmFtZSgpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCBjb29yZCgpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvb3JkO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzPUdhbWVPYmplY3Q7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcclxuICogRGF0ZTogMTUuMDUuMjAxNVxyXG4gKiBUaW1lOiAxNToyNlxyXG4gKi9cclxuXHJcbnZhciBHYW1lT2JqZWN0ID0gcmVxdWlyZShcIi4vR2FtZU9iamVjdFwiKTtcclxuY29uc3QgdmVsb2NpdHkgPSAtMC41OyAvL2dnZi4gc3DDpHRlciBhdXN0YXVzY2hlbiBnZWdlbiBGdW5rdGlvbiBmKHQpXHJcblxyXG5jbGFzcyBQdWNrIGV4dGVuZHMgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIoXCJQdWNrXCIpO1xyXG5cclxuICAgICAgICB0aGlzLl9wdWNrSFRNTCA9ICQoXCI8YiBpZD1cXFwicHVja1xcXCIgLz5cIik7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBCYXNlVHlwZSgpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlci50eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGNQb3NpdGlvbigpIHtcclxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgICAgICBzdXBlci5jYWxjUG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLl9wdWNrSFRNTC5jc3Moe1xyXG4gICAgICAgICAgICB0b3A6IHN1cGVyLmNvb3JkLnBpeGVsLnksXHJcbiAgICAgICAgICAgIGxlZnQ6IHN1cGVyLmNvb3JkLnBpeGVsLnhcclxuXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGdldCBodG1sKCl7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3B1Y2tIVE1MO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gUHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKG1lc3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufVxyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxyXG4gICAgdmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbiAgICB2YXIgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcclxuXHJcblxyXG5cclxuICAgIHZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuICAgIHZhciBwdWNrID0gbmV3IFB1Y2soKTtcclxuXHJcbiAgICBmaWVsZC5kZXBsb3lHYW1lT2JqZWN0KHB1Y2spO1xyXG4gICAgZmllbGQuYnVpbGQoKTtcclxuICAgIGZpZWxkLnBsYXkoKTtcclxuXHJcbiAgICB2YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuICAgIHZhciBjb29yZCA9IG5ldyBDb29yZCgpO1xyXG4gICAgY29vcmQudW5pdD17eDo1MCx5OjEwMH07XHJcblxyXG4gICAgdmFyIGRvdD0kKFwiPHNwYW4gaWQ9XFxcImRvdFxcXCI+Ljwvc3Bhbj5cIikuY3NzKHtcclxuICAgICAgICBwb3NpdGlvbjpcInJlbGF0aXZlXCIsXHJcbiAgICAgICAgdG9wOiBjb29yZC5waXhlbC55LFxyXG4gICAgICAgIGxlZnQ6IGNvb3JkLnBpeGVsLnhcclxuICAgIH0pO1xyXG5cclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG4iXX0=
