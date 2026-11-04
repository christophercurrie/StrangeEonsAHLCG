// Agenda with full width art: an agenda face (see AgendaFace) whose title
// and text sit in a band over the art. It has no orientation, no outline
// and no index on its front.
//
// Module: returns AgendaFrontPortraitFace.
define(['faces/AgendaFace'], function (AgendaFace) {
    function AgendaFrontPortraitFace() {
        AgendaFace.call(this);
    }

    AgendaFrontPortraitFace.prototype = Object.create(AgendaFace.prototype);
    AgendaFrontPortraitFace.prototype.constructor = AgendaFrontPortraitFace;
    AgendaFrontPortraitFace.prototype.template =
        'AHLCG-AgendaFrontPortraitFace';
    AgendaFrontPortraitFace.prototype.hasOrientation = false;
    AgendaFrontPortraitFace.prototype.showsIndex = false;
    AgendaFrontPortraitFace.prototype.outlineX = null;
    AgendaFrontPortraitFace.prototype.outlineY = null;

    AgendaFrontPortraitFace.prototype.defaultValues = function (
        diy,
        faceIndex
    ) {
        var values = AgendaFace.prototype.defaultValues.call(
            this,
            diy,
            faceIndex
        );
        delete values.Orientation;
        return values;
    };

    return AgendaFrontPortraitFace;
});
