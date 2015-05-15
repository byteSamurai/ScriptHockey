(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

require("./__techdemo");

require("./puck");

},{"./__techdemo":1,"./puck":3}],3:[function(require,module,exports){
"use strict";

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9fX3RlY2hkZW1vLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvbWFpbi5qcyIsInB1YmxpYy9qYXZhc2NyaXB0cy9zcmMvcHVjay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0lBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxZQUFZOztBQUUxQixRQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTFCLGFBQVMsY0FBYyxHQUFHO0FBQ3RCLFlBQUksT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQyxZQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDaEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QixnQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUMzQixpQkFBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkM7QUFDRCxlQUFPLEtBQUssQ0FBQztLQUNoQjs7QUFFRCxLQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6QyxjQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ25FLENBQUMsQ0FBQzs7QUFHSCxVQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxVQUFVLFNBQVMsRUFBRTtBQUM1QyxhQUFLLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtBQUNyQixnQkFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDakIsb0JBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkIsb0JBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ1gscUJBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUM1QyxxQkFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZixxQkFBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO2lCQUM3QztBQUNELGlCQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7S0FDSixDQUFDLENBQUM7QUFDSCxVQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUN0QyxTQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDLENBQUMsQ0FBQztDQUNOLENBQUEsRUFBRyxDQUFDOzs7OztBQ3pDTCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXhCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FDRmxCO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBSZWluZSBUZWNoLWRlbW8sIGthbm4gYXVzZ2VibGVuZGV0IHdlcmRlblxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBzb2NrZXQgPSBpby5jb25uZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21Db2xvcigpIHtcbiAgICAgICAgdmFyIGxldHRlcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRicuc3BsaXQoJycpO1xuICAgICAgICB2YXIgY29sb3IgPSAnIyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaCA9IE1hdGgucmFuZG9tKCkgKiAxNjsvL3dlaWwgaGV4YVxuICAgICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKGgpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHNvY2tldC5lbWl0KFwibW91c2VfYWN0aXZpdHlcIiwge3g6IGV2ZW50LnBhZ2VYLCB5OiBldmVudC5wYWdlWX0pO1xuICAgIH0pO1xuXG5cbiAgICBzb2NrZXQub24oXCJ1c2VyUG9zaXRpb25zXCIsIGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBwb3NpdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBjb29yZHMgPSBwb3NpdGlvbnNbaV07XG4gICAgICAgICAgICBpZiAoY29vcmRzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSAkKFwiI1wiICsgaSk7XG4gICAgICAgICAgICAgICAgaWYgKCFlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQoJzxiIGlkPVwiJyArIGkgKyAnXCI+KzwvYj4nKTtcbiAgICAgICAgICAgICAgICAgICAgZSA9ICQoXCIjXCIgKyBpKTtcbiAgICAgICAgICAgICAgICAgICAgZS5jc3MoXCJiYWNrZ3JvdW5kQ29sb3JcIiwgZ2V0UmFuZG9tQ29sb3IoKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZS5jc3MoXCJsZWZ0XCIsIGNvb3Jkcy54IC0gMTApO1xuICAgICAgICAgICAgICAgIGUuY3NzKFwidG9wXCIsIGNvb3Jkcy55IC0gMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgc29ja2V0Lm9uKCd1c2VyQW1vdW50JywgZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICAkKFwiI3VzZXJBbW91bnRcIikudGV4dChhbW91bnQpO1xuICAgIH0pO1xufSkoKTsiLCJyZXF1aXJlKFwiLi9fX3RlY2hkZW1vXCIpO1xyXG5cclxucmVxdWlyZShcIi4vcHVja1wiKTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKRE9pOVZjMlZ5Y3k5QmJHWnlaV1FnUm1Wc1pHMWxlV1Z5TDBSdlkzVnRaVzUwY3k5VFkzSnBjSFJJYjJOclpYa3ZjSFZpYkdsakwycGhkbUZ6WTNKcGNIUnpMM055WXk5d2RXTnJMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iXX0=
