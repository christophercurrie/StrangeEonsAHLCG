// Encounter card back.
//
// Module: returns EncounterBackFace.
import Face from './Face.mjs';

class EncounterBackFace extends Face {
    template = 'AHLCG-EncounterBackFace';

    setDefaults(diy, faceIndex, keep) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'Encounter', // for Zoop
        });
    }

    clearType(diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    }

    paint(g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    }
}

export default EncounterBackFace;
