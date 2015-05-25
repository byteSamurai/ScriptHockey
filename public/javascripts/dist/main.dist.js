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
        }
    }, {
        key: "getPixel",

        /**
         * Liefert Pixel-Kompontente der Koordinate
         * @returns {Coord.pixel}
         */
        value: function getPixel() {
            "use strict";
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

var RATIO = 0.666;
var DEBOUNCE_DELAY_MS = 50;
var VERT_UNITS = 1000;
var HORZ_UNITS = VERT_UNITS * RATIO;

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */

var Field = (function () {
    function Field() {
        "use strict";

        _classCallCheck(this, Field);

        this.fieldObjects = new Map();
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
        key: "getFieldHeight",

        /**
         *
         * @returns {number}
         */
        value: function getFieldHeight() {
            "use strict";
            return this.height;
        }
    }], [{
        key: "units2Pixel",

        /**
         * Wandel Darstellungseinheiten in Pixel um
         * @param {{x: number, y: number}} unit
         * @returns {{x: number, y: number}}
         */
        value: function units2Pixel(unit) {
            "use strict";
            if (typeof unit !== "object" || isNaN(unit.y) || isNaN(unit.x)) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }

            return { x: 0, y: 0 };
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
            return { x: 0, y: 0 };
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
    var field = new Field().build();

    var Puck = require("./Puck");
    var puck = new Puck();

    var Coord = require("./Coord");
    var coord = new Coord();
    coord.setPixel(50, 50);

    console.log(coord.getUnits());
});

},{"./Coord":1,"./Field":2,"./Puck":4}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9Db29yZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0ZpZWxkLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvR2FtZU9iamVjdC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL1B1Y2suanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7O0FDTUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztJQUM1QixLQUFLO0FBQ0ksYUFEVCxLQUFLLEdBQ087QUFDVixvQkFBWSxDQUFDOzs4QkFGZixLQUFLOztBQUdILFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUE7S0FDNUI7O2lCQUxDLEtBQUs7Ozs7Ozs7O2VBWUMsa0JBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNYLHdCQUFZLENBQUM7QUFDYixnQkFBSSxDQUFDLEtBQUssQ0FB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SUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUM7O0lBRWhCLElBQUk7QUFFSyxhQUZULElBQUksR0FFTztBQUNULG9CQUFZLENBQUM7OzhCQUhmLElBQUk7O0FBSUYsbUNBSkYsSUFBSSw2Q0FJTTs7QUFFUixZQUFJLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBRXhDOztjQVJDLElBQUk7O1dBQUosSUFBSTtHQUFTLFVBQVU7O0FBVTdCLE1BQU0sQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDOzs7Ozs7OztBQ2ZwQixTQUFTLGlCQUFpQixDQUFDLElBQUksRUFBRTtBQUM3QixnQkFBWSxDQUFDO0NBRWhCOztBQUdELENBQUMsQ0FBQyxZQUFZOztBQUVWLFFBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixRQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVoQyxRQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLFFBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsU0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRXZCLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Q0FHakMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTUuMDUuMjAxNVxuICogVGltZTogMTU6NTNcbiAqL1xuXG52YXIgRmllbGQgPSByZXF1aXJlKFwiLi9GaWVsZC5qc1wiKTtcbmNsYXNzIENvb3JkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMucGl4ZWwgPSB7eDogMCwgeTogMH07XG4gICAgICAgIHRoaXMudW5pdHMgPSB7eDogMCwgeTogMH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR6dCBQaXhlbFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICAgKi9cbiAgICBzZXRQaXhlbCh4LCB5KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLnBpeGVsLnggPSB4O1xuICAgICAgICB0aGlzLnBpeGVsLnkgPSB5O1xuICAgICAgICB0aGlzLnVuaXRzPUZpZWxkLnBpeGVsMnVuaXRzKHRoaXMucGl4ZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHp0IERhcnN0ZWxsdW5nc2VpbmhlaXRlblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICAgKi9cbiAgICBzZXRVbml0cyh4LCB5KSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLnVuaXRzLnggPSB4O1xuICAgICAgICB0aGlzLnVuaXRzLnkgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgUGl4ZWwtS29tcG9udGVudGUgZGVyIEtvb3JkaW5hdGVcbiAgICAgKiBAcmV0dXJucyB7Q29vcmQucGl4ZWx9XG4gICAgICovXG4gICAgZ2V0UGl4ZWwoKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLnBpeGVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExpZWZlcnQgRGFyc3RlbGx1bmdlaW5oZWl0IGRlciBLb29yZGluYXRlXG4gICAgICogQHJldHVybnMge0Nvb3JkLnVuaXRzfCp9XG4gICAgICovXG4gICAgZ2V0VW5pdHMoKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB0aGlzLnVuaXRzO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzPUNvb3JkOyIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTQuMDUuMjAxNVxuICogVGltZTogMTg6MDhcbiAqL1xuXG5jb25zdCBSQVRJTyA9IDAuNjY2O1xuY29uc3QgREVCT1VOQ0VfREVMQVlfTVM9NTA7XG5jb25zdCBWRVJUX1VOSVRTPTEwMDA7XG5jb25zdCBIT1JaX1VOSVRTPVZFUlRfVU5JVFMqUkFUSU87XG5cblxuLyoqXG4gKiBTcGllbGZlbGRcbiAqIFNlaXRlbiBtw7xzc2VuIGltIFZlcmjDpGx0bmlzIDM6MiBhbmdlbGVndCB3ZXJkZW5cbiAqIEBsaW5rOiBodHRwOi8vdHVyZi5taXNzb3VyaS5lZHUvc3RhdC9pbWFnZXMvZmllbGQvZGltaG9ja2V5LmdpZlxuICpcbiAqL1xuY2xhc3MgRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5maWVsZE9iamVjdHM9bmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIkZpZWxkXCI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XG4gICAgICAgIHRoaXMuZmllbGRIVE1MID0gJChcIjxzZWN0aW9uIGlkPVxcXCJmaWVsZFxcXCI+XCIpO1xuXG4gICAgICAgIHZhciBmaWVsZFJlZiA9IHRoaXM7XG4gICAgICAgICQod2luZG93KS5yZXNpemUoXG4gICAgICAgICAgICAkLnRocm90dGxlKERFQk9VTkNFX0RFTEFZX01TLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZmllbGRSZWYuYnVpbGQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZXJlY2huZXQgZGllIEJyZWl0ZSBkZXMgRmVsZGVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsY1JhdGlvU2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gJChcImJvZHlcIikuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmhlaWdodCAqIFJBVElPO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogV2FuZGVsIERhcnN0ZWxsdW5nc2VpbmhlaXRlbiBpbiBQaXhlbCB1bVxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gdW5pdFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyB1bml0czJQaXhlbCh1bml0KXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmKHR5cGVvZiB1bml0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHVuaXQueSkgfHwgaXNOYU4odW5pdC54KSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3g6MCx5OjB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdhbmRlbHQgUGllbCBpbiBEYXJzdGVsbHVuZ3NlaW5oZWl0ZW4gdW1cbiAgICAgKiBAcGFyYW0ge3t4OiBudW1iZXIsIHk6IG51bWJlcn19IHBpeGVsXG4gICAgICogQHJldHVybnMge3t4OiBudW1iZXIsIHk6IG51bWJlcn19XG4gICAgICovXG4gICAgc3RhdGljIHBpeGVsMnVuaXRzKHBpeGVsKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmKHR5cGVvZiBwaXhlbCAhPT0gXCJvYmplY3RcIiB8fCBpc05hTihwaXhlbC55KSB8fCBpc05hTihwaXhlbC54KSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt4OjAseTowfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGxhdHppZXJ0IGRhcyBGZWxkIGltIEJyb3dzZXJcbiAgICAgKi9cbiAgICBidWlsZCgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcbiAgICAgICAgLy9FbnRmZXJuZSBhbHRlcyBTcGllbGZlbGRcbiAgICAgICAgaWYgKHRoaXMuZmllbGRIVE1MICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkKFwiI1wiICsgdGhpcy5uYW1lLnRvTG93ZXJDYXNlKCkpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZmllbGRIVE1MKTtcbiAgICAgICAgdGhpcy5maWVsZEhUTUwuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICAgIG1hcmdpbkxlZnQ6IHRoaXMud2lkdGggKiAtLjUgLy80IGNlbnRlci1hbGlnbm1lbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEZpZWxkSGVpZ2h0KCl7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCJjbGFzcyBHYW1lT2JqZWN0e1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy54ID0gMDtcbiAgICAgICAgdGhpcy55ID0gMDtcbiAgICB9XG4gICAgbW92ZVRvKCl7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHM9R2FtZU9iamVjdDsiLCIvKipcclxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxyXG4gKiBEYXRlOiAxNS4wNS4yMDE1XHJcbiAqIFRpbWU6IDE1OjI2XHJcbiAqL1xyXG5cclxudmFyIEdhbWVPYmplY3Q9cmVxdWlyZShcIi4vR2FtZU9iamVjdFwiKTtcclxuY29uc3QgdmVsb2NpdHkgPSAtMC41OyAvL2dnZi4gc3DDpHRlciBhdXN0YXVzY2hlbiBnZWdlbiBGdW5rdGlvbiBmKHQpXHJcblxyXG5jbGFzcyBQdWNrIGV4dGVuZHMgR2FtZU9iamVjdHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMucHVja0hUTUw9JChcIjxiIGlkPVxcXCJwdWNrXFxcIiAvPlwiKTtcclxuXHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHM9UHVjazsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKG1lc3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufVxyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxyXG4gICAgdmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbiAgICB2YXIgZmllbGQgPSBuZXcgRmllbGQoKS5idWlsZCgpO1xyXG5cclxuICAgIHZhciBQdWNrID0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuICAgIHZhciBwdWNrID0gbmV3IFB1Y2soKTtcclxuXHJcbiAgICB2YXIgQ29vcmQgPSByZXF1aXJlKFwiLi9Db29yZFwiKTtcclxuICAgIHZhciBjb29yZCA9IG5ldyBDb29yZCgpO1xyXG4gICAgY29vcmQuc2V0UGl4ZWwoNTAsIDUwKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjb29yZC5nZXRVbml0cygpKTtcclxuXHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuIl19
