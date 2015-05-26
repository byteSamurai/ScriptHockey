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

        this.pixel = { x: 0, y: 0 };
        this.units = { x: 0, y: 0 };
    }

    _createClass(Coord, [{
        key: "setPixel",

        /**
         * Setzt Pixel
         * @param {Number} x
         * @param {Number} y
         */
        value: function setPixel(x, y) {
            "use strict";
            this.pixel.x = x;
            this.pixel.y = y;
            this.units = Field.pixel2units(this.pixel);
        }
    }, {
        key: "setUnits",

        /**
         * Setzt Darstellungseinheiten
         * @param {Number} x
         * @param {Number} y
         */
        value: function setUnits(x, y) {
            "use strict";
            this.units.x = x;
            this.units.y = y;
            this.pixel = Field.units2pixel(this.units);
        }
    }, {
        key: "getPixel",

        /**
         * Liefert Pixel-Kompontente der Koordinate
         * @returns {Coord.pixel}
         */
        value: function getPixel() {
            "use strict";
            this.pixel = Field.units2pixel(this.units);
            return this.pixel;
        }
    }, {
        key: "getUnits",

        /**
         * Liefert Darstellungeinheit der Koordinate
         * @returns {Coord.units|*}
         */
        value: function getUnits() {
            "use strict";
            this.units = Field.pixel2units(this.pixel);
            return this.units;
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
var DEBOUNCE_DELAY_MS = 50;
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

        this.gameObjects = new Map();
        this.name = "Field";
        this.height = 0;
        this.width = 0;
        this.fieldHTML = $("<section id=\"field\">");

        var fieldRef = this;
        $(window).resize($.throttle(DEBOUNCE_DELAY_MS, function () {
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
            this.height = $("body").height();
            this.width = this.height * RATIO;
        }
    }, {
        key: "getWidth",
        value: function getWidth() {
            return this.width;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.height;
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
            if (this.fieldHTML !== null) {
                $("#" + this.name.toLowerCase()).remove();
            }

            $("body").append(this.fieldHTML);
            this.fieldHTML.css({
                height: this.height,
                width: this.width,
                marginLeft: this.width * -0.5 //4 center-alignment
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
            if (typeof gameObject !== "GameObject") {
                throw new Error("Must be a gameobject");
            }
            this.gameObjects.add();
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
                x: field.getWidth() * horUnitRatio,
                y: field.getHeight() * vertUnitRatio
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
            var heightRatio = pixel.y / field.getHeight();
            var widthRatio = pixel.x / field.getWidth();

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

var GameObject = (function () {
    function GameObject() {
        "use strict";

        _classCallCheck(this, GameObject);

        this.x = 0;
        this.y = 0;
    }

    _createClass(GameObject, [{
        key: "moveTo",
        value: function moveTo() {
            "use strict";
        }
    }]);

    return GameObject;
})();

module.exports = GameObject;

},{}],4:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

        _get(Object.getPrototypeOf(Puck.prototype), "constructor", this).call(this);

        this.puckHTML = $("<b id=\"puck\" />");
    }

    _inherits(Puck, _GameObject);

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
    var field = Field.instance.build();

    var Puck = require("./Puck");
    var puck = new Puck();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.setUnits(50, 100);

    console.log(coord.getPixel());

    var dot = $("<span id=\"dot\">.</span>").css({
        position: "relative",
        top: coord.getPixel().y,
        left: coord.getPixel().x
    });
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztJQUM1QixLQUFLO0FBQ0ksYUFEVCxLQUFLLEdBQ087QUFDVixvQkFBWSxDQUFDOzs4QkFGZixLQUFLOztBQUdILFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUE7S0FDNUI7O2lCQUxDLEtBQUs7Ozs7Ozs7O2VBWUMsa0JBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNYLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssQ0FB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QUM7O0FBRXhCLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7O0FBRTlCLFFBQUksR0FBRyxHQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN2QyxnQkFBUSxFQUFDLFVBQVU7QUFDbkIsV0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLFlBQUksRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUMzQixDQUFDLENBQUM7Q0FHTixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XG4gKiBUaW1lOiAxNTo1M1xuICovXG5cbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkLmpzXCIpO1xuY2xhc3MgQ29vcmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5waXhlbCA9IHt4OiAwLCB5OiAwfTtcbiAgICAgICAgdGhpcy51bml0cyA9IHt4OiAwLCB5OiAwfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IFBpeGVsXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqL1xuICAgIHNldFBpeGVsKHgsIHkpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMucGl4ZWwueCA9IHg7XG4gICAgICAgIHRoaXMucGl4ZWwueSA9IHk7XG4gICAgICAgIHRoaXMudW5pdHM9RmllbGQucGl4ZWwydW5pdHModGhpcy5waXhlbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0enQgRGFyc3RlbGx1bmdzZWluaGVpdGVuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geVxuICAgICAqL1xuICAgIHNldFVuaXRzKHgsIHkpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMudW5pdHMueCA9IHg7XG4gICAgICAgIHRoaXMudW5pdHMueSA9IHk7XG4gICAgICAgIHRoaXMucGl4ZWw9RmllbGQudW5pdHMycGl4ZWwodGhpcy51bml0cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBQaXhlbC1Lb21wb250ZW50ZSBkZXIgS29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm5zIHtDb29yZC5waXhlbH1cbiAgICAgKi9cbiAgICBnZXRQaXhlbCgpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5waXhlbD1GaWVsZC51bml0czJwaXhlbCh0aGlzLnVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGl4ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGllZmVydCBEYXJzdGVsbHVuZ2VpbmhlaXQgZGVyIEtvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyB7Q29vcmQudW5pdHN8Kn1cbiAgICAgKi9cbiAgICBnZXRVbml0cygpe1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy51bml0cz1GaWVsZC5waXhlbDJ1bml0cyh0aGlzLnBpeGVsKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5pdHM7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHM9Q29vcmQ7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNC4wNS4yMDE1XG4gKiBUaW1lOiAxODowOFxuICovXG5cbmNvbnN0IFJBVElPID0gMC42NjY2NjY7XG5jb25zdCBERUJPVU5DRV9ERUxBWV9NUyA9IDUwO1xuY29uc3QgVkVSVF9VTklUUyA9IDEwMDA7XG5jb25zdCBIT1JaX1VOSVRTID0gVkVSVF9VTklUUyAqIFJBVElPO1xuXG5sZXQgc2luZ2xldG9uID0gU3ltYm9sKCk7XG5sZXQgc2luZ2xldG9uRW5mb3JjZXIgPSBTeW1ib2woKTtcblxuLyoqXG4gKiBTcGllbGZlbGRcbiAqIFNlaXRlbiBtw7xzc2VuIGltIFZlcmjDpGx0bmlzIDM6MiBhbmdlbGVndCB3ZXJkZW5cbiAqIEBsaW5rOiBodHRwOi8vdHVyZi5taXNzb3VyaS5lZHUvc3RhdC9pbWFnZXMvZmllbGQvZGltaG9ja2V5LmdpZlxuICpcbiAqL1xuY2xhc3MgRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKGVuZm9yY2VyKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBpZiAoZW5mb3JjZXIgIT0gc2luZ2xldG9uRW5mb3JjZXIpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2Fubm90IGNvbnN0cnVjdCBzaW5nbGV0b25cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiRmllbGRcIjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgdGhpcy5maWVsZEhUTUwgPSAkKFwiPHNlY3Rpb24gaWQ9XFxcImZpZWxkXFxcIj5cIik7XG5cbiAgICAgICAgdmFyIGZpZWxkUmVmID0gdGhpcztcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShcbiAgICAgICAgICAgICQudGhyb3R0bGUoREVCT1VOQ0VfREVMQVlfTVMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFJlZi5idWlsZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwaWVsZmVsZCBzb2xsdGUgbnVyIGVpbmUgSW5zdGFueiBzZWluXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXNbc2luZ2xldG9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzW3NpbmdsZXRvbl0gPSBuZXcgRmllbGQoc2luZ2xldG9uRW5mb3JjZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3NpbmdsZXRvbl07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmVyZWNobmV0IGRpZSBCcmVpdGUgZGVzIEZlbGRlc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGNSYXRpb1NpemUoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLmhlaWdodCA9ICQoXCJib2R5XCIpLmhlaWdodCgpO1xuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgKiBSQVRJTztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbCBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gaW4gUGl4ZWwgdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHVuaXRcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgdW5pdHMycGl4ZWwodW5pdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHVuaXQueSkgfHwgaXNOYU4odW5pdC54KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5pdDJwaXhlbCBtdXN0IGdldCBhIG9iamVjdCBhcyBwYXJhbWV0ZXIgd2l0aCB4IGFuZCB5IGFzIGEgTnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmaWVsZCA9IEZpZWxkLmluc3RhbmNlO1xuICAgICAgICBsZXQgdmVydFVuaXRSYXRpbyA9IHVuaXQueSAvIFZFUlRfVU5JVFM7XG4gICAgICAgIGxldCBob3JVbml0UmF0aW8gPSB1bml0LnggLyBIT1JaX1VOSVRTO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBmaWVsZC5nZXRXaWR0aCgpICogaG9yVW5pdFJhdGlvLFxuICAgICAgICAgICAgeTogZmllbGQuZ2V0SGVpZ2h0KCkgKiB2ZXJ0VW5pdFJhdGlvXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2FuZGVsdCBQaWVsIGluIERhcnN0ZWxsdW5nc2VpbmhlaXRlbiB1bVxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gcGl4ZWxcbiAgICAgKiBAcmV0dXJucyB7e3g6IG51bWJlciwgeTogbnVtYmVyfX1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGl4ZWwydW5pdHMocGl4ZWwpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmICh0eXBlb2YgcGl4ZWwgIT09IFwib2JqZWN0XCIgfHwgaXNOYU4ocGl4ZWwueSkgfHwgaXNOYU4ocGl4ZWwueCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuaXQycGl4ZWwgbXVzdCBnZXQgYSBvYmplY3QgYXMgcGFyYW1ldGVyIHdpdGggeCBhbmQgeSBhcyBhIE51bWJlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmllbGQgPSBGaWVsZC5pbnN0YW5jZTtcbiAgICAgICAgbGV0IGhlaWdodFJhdGlvID0gcGl4ZWwueSAvIGZpZWxkLmdldEhlaWdodCgpO1xuICAgICAgICBsZXQgd2lkdGhSYXRpbyA9IHBpeGVsLnggLyBmaWVsZC5nZXRXaWR0aCgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB3aWR0aFJhdGlvICogSE9SWl9VTklUUyxcbiAgICAgICAgICAgIHk6IGhlaWdodFJhdGlvICogVkVSVF9VTklUU1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgICB9XG5cbiAgICBnZXRIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxuICAgICAqL1xuICAgIGJ1aWxkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgICAgICAvL0VudGZlcm5lIGFsdGVzIFNwaWVsZmVsZFxuICAgICAgICBpZiAodGhpcy5maWVsZEhUTUwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyB0aGlzLm5hbWUudG9Mb3dlckNhc2UoKSkucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5maWVsZEhUTUwpO1xuICAgICAgICB0aGlzLmZpZWxkSFRNTC5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogdGhpcy53aWR0aCAqIC0uNSAvLzQgY2VudGVyLWFsaWdubWVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGw7xndCBuZXVlIFNwaWVsZWxlbWVudGUgaGluenVcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdFxuICAgICAqL1xuICAgIGRlcGxveUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHR5cGVvZiBnYW1lT2JqZWN0ICE9PSBcIkdhbWVPYmplY3RcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBhIGdhbWVvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5hZGQoKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkOyIsImNsYXNzIEdhbWVPYmplY3R7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgIH1cbiAgICBtb3ZlVG8oKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cz1HYW1lT2JqZWN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXHJcbiAqIERhdGU6IDE1LjA1LjIwMTVcclxuICogVGltZTogMTU6MjZcclxuICovXHJcblxyXG52YXIgR2FtZU9iamVjdD1yZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xyXG5jb25zdCB2ZWxvY2l0eSA9IC0wLjU7IC8vZ2dmLiBzcMOkdGVyIGF1c3RhdXNjaGVuIGdlZ2VuIEZ1bmt0aW9uIGYodClcclxuXHJcbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wdWNrSFRNTD0kKFwiPGIgaWQ9XFxcInB1Y2tcXFwiIC8+XCIpO1xyXG5cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cz1QdWNrOyIsIi8vTm90IHVzZWQgYW55bW9yZVxyXG4vL3JlcXVpcmUoXCIuL19fdGVjaGRlbW9cIik7XHJcblxyXG5cclxuZnVuY3Rpb24gZXJyb3JOb3RpZmljYXRpb24obWVzcykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG59XHJcblxyXG5cclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICAvL1plaWNobmUgU3BpZWxmZWxkXHJcbiAgICB2YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZFwiKTtcclxuICAgIHZhciBmaWVsZCA9IEZpZWxkLmluc3RhbmNlLmJ1aWxkKCk7XHJcblxyXG4gICAgdmFyIFB1Y2sgPSByZXF1aXJlKFwiLi9QdWNrXCIpO1xyXG4gICAgdmFyIHB1Y2sgPSBuZXcgUHVjaygpO1xyXG5cclxuICAgIHZhciBDb29yZCA9IHJlcXVpcmUoXCIuL0Nvb3JkXCIpO1xyXG4gICAgdmFyIGNvb3JkID0gbmV3IENvb3JkKCk7XHJcbiAgICBjb29yZC5zZXRVbml0cyg1MCwgMTAwKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjb29yZC5nZXRQaXhlbCgpKTtcclxuXHJcbiAgICB2YXIgZG90PSQoXCI8c3BhbiBpZD1cXFwiZG90XFxcIj4uPC9zcGFuPlwiKS5jc3Moe1xyXG4gICAgICAgIHBvc2l0aW9uOlwicmVsYXRpdmVcIixcclxuICAgICAgICB0b3A6IGNvb3JkLmdldFBpeGVsKCkueSxcclxuICAgICAgICBsZWZ0OiBjb29yZC5nZXRQaXhlbCgpLnhcclxuICAgIH0pO1xyXG5cclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG4iXX0=
