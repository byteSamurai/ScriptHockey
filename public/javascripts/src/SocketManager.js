/**
 * Created by: Alfred Feldmeyer
 * Date: 31.05.2015
 * Time: 20:03
 */

let singleton = Symbol();
let singletonEnforcer = Symbol();

class SocketManager {
    constructor(enforcer) {
        "use strict";
        if (enforcer != singletonEnforcer) {
            throw "Cannot construct singleton";
        }

        this.socket = io.connect();
    }

    /**
     * Spielfeld sollte nur eine Instanz sein
     * @returns {*}
     */
    static get instance() {
        if (this[singleton] === undefined) {
            this[singleton] = new Field(singletonEnforcer);
        }
        return this[singleton];
    }
}