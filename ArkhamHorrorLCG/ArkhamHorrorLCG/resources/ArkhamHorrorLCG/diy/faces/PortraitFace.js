// Full bleed art, with the artist's credit when the side has one.
//
// Module: returns PortraitFace.
define([
    'faces/CollectorInfo',
    'faces/Face',
    'faces/FaceUtils',
    'faces/PortraitArt',
], function (CollectorInfo, Face, FaceUtils, PortraitArt) {
    function PortraitFace() {
        Face.call(this);
    }

    PortraitFace.prototype = Object.create(Face.prototype);
    PortraitFace.prototype.constructor = PortraitFace;
    PortraitFace.prototype.template = 'AHLCG-PortraitFace';
    PortraitFace.prototype.portraits = ['Portrait'];

    PortraitFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        this.setValues(diy, faceIndex, keep, { Artist: '' });
    };

    PortraitFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        return { artist: this.createBox(diy, sheet, 'Artist') };
    };

    PortraitFace.prototype.paint = function (
        g,
        diy,
        sheet,
        boxes,
        collector,
        art
    ) {
        this.clearSheet(g, sheet);
        FaceUtils.translateToTrim(g, sheet);
        PortraitArt.paint(g, diy, sheet, art.Portrait);
        CollectorInfo.paintArtist(g, diy, sheet, this, boxes.artist);
    };

    return PortraitFace;
});
