(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

var RATIO = 0.666;
var DEBOUNCE_DELAY_MS = 150;
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

        this.name = "Field";
        this.height = 0;
        this.width = 0;
        this.fieldHTML = null;

        var fieldRef = this;
        $(window).resize($.debounce(DEBOUNCE_DELAY_MS, function () {
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
            var fieldRef = this;

            $.get("/" + this.name.toLowerCase()).then(function (response) {
                fieldRef.fieldHTML = $(response).css({
                    height: fieldRef.height,
                    width: fieldRef.width,
                    marginLeft: fieldRef.width * -0.5 //4 center-alignment
                });
                return fieldRef;
            }).then(Field._removeFromDom).then(Field._dropAtDom);
        }
    }], [{
        key: "_removeFromDom",

        /**
         * Entfernt alles Spielfeld
         * @param fieldRef
         * @returns {*}
         * @private
         */
        value: function _removeFromDom(fieldRef) {
            "use strict";
            if (fieldRef.fieldHTML !== null) {
                $("#" + fieldRef.name.toLowerCase()).remove();
            }
            return fieldRef;
        }
    }, {
        key: "_dropAtDom",

        /**
         * Fügt neues Spielfeld ein
         * @param fieldRef
         * @private
         */
        value: function _dropAtDom(fieldRef) {
            "use strict";
            $("body").append(fieldRef.fieldHTML);
        }
    }, {
        key: "units2Pixel",

        /**
         * Wandel Darstellungseinheiten in Pixel um
         * @param {{x: number, y: number}} unit
         * @returns {{x: number, y: number}}
         */
        value: function units2Pixel(unit) {
            "use strict";
            if (typeof unit !== "object" || isNaN(unit.x) || isNaN(unit.x)) {
                throw new Error("unit2pixel must get a object as parameter with x and y as a Number");
            }

            return { x: 0, y: 0 };
        }
    }, {
        key: "pixel2units",
        value: function pixel2units(pixel) {
            "use strict";
        }
    }]);

    return Field;
})();

module.exports = Field;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
    _classCallCheck(this, Puck);

    if (_GameObject != null) {
      _GameObject.apply(this, arguments);
    }
  }

  _inherits(Puck, _GameObject);

  return Puck;
})(GameObject);

module.exports = Puck;

},{"./GameObject":2}],4:[function(require,module,exports){
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
});

},{"./Field":1,"./Puck":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9GaWVsZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL0dhbWVPYmplY3QuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9QdWNrLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztBQ01BLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNwQixJQUFNLGlCQUFpQixHQUFDLEdBQUcsQ0FBQztBQUM1QixJQUFNLFVBQVUsR0FBQyxJQUFJLENBQUM7QUFDdEIsSUFBTSxVQUFVLEdBQUMsVUFBVSxHQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7O0lBUzVCLEtBQUs7QUFDSSxhQURULEtBQUssR0FDTztBQUNWLG9CQUFZLENBQUM7OzhCQUZmLEtBQUs7O0FBSUgsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7QUFDcEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsWUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsWUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFNBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQ1osQ0FBQyxDQUFDLFFBQVEsQ0FB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USxHQUFHLENBQUMsR0FBRyxDQUFDOztJQUVoQixJQUFJO1dBQUosSUFBSTswQkFBSixJQUFJOzs7Ozs7O1lBQUosSUFBSTs7U0FBSixJQUFJO0dBQVMsVUFBVTs7QUFHN0IsTUFBTSxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUM7Ozs7Ozs7O0FDUHBCLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFDO0FBQzVCLGdCQUFZLENBQUM7Q0FFaEI7O0FBSUQsQ0FBQyxDQUFDLFlBQVk7O0FBRVYsUUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLFFBQUksS0FBSyxHQUFDLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTlCLFFBQUksSUFBSSxHQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixRQUFJLElBQUksR0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0NBR3ZCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnk6IEFsZnJlZCBGZWxkbWV5ZXJcbiAqIERhdGU6IDE0LjA1LjIwMTVcbiAqIFRpbWU6IDE4OjA4XG4gKi9cblxuY29uc3QgUkFUSU8gPSAwLjY2NjtcbmNvbnN0IERFQk9VTkNFX0RFTEFZX01TPTE1MDtcbmNvbnN0IFZFUlRfVU5JVFM9MTAwMDtcbmNvbnN0IEhPUlpfVU5JVFM9VkVSVF9VTklUUypSQVRJTztcblxuXG4vKipcbiAqIFNwaWVsZmVsZFxuICogU2VpdGVuIG3DvHNzZW4gaW0gVmVyaMOkbHRuaXMgMzoyIGFuZ2VsZWd0IHdlcmRlblxuICogQGxpbms6IGh0dHA6Ly90dXJmLm1pc3NvdXJpLmVkdS9zdGF0L2ltYWdlcy9maWVsZC9kaW1ob2NrZXkuZ2lmXG4gKlxuICovXG5jbGFzcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IFwiRmllbGRcIjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgdGhpcy5maWVsZEhUTUwgPSBudWxsO1xuXG4gICAgICAgIHZhciBmaWVsZFJlZiA9IHRoaXM7XG4gICAgICAgICQod2luZG93KS5yZXNpemUoXG4gICAgICAgICAgICAkLmRlYm91bmNlKERFQk9VTkNFX0RFTEFZX01TLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZmllbGRSZWYuYnVpbGQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2NhbGNSYXRpb1NpemUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCZXJlY2huZXQgZGllIEJyZWl0ZSBkZXMgRmVsZGVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsY1JhdGlvU2l6ZSgpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSAkKFwiYm9keVwiKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuaGVpZ2h0ICogUkFUSU87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50ZmVybnQgYWxsZXMgU3BpZWxmZWxkXG4gICAgICogQHBhcmFtIGZpZWxkUmVmXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzdGF0aWMgX3JlbW92ZUZyb21Eb20oZmllbGRSZWYpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmIChmaWVsZFJlZi5maWVsZEhUTUwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQoXCIjXCIgKyBmaWVsZFJlZi5uYW1lLnRvTG93ZXJDYXNlKCkpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWVsZFJlZjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGw7xndCBuZXVlcyBTcGllbGZlbGQgZWluXG4gICAgICogQHBhcmFtIGZpZWxkUmVmXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzdGF0aWMgX2Ryb3BBdERvbShmaWVsZFJlZikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKGZpZWxkUmVmLmZpZWxkSFRNTCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2FuZGVsIERhcnN0ZWxsdW5nc2VpbmhlaXRlbiBpbiBQaXhlbCB1bVxuICAgICAqIEBwYXJhbSB7e3g6IG51bWJlciwgeTogbnVtYmVyfX0gdW5pdFxuICAgICAqIEByZXR1cm5zIHt7eDogbnVtYmVyLCB5OiBudW1iZXJ9fVxuICAgICAqL1xuICAgIHN0YXRpYyB1bml0czJQaXhlbCh1bml0KXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGlmKHR5cGVvZiB1bml0ICE9PSBcIm9iamVjdFwiIHx8IGlzTmFOKHVuaXQueCkgfHwgaXNOYU4odW5pdC54KSl7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bml0MnBpeGVsIG11c3QgZ2V0IGEgb2JqZWN0IGFzIHBhcmFtZXRlciB3aXRoIHggYW5kIHkgYXMgYSBOdW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge3g6MCx5OjB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBwaXhlbDJ1bml0cyhwaXhlbCl7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBsYXR6aWVydCBkYXMgRmVsZCBpbSBCcm93c2VyXG4gICAgICovXG4gICAgYnVpbGQoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLl9jYWxjUmF0aW9TaXplKCk7XG4gICAgICAgIHZhciBmaWVsZFJlZiA9IHRoaXM7XG5cbiAgICAgICAgJC5nZXQoXCIvXCIgKyB0aGlzLm5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGZpZWxkUmVmLmZpZWxkSFRNTCA9ICQocmVzcG9uc2UpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZmllbGRSZWYuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZmllbGRSZWYud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGZpZWxkUmVmLndpZHRoICogLS41IC8vNCBjZW50ZXItYWxpZ25tZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpZWxkUmVmXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oRmllbGQuX3JlbW92ZUZyb21Eb20pXG4gICAgICAgICAgICAudGhlbihGaWVsZC5fZHJvcEF0RG9tKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkOyIsImNsYXNzIEdhbWVPYmplY3R7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgIH1cbiAgICBtb3ZlVG8oKXtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cz1HYW1lT2JqZWN0OyIsIi8qKlxuICogQ3JlYXRlZCBieTogQWxmcmVkIEZlbGRtZXllclxuICogRGF0ZTogMTUuMDUuMjAxNVxuICogVGltZTogMTU6MjZcbiAqL1xuXG52YXIgR2FtZU9iamVjdD1yZXF1aXJlKFwiLi9HYW1lT2JqZWN0XCIpO1xuY29uc3QgdmVsb2NpdHkgPSAtMC41OyAvL2dnZi4gc3DDpHRlciBhdXN0YXVzY2hlbiBnZWdlbiBGdW5rdGlvbiBmKHQpXG5cbmNsYXNzIFB1Y2sgZXh0ZW5kcyBHYW1lT2JqZWN0e1xuXG59XG5tb2R1bGUuZXhwb3J0cz1QdWNrOyIsIi8vTm90IHVzZWQgYW55bW9yZVxyXG4vL3JlcXVpcmUoXCIuL19fdGVjaGRlbW9cIik7XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGVycm9yTm90aWZpY2F0aW9uKG1lc3Mpe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG59XHJcblxyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxyXG4gICAgdmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbiAgICB2YXIgZmllbGQ9bmV3IEZpZWxkKCkuYnVpbGQoKTtcclxuXHJcbiAgICB2YXIgUHVjaz0gcmVxdWlyZShcIi4vUHVja1wiKTtcclxuICAgIHZhciBwdWNrPW5ldyBQdWNrKCk7XHJcblxyXG5cclxufSk7XHJcblxyXG5cclxuXHJcbiJdfQ==
