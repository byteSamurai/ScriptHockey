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

console.log("und läuft");
console.log("immer noch weiter");

},{"./__techdemo":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9BbGZyZWQgRmVsZG1leWVyL0RvY3VtZW50cy9TY3JpcHRIb2NrZXkvcHVibGljL2phdmFzY3JpcHRzL3NyYy9fX3RlY2hkZW1vLmpzIiwiQzovVXNlcnMvQWxmcmVkIEZlbGRtZXllci9Eb2N1bWVudHMvU2NyaXB0SG9ja2V5L3B1YmxpYy9qYXZhc2NyaXB0cy9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0lBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxZQUFZOztBQUUxQixRQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTFCLGFBQVMsY0FBYyxHQUFHO0FBQ3RCLFlBQUksT0FBTyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQyxZQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDaEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QixnQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUMzQixpQkFBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkM7QUFDRCxlQUFPLEtBQUssQ0FBQztLQUNoQjs7QUFFRCxLQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRTtBQUN6QyxjQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ25FLENBQUMsQ0FBQzs7QUFHSCxVQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxVQUFVLFNBQVMsRUFBRTtBQUM1QyxhQUFLLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtBQUNyQixnQkFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLGdCQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDakIsb0JBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkIsb0JBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ1gscUJBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUM1QyxxQkFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDZixxQkFBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO2lCQUM3QztBQUNELGlCQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLGlCQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7S0FDSixDQUFDLENBQUM7QUFDSCxVQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLE1BQU0sRUFBRTtBQUN0QyxTQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDLENBQUMsQ0FBQztDQUNOLENBQUEsRUFBRyxDQUFDOzs7OztBQ3pDTCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogUmVpbmUgVGVjaC1kZW1vLCBrYW5uIGF1c2dlYmxlbmRldCB3ZXJkZW5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgc29ja2V0ID0gaW8uY29ubmVjdCgpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tQ29sb3IoKSB7XG4gICAgICAgIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcbiAgICAgICAgdmFyIGNvbG9yID0gJyMnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgdmFyIGggPSBNYXRoLnJhbmRvbSgpICogMTY7Ly93ZWlsIGhleGFcbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBzb2NrZXQuZW1pdChcIm1vdXNlX2FjdGl2aXR5XCIsIHt4OiBldmVudC5wYWdlWCwgeTogZXZlbnQucGFnZVl9KTtcbiAgICB9KTtcblxuXG4gICAgc29ja2V0Lm9uKFwidXNlclBvc2l0aW9uc1wiLCBmdW5jdGlvbiAocG9zaXRpb25zKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcG9zaXRpb25zKSB7XG4gICAgICAgICAgICB2YXIgY29vcmRzID0gcG9zaXRpb25zW2ldO1xuICAgICAgICAgICAgaWYgKGNvb3JkcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBlID0gJChcIiNcIiArIGkpO1xuICAgICAgICAgICAgICAgIGlmICghZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKCc8YiBpZD1cIicgKyBpICsgJ1wiPis8L2I+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGUgPSAkKFwiI1wiICsgaSk7XG4gICAgICAgICAgICAgICAgICAgIGUuY3NzKFwiYmFja2dyb3VuZENvbG9yXCIsIGdldFJhbmRvbUNvbG9yKCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGUuY3NzKFwibGVmdFwiLCBjb29yZHMueCAtIDEwKTtcbiAgICAgICAgICAgICAgICBlLmNzcyhcInRvcFwiLCBjb29yZHMueSAtIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHNvY2tldC5vbigndXNlckFtb3VudCcsIGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgJChcIiN1c2VyQW1vdW50XCIpLnRleHQoYW1vdW50KTtcbiAgICB9KTtcbn0pKCk7IiwicmVxdWlyZShcIi4vX190ZWNoZGVtb1wiKTtcclxuXHJcbmNvbnNvbGUubG9nKFwidW5kIGzDpHVmdFwiKTtcclxuY29uc29sZS5sb2coXCJpbW1lciBub2NoIHdlaXRlclwiKTtcclxuXHJcbiJdfQ==
