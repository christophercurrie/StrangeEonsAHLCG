// Customizable upgrade sheet back.
//
// Module: returns CustomizableBackFace.
define(['faces/Face'], function (Face) {
    function CustomizableBackFace() {
        Face.call(this);
    }

    CustomizableBackFace.prototype = Object.create(Face.prototype);
    CustomizableBackFace.prototype.constructor = CustomizableBackFace;
    CustomizableBackFace.prototype.template = 'AHLCG-CustomizableBackFace';
    CustomizableBackFace.prototype.usesTemplateReplacement = true;

    CustomizableBackFace.prototype.setDefaults = function (
        diy,
        faceIndex,
        keep
    ) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'PlayerPurple', // for Zoop
        });
    };

    CustomizableBackFace.prototype.clearType = function (diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    };

    CustomizableBackFace.prototype.paint = function (g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    };

    return CustomizableBackFace;
});
