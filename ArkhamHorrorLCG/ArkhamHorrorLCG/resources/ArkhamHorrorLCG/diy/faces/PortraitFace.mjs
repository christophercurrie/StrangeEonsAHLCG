// Full bleed art, with the artist's credit when the side has one.
//
// Module: returns PortraitFace.
import CollectorInfo from './CollectorInfo.mjs';
import Face from './Face.mjs';
import FaceUtils from './FaceUtils.mjs';
import PortraitArt from './PortraitArt.mjs';

class PortraitFace extends Face {
    template = 'AHLCG-PortraitFace';
    portraits = ['Portrait'];

    setDefaults(diy, faceIndex, keep) {
        this.setValues(diy, faceIndex, keep, { Artist: '' });
    }

    createPainter(diy, sheet, faceIndex) {
        return { artist: this.createBox(diy, sheet, 'Artist') };
    }

    paint(g, diy, sheet, boxes, collector, art) {
        this.clearSheet(g, sheet);
        FaceUtils.translateToTrim(g, sheet);
        PortraitArt.paint(g, diy, sheet, art.Portrait);
        CollectorInfo.paintArtist(g, diy, sheet, this, boxes.artist);
    }
}

export default PortraitFace;
