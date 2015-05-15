/**
 * Created by: Alfred Feldmeyer
 * Date: 15.05.2015
 * Time: 16:05
 */
import Field from '../public/javascripts/src/Field.js';

describe("Field", function () {
    let field;
    let server;
    beforeEach(()=> {
        "use strict";
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.respondWith('GET', '/field', [200, null, '<section id="field"></section>']);
        field = new Field();
    });
    afterEach(()=> {
        "use strict";
        server.restore();
    });

    it("should dropped correct", ()=> {
        "use strict";
        field.build();
        server.respond();
        expect(field.getFieldHeight()).toBeGreaterThan(0);
    });


    describe("the unit-pixel-calculations", function () {
        //it("should return a number", ()=>{
        //    "use strict";
        //
        //});

    })
});