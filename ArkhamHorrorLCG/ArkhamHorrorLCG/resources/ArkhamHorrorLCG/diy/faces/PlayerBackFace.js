// Player card back.
//
// Module: returns PlayerBackFace.
define(['faces/Face'], function (Face) {
    function PlayerBackFace() {
        Face.call(this);
    }

    PlayerBackFace.prototype = Object.create(Face.prototype);
    PlayerBackFace.prototype.constructor = PlayerBackFace;
    PlayerBackFace.prototype.template = 'AHLCG-PlayerBackFace';

    PlayerBackFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'Player', // for Zoop
        });
    };

    PlayerBackFace.prototype.clearType = function (diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    };

    PlayerBackFace.prototype.paint = function (g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    };

    return PlayerBackFace;
});
