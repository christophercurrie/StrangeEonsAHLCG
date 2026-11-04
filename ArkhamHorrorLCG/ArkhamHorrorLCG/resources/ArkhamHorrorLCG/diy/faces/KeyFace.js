// Key: art, title with a unique symbol and subtitle, game text in the key's
// outline, and the collector line. A back has the back template, and without
// a title of its own shows the component name and its unique symbol.
//
// Module: returns KeyFace.
define(['faces/CardFace', 'faces/Face', 'faces/FaceUtils'], function (
    CardFace,
    Face,
    FaceUtils
) {
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

    KeyFace.prototype.templateKey = function (diy, faceIndex) {
        return faceIndex === 0 ? null : this.template + '-Back-template';
    };

    KeyFace.prototype.key = function (settings, name) {
        var key = this.template + '-Back-' + name;
        if (this.back && settings.get(key) != null) return key;
        return CardFace.prototype.key.call(this, settings, name);
    };

    KeyFace.prototype.ownTitle = function (diy, faceIndex) {
        return Face.prototype.getTitle.call(this, diy, faceIndex);
    };

    KeyFace.prototype.getTitle = function (diy, faceIndex) {
        var title = this.ownTitle(diy, faceIndex);
        return title.length > 0 ? title : String(diy.name);
    };

    KeyFace.prototype.isUnique = function (diy, faceIndex) {
        var own = faceIndex === 0 || this.ownTitle(diy, faceIndex).length > 0;
        return CardFace.prototype.isUnique.call(this, diy, own ? faceIndex : 0);
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
            String(diy.settings.get('Subtitle' + suffix, ''))
        );
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
        this.back = false;
    };

    return KeyFace;
});
