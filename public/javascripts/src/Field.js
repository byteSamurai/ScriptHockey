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
class Field{

    constructor(height){
        "use strict";
        this.height=0;
        this.width=0;
        this._calcRatioSize(height)

    }
    function _calcRatioSize(height){
        "use strict";
        this.height=height;
        this.width=height*0.6;
    }
}
module.exports=Field;