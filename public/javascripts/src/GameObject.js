let Coord = require("./Coord");

class GameObject {
    /**
     * @param id ID um Element im DOM zu markieren und Objekt zu vergleichen
     * @param html Jquery-HTML-element
     * @param xSize UNITS
     * @param ySize UNITS
     */
    constructor(id, html, xSize, ySize) {
        "use strict";
        this._coord = new Coord();
        this._size = new Coord(xSize, ySize);
        //Konkreter Instanz-Name
        this._ID = id;
        //Basis-Klasse wird als Daten-Typ für Validierung verwendet
        this._html = html.attr("id", id);
        this._moveTo = 0;
        this._speed = 0;
    }

    /**
     * Größe des Game-Objekts
     * @returns {Coord}
     */
    get size() {
        "use strict";
        return this._size;
    }

    /**
     * Winkel der Bewegungsrichtung in rad!!!!!
     * @returns {number} Winkel in rad!
     */
    get moveTo() {
        "use strict";
        return this._moveTo;
    }

    /**
     * Winkel, der Bewegungsrichtung in rad
     * 0° == recht, 90° == unten
     * @param {number} angle
     */
    set moveTo(angle) {
        "use strict";
        this._moveTo = angle;
    }


    /**
     * Die repäsentative ID eines jeden Objects
     * @returns {String}
     */
    get ID() {
        "use strict";
        return this._ID;
    }

    /**
     * Die Koordinaten eines jeden GameObjects
     * @returns {Coord}
     */
    get coord() {
        "use strict";
        return this._coord;
    }

    /**
     * Setzt Koordinaten
     * @param {Coord} coord
     */
    set coord(coord) {
        "use strict";
        this._coord = coord;
    }

    /**
     * Das repräsentative DOM-Element
     * @returns {*}
     */
    get html() {
        "use strict";
        return this._html;
    }

    /**
     * Liefert die Geschwindigkeit in X/Y-Komponente
     */
    get speedAsCoord() {
        "use strict";
        var Coord = require("./Coord");
        return Coord.polarToCartesian(this._speed, this._moveTo);
    }

    /**
     * Geschwindigkeit/zurückgelegte Distanz je Tick
     * @returns {int}
     */
    get speed() {
        "use strict";
        return this._speed;
    }

    /**
     * Geschwindigkeit/zurückgelegte Distanz je Tick
     * @param {int} speedValue
     */
    set speed(speedValue) {
        "use strict";
        if (typeof speedValue !== "number") {
            throw Error("Must be a integer")
        }
        this._speed = speedValue;
    }

    /**
     * Bewegt Gameobject an Position
     */
    setPosition() {
        "use strict";
        let domobject = this._html[0];
        domobject.style.transform = "translate(" + this._coord.pixel.x + "px," + this._coord.pixel.y + "px)";
    }

    /**
     * Berechnet die nächste Position des GameObjects
     */
    calcPosition() {
        "use strict";
        this.coord.add(this.speedAsCoord);
    }
}
module.exports = GameObject;