// Treachery card, or a weakness treachery (see CardFace).
//
// Module: returns TreacheryFace.
import CardFace from './CardFace.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

class TreacheryFace extends CardFace {
    template = 'AHLCG-TreacheryFace';
    labelKey = 'AHLCG-Label-Treachery';
    fillReturnEncounterIcon = true;
    subtypes = ['None', 'BasicWeakness', 'Weakness', 'StoryWeakness'];
    weaknessOverlays = {
        BasicWeakness: 'BasicWeakness',
        StoryWeakness: 'BasicWeakness',
    };

    createPanels(diy, bindings, faceIndex) {
        var panel = new ui.Grid();
        panel.place(
            strings.string('AHLCG-Type'),
            'align right',
            this.createSubtypeList(bindings, faceIndex),
            'pushx, growx'
        );
        return [{ panel: panel, title: strings.string('AHLCG-BasicData') }];
    }

    paintContent(g, diy, sheet, boxes, collector) {
        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);
        this.paintWeakness(g, diy, sheet, boxes);
        this.paintBody(g, diy, boxes.body, this.suffix(sheet.getSheetIndex()));

        var encounter = this.showsEncounter();
        this.paintCollector(
            g,
            diy,
            sheet,
            boxes,
            collector,
            encounter,
            encounter
        );
    }
}

export default TreacheryFace;
