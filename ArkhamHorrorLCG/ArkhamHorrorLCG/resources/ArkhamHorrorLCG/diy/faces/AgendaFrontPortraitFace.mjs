// Agenda with full width art: an agenda face (see AgendaFace) whose title
// and text sit in a band over the art. It has no orientation, no outline
// and no index on its front.
//
// Module: returns AgendaFrontPortraitFace.
import AgendaFace from './AgendaFace.mjs';

class AgendaFrontPortraitFace extends AgendaFace {
    template = 'AHLCG-AgendaFrontPortraitFace';
    hasOrientation = false;
    showsIndex = false;
    outlineX = null;
    outlineY = null;

    defaultValues(diy, faceIndex) {
        var values = super.defaultValues(diy, faceIndex);
        delete values.Orientation;
        return values;
    }
}

export default AgendaFrontPortraitFace;
