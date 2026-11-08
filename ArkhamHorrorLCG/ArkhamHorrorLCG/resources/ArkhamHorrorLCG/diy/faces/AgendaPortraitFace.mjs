// Landscape art with a title, story and rules in a band along its bottom
// and the collector line, as the back of an act or agenda.
//
// Module: returns AgendaPortraitFace.
import CardFace from './CardFace.mjs';

class AgendaPortraitFace extends CardFace {
    template = 'AHLCG-AgendaPortraitFace';
    hasUnique = false;
    parts = ['Story', 'Rules'];

    partFormats(diy, suffix) {
        var alignment = String(
            diy.settings.get('AHLCG-Story-alignment', 'left')
        );
        return { Story: ['<' + alignment + '>', '<i>', '</i>'] };
    }

    paintContent(g, diy, sheet, boxes, collector) {
        this.paintName(g, diy, sheet, boxes.name);
        this.paintBody(g, diy, boxes.body, this.suffix(sheet.getSheetIndex()));
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
    }
}

export default AgendaPortraitFace;
