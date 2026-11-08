// Act back: the title up its side, game text blocks, the index of the side
// and the encounter set.
//
// Module: returns ActBackFace.
import ActAgenda from './ActAgenda.mjs';
import CollectorInfo from './CollectorInfo.mjs';
import FaceUtils from './FaceUtils.mjs';
import TextBlocksFace from './TextBlocksFace.mjs';
import strings from '../se/strings.mjs';

class ActBackFace extends TextBlocksFace {
    template = 'AHLCG-ActBackFace';
    labelKey = 'AHLCG-Label-Act';
    usesCollection = false;
    usesCopyright = false;
    usesTemplateReplacement = true;
    hasTracker = false;

    setDefaults(diy, faceIndex, keep) {
        super.setDefaults(diy, faceIndex, keep);
        this.setSettings(diy, true, {
            ScenarioIndex: '1',
            ScenarioDeckID: 'a',
        });
    }

    createPainter(diy, sheet, faceIndex) {
        var boxes = super.createPainter(diy, sheet, faceIndex);
        boxes.index = this.createBox(diy, sheet, 'BackScenarioIndex');
        boxes.index.setLineTightness(
            Number(
                diy.settings.get(
                    this.key(diy.settings, 'BackScenarioIndex-tightness')
                )
            )
        );
        ActAgenda.initSuffixTags(diy, boxes.index);
        return boxes;
    }

    paint(g, diy, sheet, boxes, collector) {
        this.clearSheet(g, sheet);
        this.paintTemplateImage(g, sheet, null);
        FaceUtils.translateToTrim(g, sheet);

        ActAgenda.paintBackName(this, g, diy, sheet, boxes.name);
        this.paintText(g, diy, sheet, boxes, 0);
        ActAgenda.paintIndexBack(
            this,
            g,
            diy,
            sheet,
            boxes.index,
            String(strings.gstring(this.labelKey))
        );
        CollectorInfo.paintEncounterIcon(g, diy, sheet, this, collector);
    }
}

export default ActBackFace;
