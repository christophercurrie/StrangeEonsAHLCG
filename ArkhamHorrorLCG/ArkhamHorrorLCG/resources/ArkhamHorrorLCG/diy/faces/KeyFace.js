// Key: art, title with a unique symbol and subtitle, game text in the key's
// outline, and the collector line. A back has the back template, and copies
// the front's title (see CardFace).
//
// Module: returns KeyFace.
define(['faces/CardFace', 'faces/FaceUtils'], function (CardFace, FaceUtils) {
    function KeyFace() {
        CardFace.call(this);
        // whether the side being painted is a back
        this.back = false;
    }

    KeyFace.prototype = Object.create(CardFace.prototype);
    KeyFace.prototype.constructor = KeyFace;
    KeyFace.prototype.template = 'AHLCG-KeyFace';
    KeyFace.prototype.labelKey = 'AHLCG-Label-Key';
    KeyFace.prototype.hasSubtitle = true;
    KeyFace.prototype.subtitleRegion = 'SubtitleText';
    KeyFace.prototype.copiesFrontTitle = true;

    KeyFace.prototype.templateKey = function (diy, faceIndex) {
        return faceIndex === 0 ? null : this.template + '-Back-template';
    };

    KeyFace.prototype.key = function (settings, name) {
        var key = this.template + '-Back-' + name;
        if (this.back && settings.get(key) != null) return key;
        return CardFace.prototype.key.call(this, settings, name);
    };

    // the plug-in's key outline, which it doesn't cache
    KeyFace.prototype.bodyShape = function (region) {
        return FaceUtils.polygonShape(
            region,
            [0.0, 0.0, 0.1, 0.9, 1.0, 1.0],
            [0.0, 0.925, 1.0, 1.0, 0.925, 0.0]
        );
    };

    KeyFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
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
    };

    return KeyFace;
});
