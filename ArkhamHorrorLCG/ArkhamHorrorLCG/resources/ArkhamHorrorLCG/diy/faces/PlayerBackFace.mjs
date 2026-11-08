// Player card back.
//
// Module: returns PlayerBackFace.
import Face from './Face.mjs';

class PlayerBackFace extends Face {
    template = 'AHLCG-PlayerBackFace';

    setDefaults(diy, faceIndex, keep) {
        // the face's type, not user data, so set even with keep
        this.setValues(diy, faceIndex, false, {
            BackType: 'Player', // for Zoop
        });
    }

    clearType(diy, faceIndex) {
        diy.settings.reset('BackType' + this.suffix(faceIndex));
    }

    paint(g, diy, sheet, boxes) {
        this.paintTemplate(g, sheet);
    }
}

export default PlayerBackFace;
