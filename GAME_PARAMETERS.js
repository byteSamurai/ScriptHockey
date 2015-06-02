/**
 * Created by: Alfred Feldmeyer
 * Date: 02.06.2015
 * Time: 16:52
 */
// Alle Angaben in UNITS, nicht in Pixel!
var PARAMS = {
    refreshRate: 50,
    vertCollVec: Math.PI * 0.5,//rad
    horzCollVec: Math.PI,//rad
    puck: {
        radius: 16,
        scoreIncreaseStep: 25,
        defaultScore: 50,
        speedIncreaseStep: 2,
        defaultSpeed: 0,
        defaultMoveTo: 0, // in grad!!!!
        defaultCoord: {
            x: null,
            y: null
        }
    },
    field: {
        ratio: 0.666666,
        width: null,
        height: 1000
    },
    batter: {
        radius: 32
    },
    goal: {
        positionTop: {
            x: null,
            y: null
        },
        positionBottom: {
            x: null,
            y: null
        },
        width: null,
        height: null
    }
};

//Berechne einige Werte nach
PARAMS.field.width = PARAMS.field.height * PARAMS.field.ratio;
PARAMS.goal.height = PARAMS.field.height / 20;
PARAMS.goal.width = PARAMS.field.width / 4;
PARAMS.goal.positionTop.x = PARAMS.field.width / 4 * 1.5;
PARAMS.goal.positionTop.y = PARAMS.goal.height / 2 * -1;
PARAMS.goal.positionBottom.x = PARAMS.goal.positionTop.x;
PARAMS.goal.positionBottom.y = PARAMS.field.height - PARAMS.goal.height / 2;
PARAMS.puck.defaultCoord.x = PARAMS.field.width / 2 - PARAMS.puck.radius;
PARAMS.puck.defaultCoord.y = PARAMS.field.height / 2 - PARAMS.puck.radius;

module.exports = PARAMS;