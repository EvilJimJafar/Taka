var Taka = (Taka) ? Taka : {};

(function() {
    "use strict";
    /**
     * A formation shaped like a V comprising 5 enemy vehicles
     * @class
     * @augments Taka.vehicles.formations.Formation
     * @param {Function} shipType A class derived from Taka.vehicles.Vehicle
     * @param {Number} startFrame The frame number on which to spawn the formation
     * @param {Number} x The position of the formation in the X axis
     * @param {Number} y The position of the formation in the Y axis
     * @constructor
     */
    Taka.vehicles.formations.V5Formation = function(shipType, startFrame, x, y) {
        this.Super(shipType, startFrame, x, y);
    };
    Taka.extend(Taka.vehicles.formations.V5Formation, Taka.vehicles.formations.Formation);

    /**
     * Spawns the formation at the specified frame number
     * @param {Number} frame The frame number
     */
    Taka.vehicles.formations.V5Formation.prototype.update = function(frame) {
        if (frame === this.startFrame) {
            Taka.core.Engine.addEnemy(new this.shipType(this.x, -20, 0.5, 1));
            Taka.core.Engine.addEnemy(new this.shipType(this.x - 30, -40, 0.5, 1));
            Taka.core.Engine.addEnemy(new this.shipType(this.x + 30, -40, 0.5, 1));
            Taka.core.Engine.addEnemy(new this.shipType(this.x - 60, -60, 0.5, 1));
            Taka.core.Engine.addEnemy(new this.shipType(this.x + 60, -60, 0.5, 1));
        }
    };
})();