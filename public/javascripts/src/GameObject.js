let Coord= require("./Coord");
class GameObject{
    constructor(name) {
        "use strict";
        this._coord=new Coord();
        this._name=name;
        this._type="GameObject";
        this._movement={
            x:30,
            y:50
        }

    }
    get type(){
        "use strict";
        return this._type;
    }
    set movement(XYobject){
        "use strict";
        this._movement=XYobject;
    }
    calcPosition(){
        "use strict";
        let pos=this._coord.unit;

        this.coord.unit={
            x:pos.x+this._movement.x,
            y:pos.y+this._movement.y
        }
    }
    get name(){
        "use strict";
        return this._name;
    }
    get coord(){
        "use strict";
        return this._coord;
    }
}
module.exports=GameObject;