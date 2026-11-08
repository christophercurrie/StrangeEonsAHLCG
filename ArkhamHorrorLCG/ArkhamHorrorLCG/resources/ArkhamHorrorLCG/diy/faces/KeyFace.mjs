// Key: art, title with a unique symbol and subtitle, game text in the key's
// outline, and the collector line. A back has the back template, and copies
// the front's title (see CardFace).
//
// Module: returns KeyFace.
import CardFace from './CardFace.mjs';
import FaceUtils from './FaceUtils.mjs';

class KeyFace extends CardFace {
    template = 'AHLCG-KeyFace';
    labelKey = 'AHLCG-Label-Key';
    hasSubtitle = true;
    subtitleRegion = 'SubtitleText';
    copiesFrontTitle = true;

    constructor() {
        super();
        // whether the side being painted is a back
        this.back = false;
    }

    templateKey(diy, faceIndex) {
        return faceIndex === 0 ? null : this.template + '-Back-template';
    }

    key(settings, name) {
        var key = this.template + '-Back-' + name;
        if (this.back && settings.get(key) != null) return key;
        return super.key(settings, name);
    }

    // the plug-in's key outline, which it doesn't cache
    bodyShape(region) {
        return FaceUtils.polygonShape(
            region,
            [0.0, 0.0, 0.1, 0.9, 1.0, 1.0],
            [0.0, 0.925, 1.0, 1.0, 0.925, 0.0]
        );
    }

    paintContent(g, diy, sheet, boxes, collector) {
        var faceIndex = sheet.getSheetIndex();
        var suffix = this.suffix(faceIndex);
        this.back = faceIndex !== 0;
        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);
        this.paintSubtitle(
            g,
            diy,
            boxes.subtitle,
            this.getSubtitle(diy, faceIndex)
        );
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
        this.back = false;
    }
}

export default KeyFace;
