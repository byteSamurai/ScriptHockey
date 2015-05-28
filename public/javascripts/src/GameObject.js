let Coord = require("./Coord");
class GameObject {
    constructor(name, html, xSize, ySize) {
        "use strict";
        this._coord = new Coord();
        this._size = new Coord(xSize, ySize);
        this._name = name;
        this._type = "GameObject";
        this._html = html;
        this._moveTo = new Coord();

    }

    get type() {
        "use strict";
        return this._type;
    }

    get size() {
        "use strict";
        return this._size;
    }

    get moveTo() {
        "use strict";
        return this._moveTo;
    }

    set moveTo(coords) {
        "use strict";
        if (coords.type !== "Coord") {
            throw new Error("Must be a Coord");
        }
        //coords.divide(new Coord(100,100));
        this._moveTo = coords;
    }

    setPosition() {
        "use strict";
        this._html.css({
            top: this._coord.pixel.y,
            left: this._coord.pixel.x
        })
    }

    calcPosition() {
        "use strict";
        this.coord.add(this._moveTo);
    }

    get name() {
        "use strict";
        return this._name;
    }

    get coord() {
        "use strict";

        return this._coord;
    }

    set coord(coord) {
        "use strict";
        this._coord = coord;
    }

    get html() {
        "use strict";
        return this._html;
    }
}
module.exports = GameObject;