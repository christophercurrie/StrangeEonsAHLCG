// A treachery that is also a location: treachery art and text with shroud
// and clues.
//
// Module: returns TreacheryLocationFace.
import LocationFace from './LocationFace.mjs';
import LocationParts from './LocationParts.mjs';
import TreacheryFace from './TreacheryFace.mjs';
import strings from '../se/strings.mjs';

class TreacheryLocationFace extends TreacheryFace {
    template = 'AHLCG-TreacheryLocationFace';
    subtypes = null;
    hasUnique = false;
    fillReturnEncounterIcon = false;

    defaultValues(diy, faceIndex) {
        return {
            Shroud: '1',
            Clues: '1',
            PerInvestigator: '1',
            ShroudPerInvestigator: '0',
        };
    }

    createPanels(diy, bindings, faceIndex) {
        return [
            {
                panel: LocationFace.prototype.createStatPanel.call(
                    this,
                    bindings,
                    faceIndex
                ),
                title: strings.string('AHLCG-BasicData'),
            },
        ];
    }

    paintContent(g, diy, sheet, boxes, collector) {
        var suffix = this.suffix(sheet.getSheetIndex());
        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);
        this.paintBody(g, diy, boxes.body, suffix);
        LocationParts.paintShroud(this, g, diy, sheet, suffix);
        LocationParts.paintClues(this, g, diy, sheet, suffix, false, null);
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
    }
}

export default TreacheryLocationFace;
