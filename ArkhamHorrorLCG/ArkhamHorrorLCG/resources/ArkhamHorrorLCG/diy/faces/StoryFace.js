// Story card: title, an optional tracking box and game text blocks.
// $StoryClass<suffix> picks a class template; Default is the plain one.
//
// Module: returns StoryFace.
define([
    'faces/FaceUtils',
    'faces/TextBlocksFace',
    'se/strings',
    'se/ui',
], function (FaceUtils, TextBlocksFace, strings, ui) {
    function StoryFace() {
        TextBlocksFace.call(this);
    }

    StoryFace.prototype = Object.create(TextBlocksFace.prototype);
    StoryFace.prototype.constructor = StoryFace;
    StoryFace.prototype.template = 'AHLCG-StoryFace';
    StoryFace.prototype.invertCollectionIcon = false;
    StoryFace.prototype.compactEncounterTotal = true;
    StoryFace.prototype.usesTemplateReplacement = true;

    StoryFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        TextBlocksFace.prototype.setDefaults.call(this, diy, faceIndex, keep);
        this.setValues(diy, faceIndex, keep, { StoryClass: 'Default' });
    };

    StoryFace.prototype.clearType = function (diy, faceIndex) {
        diy.settings.reset('StoryClass' + this.suffix(faceIndex));
    };

    // the title, with the class below it
    StoryFace.prototype.createTitlePanel = function (diy, bindings, faceIndex) {
        var panel = TextBlocksFace.prototype.createTitlePanel.call(
            this,
            diy,
            bindings,
            faceIndex
        );
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
    };

    // the class's template, if it has one
    StoryFace.prototype.templateKey = function (diy, faceIndex) {
        var storyClass = String(
            diy.settings.get('StoryClass' + this.suffix(faceIndex), 'Default')
        );
        var key = this.template + '-' + storyClass + '-template';
        return diy.settings.get(key) != null ? key : null;
    };

    StoryFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        var boxes = TextBlocksFace.prototype.createPainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
        boxes.label = this.createBox(diy, sheet, 'Label');
        return boxes;
    };

    StoryFace.prototype.paint = function (g, diy, sheet, boxes, collector) {
        var faceIndex = sheet.getSheetIndex();

        this.clearSheet(g, sheet);
        this.paintTemplateImage(g, sheet, this.templateKey(diy, faceIndex));
        FaceUtils.translateToTrim(g, sheet);

        this.paintLabel(g, diy, boxes.label);
        this.paintTitle(g, diy, boxes.name, this.getTitle(diy, faceIndex));
        this.paintText(g, diy, sheet, boxes, 0);
        this.paintCollector(g, diy, sheet, boxes, collector, true);
    };

    StoryFace.prototype.paintLabel = function (g, diy, box) {
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Label-region')
        );
        region.y += parseInt(FaceUtils.plugin().typeFontOffset);

        box.markupText = String(
            strings.gstring('AHLCG-Label-Story')
        ).toUpperCase();
        box.drawAsSingleLine(g, region);
    };

    return StoryFace;
});
