/**
 * Reine Tech-demo, kann ausgeblendet werden
 */

module.exports = (function () {

    var socket = io.connect();

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            var h = Math.random() * 16;//weil hexa
            color += letters[Math.floor(h)];
        }
        return color;
    }

    $(document).on("mousemove", function (event) {
        socket.emit("mouse_activity", {x: event.pageX, y: event.pageY});
    });


    socket.on("userPositions", function (positions) {
        for (var i in positions) {
            var coords = positions[i];
            if (coords !== null) {
                var e = $("#" + i);
                if (!e.length) {
                    $("body").append('<b id="' + i + '">+</b>');
                    e = $("#" + i);
                    e.css("backgroundColor", getRandomColor())
                }
                e.css("left", coords.x - 10);
                e.css("top", coords.y - 10);
            }
        }
    });
    socket.on('userAmount', function (amount) {
        $("#userAmount").text(amount);
    });
})();