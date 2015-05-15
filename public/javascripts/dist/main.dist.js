(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * Created by: Alfred Feldmeyer
 * Date: 14.05.2015
 * Time: 18:08
 */

/**
 * Spielfeld
 * Seiten müssen im Verhältnis 3:2 angelegt werden
 * @link: http://turf.missouri.edu/stat/images/field/dimhockey.gif
 *
 */
var RATIO = 0.666;
var DEBOUNCE_DELAY_MS = 150;

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
    }]);

    return Field;
})();

module.exports = Field;

},{}],2:[function(require,module,exports){
//Not used anymore
//require("./__techdemo");

"use strict";

function errorNotification(mess) {
    "use strict";
}

$(function () {
    //Zeichne Spielfeld
    var Field = require("./Field");
    new Field().build();
});

},{"./Field":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9GaWVsZC5qcyIsIkM6L1VzZXJzL0FsZnJlZCBGZWxkbWV5ZXIvRG9jdW1lbnRzL1NjcmlwdEhvY2tleS9wdWJsaWMvamF2YXNjcmlwdHMvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNZQSxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDcEIsSUFBTSxpQkFBaUIsR0FBQyxHQUFHLENBQUM7O0lBRXRCLEtBQUs7QUFDSSxhQURULEtBQUssR0FDTztBQUNWLG9CQUFZLENBQUM7OzhCQUZmLEtBQUs7O0FBSUgsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7QUFDcEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsWUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7QUFFdEIsWUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFNBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQ1osQ0FBQyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZO0FBQ3RDLG9CQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDcEIsQ0FBQyxDQUNMLENBQUM7QUFDRixZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDekI7O2lCQWhCQyxLQUFLOzs7Ozs7O2VBc0JPLDBCQUFHO0FBQ2Isd0JBQVksQ0FBQzs7QUFFYixnQkFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakMsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDcEM7Ozs7Ozs7ZUE2QkksaUJBQUc7QUFDSix3QkFBWSxDQUFDO0FBQ2IsZ0JBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVwQixhQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFVLFFBQVEsRUFBRTtBQUN0Qix3QkFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2pDLDBCQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIseUJBQUssRUFBRSxRQUFRLENBQUMsS0FBSztBQUNyQiw4QkFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFFO0FBQUEsaUJBQ25DLENBQUMsQ0FBQztBQUNILHVCQUFPLFFBQVEsQ0FBQTthQUNsQixDQUFDLENBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvQjs7Ozs7Ozs7OztlQXJDb0Isd0JBQUMsUUFBUSxFQUFFO0FBQzVCLHdCQUFZLENBQUM7QUFDYixnQkFBSSxRQUFRLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtBQUM3QixpQkFBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDakQ7QUFDRCxtQkFBTyxRQUFRLENBQUM7U0FDbkI7Ozs7Ozs7OztlQU9nQixvQkFBQyxRQUFRLEVBQUU7QUFDeEIsd0JBQVksQ0FBQztBQUNiLGFBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDOzs7V0FuREMsS0FBSzs7O0FBMEVYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7Ozs7OztBQ3BGdkIsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUM7QUFDNUIsZ0JBQVksQ0FBQztDQUVoQjs7QUFHRCxDQUFDLENBQUMsWUFBWTs7QUFFVixRQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsUUFBSSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUd2QixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5OiBBbGZyZWQgRmVsZG1leWVyXG4gKiBEYXRlOiAxNC4wNS4yMDE1XG4gKiBUaW1lOiAxODowOFxuICovXG5cbi8qKlxuICogU3BpZWxmZWxkXG4gKiBTZWl0ZW4gbcO8c3NlbiBpbSBWZXJow6RsdG5pcyAzOjIgYW5nZWxlZ3Qgd2VyZGVuXG4gKiBAbGluazogaHR0cDovL3R1cmYubWlzc291cmkuZWR1L3N0YXQvaW1hZ2VzL2ZpZWxkL2RpbWhvY2tleS5naWZcbiAqXG4gKi9cbmNvbnN0IFJBVElPID0gMC42NjY7XG5jb25zdCBERUJPVU5DRV9ERUxBWV9NUz0xNTA7XG5cbmNsYXNzIEZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gXCJGaWVsZFwiO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICB0aGlzLmZpZWxkSFRNTCA9IG51bGw7XG5cbiAgICAgICAgdmFyIGZpZWxkUmVmID0gdGhpcztcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShcbiAgICAgICAgICAgICQuZGVib3VuY2UoREVCT1VOQ0VfREVMQVlfTVMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFJlZi5idWlsZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJlcmVjaG5ldCBkaWUgQnJlaXRlIGRlcyBGZWxkZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jYWxjUmF0aW9TaXplKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgICAgICB0aGlzLmhlaWdodCA9ICQoXCJib2R5XCIpLmhlaWdodCgpO1xuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5oZWlnaHQgKiBSQVRJTztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbnRmZXJudCBhbGxlcyBTcGllbGZlbGRcbiAgICAgKiBAcGFyYW0gZmllbGRSZWZcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHN0YXRpYyBfcmVtb3ZlRnJvbURvbShmaWVsZFJlZikge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKGZpZWxkUmVmLmZpZWxkSFRNTCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJChcIiNcIiArIGZpZWxkUmVmLm5hbWUudG9Mb3dlckNhc2UoKSkucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkUmVmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEbDvGd0IG5ldWVzIFNwaWVsZmVsZCBlaW5cbiAgICAgKiBAcGFyYW0gZmllbGRSZWZcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHN0YXRpYyBfZHJvcEF0RG9tKGZpZWxkUmVmKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQoZmllbGRSZWYuZmllbGRIVE1MKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQbGF0emllcnQgZGFzIEZlbGQgaW0gQnJvd3NlclxuICAgICAqL1xuICAgIGJ1aWxkKCkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdGhpcy5fY2FsY1JhdGlvU2l6ZSgpO1xuICAgICAgICB2YXIgZmllbGRSZWYgPSB0aGlzO1xuXG4gICAgICAgICQuZ2V0KFwiL1wiICsgdGhpcy5uYW1lLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBmaWVsZFJlZi5maWVsZEhUTUwgPSAkKHJlc3BvbnNlKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGZpZWxkUmVmLmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZpZWxkUmVmLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiBmaWVsZFJlZi53aWR0aCAqIC0uNSAvLzQgY2VudGVyLWFsaWdubWVudFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZFJlZlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKEZpZWxkLl9yZW1vdmVGcm9tRG9tKVxuICAgICAgICAgICAgLnRoZW4oRmllbGQuX2Ryb3BBdERvbSk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCIvL05vdCB1c2VkIGFueW1vcmVcclxuLy9yZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBlcnJvck5vdGlmaWNhdGlvbihtZXNzKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxufVxyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy9aZWljaG5lIFNwaWVsZmVsZFxyXG4gICAgdmFyIEZpZWxkID0gcmVxdWlyZShcIi4vRmllbGRcIik7XHJcbiAgICBuZXcgRmllbGQoKS5idWlsZCgpO1xyXG5cclxuXHJcbn0pO1xyXG5cclxuXHJcblxyXG4iXX0=
