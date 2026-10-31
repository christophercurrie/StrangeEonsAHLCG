// Encounter card back.
//
// Module: returns EncounterBackFace.
define(['faces/Face'], function (Face) {
    function EncounterBackFace() {
        Face.call(this);
    }

    EncounterBackFace.prototype = Object.create(Face.prototype);
    EncounterBackFace.prototype.constructor = EncounterBackFace;
    EncounterBackFace.prototype.template = 'AHLCG-EncounterBackFace';

    EncounterBackFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'Encounter', // for Zoop
        });
    };

    EncounterBackFace.prototype.clearType = function (diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    };

    EncounterBackFace.prototype.paint = function (g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    };

    return EncounterBackFace;
});
