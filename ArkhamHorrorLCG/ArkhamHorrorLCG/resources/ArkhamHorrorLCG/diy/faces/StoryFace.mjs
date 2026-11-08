// Story card: title, an optional tracking box and game text blocks.
// $StoryClass<suffix> picks a class template; Default is the plain one.
//
// Module: returns StoryFace.
import FaceUtils from './FaceUtils.mjs';
import TextBlocksFace from './TextBlocksFace.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

class StoryFace extends TextBlocksFace {
    template = 'AHLCG-StoryFace';
    invertCollectionIcon = false;
    compactEncounterTotal = true;
    usesTemplateReplacement = true;

    setDefaults(diy, faceIndex, keep) {
        super.setDefaults(diy, faceIndex, keep);
        this.setValues(diy, faceIndex, keep, { StoryClass: 'Default' });
    }

    clearType(diy, faceIndex) {
        diy.settings.reset('StoryClass' + this.suffix(faceIndex));
    }

    // the title, with the class below it
    createTitlePanel(diy, bindings, faceIndex) {
        var panel = super.createTitlePanel(diy, bindings, faceIndex);
        var classList = new ui.comboBox(
            FaceUtils.plugin().comboStoryClass,
            null
        );
        this.bind(bindings, faceIndex, 'StoryClass', classList);
        panel.place(
            strings.string('AHLCG-Class'),
            'align right',
            classList,
            'wrap, width 40%'
        );
        return panel;
    }

    // the class's template, if it has one
    templateKey(diy, faceIndex) {
        var storyClass = String(
            diy.settings.get('StoryClass' + this.suffix(faceIndex), 'Default')
        );
        var key = this.template + '-' + storyClass + '-template';
        return diy.settings.get(key) != null ? key : null;
    }

    createPainter(diy, sheet, faceIndex) {
        var boxes = super.createPainter(diy, sheet, faceIndex);
        boxes.label = this.createBox(diy, sheet, 'Label');
        return boxes;
    }

    paint(g, diy, sheet, boxes, collector) {
        var faceIndex = sheet.getSheetIndex();

        this.clearSheet(g, sheet);
        this.paintTemplateImage(g, sheet, this.templateKey(diy, faceIndex));
        FaceUtils.translateToTrim(g, sheet);

        this.paintLabel(g, diy, boxes.label);
        this.paintTitle(g, diy, boxes.name, this.getTitle(diy, faceIndex));
        this.paintText(g, diy, sheet, boxes, 0);
        this.paintCollector(g, diy, sheet, boxes, collector, true);
    }

    paintLabel(g, diy, box) {
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Label-region')
        );
        region.y += parseInt(FaceUtils.plugin().typeFontOffset);

        box.markupText = String(
            strings.gstring('AHLCG-Label-Story')
        ).toUpperCase();
        box.drawAsSingleLine(g, region);
    }
}

export default StoryFace;
