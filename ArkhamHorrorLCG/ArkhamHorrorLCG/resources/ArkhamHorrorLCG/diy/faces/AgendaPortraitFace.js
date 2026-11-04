// Landscape art with a title, story and rules in a band along its bottom
// and the collector line, as the back of an act or agenda.
//
// Module: returns AgendaPortraitFace.
define(['faces/CardFace'], function (CardFace) {
    function AgendaPortraitFace() {
        CardFace.call(this);
    }

    AgendaPortraitFace.prototype = Object.create(CardFace.prototype);
    AgendaPortraitFace.prototype.constructor = AgendaPortraitFace;
    AgendaPortraitFace.prototype.template = 'AHLCG-AgendaPortraitFace';
    AgendaPortraitFace.prototype.hasUnique = false;
    AgendaPortraitFace.prototype.parts = ['Story', 'Rules'];

    AgendaPortraitFace.prototype.partFormats = function (diy, suffix) {
        var alignment = String(
            diy.settings.get('AHLCG-Story-alignment', 'left')
        );
        return { Story: ['<' + alignment + '>', '<i>', '</i>'] };
    };

    AgendaPortraitFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
        this.paintName(g, diy, sheet, boxes.name);
        this.paintBody(g, diy, boxes.body, this.suffix(sheet.getSheetIndex()));
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
    };

    return AgendaPortraitFace;
});
