// Act back: the title up its side, game text blocks, the index of the side
// and the encounter set.
//
// Module: returns ActBackFace.
define([
    'faces/ActAgenda',
    'faces/CollectorInfo',
    'faces/FaceUtils',
    'faces/TextBlocksFace',
    'se/strings',
], function (ActAgenda, CollectorInfo, FaceUtils, TextBlocksFace, strings) {
    function ActBackFace() {
        TextBlocksFace.call(this);
    }

    ActBackFace.prototype = Object.create(TextBlocksFace.prototype);
    ActBackFace.prototype.constructor = ActBackFace;
    ActBackFace.prototype.template = 'AHLCG-ActBackFace';
    ActBackFace.prototype.labelKey = 'AHLCG-Label-Act';
    ActBackFace.prototype.usesCollection = false;
    ActBackFace.prototype.usesCopyright = false;
    ActBackFace.prototype.usesTemplateReplacement = true;
    ActBackFace.prototype.hasTracker = false;

    ActBackFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        TextBlocksFace.prototype.setDefaults.call(this, diy, faceIndex, keep);
        this.setSettings(diy, true, {
            ScenarioIndex: '1',
            ScenarioDeckID: 'a',
        });
    };

    ActBackFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        var boxes = TextBlocksFace.prototype.createPainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
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
    };

    ActBackFace.prototype.paint = function (g, diy, sheet, boxes, collector) {
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
    };

    return ActBackFace;
});
