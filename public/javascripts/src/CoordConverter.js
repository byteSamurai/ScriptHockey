/**
 * Created by Marko Grgic on 30.05.2015.
 */
var Coord = require('./Coord');
//TODO: fertig machen
class CoordConverter {
    static CartesianToPolaroid(Coord) {
        "use strict";

    }

    /**
     * Rechnet Polarkoordinate in kartesiche um
     * @param speed
     * @param moveTo
     * @returns {Coord}
     * @constructor
     */
    static PolaroidToCartesian(speed, moveTo) {
        "use strict";
        let xCoord = speed * Math.cos(moveTo* (180 / Math.PI));
        let yCoord = speed * Math.sin(moveTo* (180 / Math.PI));

        return new Coord(xCoord, yCoord);
    }
}