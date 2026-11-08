// Customizable upgrade sheet back.
//
// Module: returns CustomizableBackFace.
import Face from './Face.mjs';

class CustomizableBackFace extends Face {
    template = 'AHLCG-CustomizableBackFace';
    usesTemplateReplacement = true;

    setDefaults(diy, faceIndex, keep) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'PlayerPurple', // for Zoop
        });
    }

    clearType(diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    }

    paint(g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    }
}

export default CustomizableBackFace;
