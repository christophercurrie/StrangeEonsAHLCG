// Act: landscape art, a two line title, story and rules in the act's
// outline, clues and the act's index. A reversed act is mirrored left to
// right, with its collector line moved to the other end.
//
// Module: returns ActFace.
define([
    'faces/ActAgenda',
    'faces/CardFace',
    'faces/FaceUtils',
    'faces/LocationParts',
    'faces/PortraitArt',
    'se/strings',
    'se/ui',
], function (
    ActAgenda,
    CardFace,
    FaceUtils,
    LocationParts,
    PortraitArt,
    strings,
    ui
) {
    // the act's outline, as fractions of the body region
    const OutlineX = [0.0, 0.0, 0.715, 0.83, 0.83, 1.0, 1.0];
    const OutlineY = [0.0, 1.0, 1.0, 0.957, 0.85, 0.85, 0.0];
    // collector regions, moved along the bottom of a reversed card
    const Collector = [
        'Artist',
        'Copyright',
        'CollectionNumber',
        'CollectionIcon',
        'EncounterNumber',
    ];

    function ActFace() {
        CardFace.call(this);
        // whether the side being painted is reversed
        this.reversed = false;
    }

    ActFace.prototype = Object.create(CardFace.prototype);
    ActFace.prototype.constructor = ActFace;
    ActFace.prototype.template = 'AHLCG-ActFace';
    ActFace.prototype.labelKey = 'AHLCG-Label-Act';
    ActFace.prototype.hasUnique = false;
    ActFace.prototype.parts = ['ActStory', 'Rules'];
    // how far a reversed card moves its collector line
    ActFace.prototype.reversedCollectorShift = 209;
    // the body's outline, or null for none
    ActFace.prototype.outlineX = OutlineX;
    ActFace.prototype.outlineY = OutlineY;

    ActFace.prototype.defaultValues = function (diy, faceIndex) {
        return {
            Clues: '2',
            PerInvestigator: '0',
            Asterisk: '0',
            Orientation: 'Standard',
        };
    };

    ActFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        CardFace.prototype.setDefaults.call(this, diy, faceIndex, keep);
        this.setSettings(diy, true, {
            ScenarioIndex: '1',
            ScenarioDeckID: 'a',
        });
    };

    // whether the face can be reversed, and shows its index
    ActFace.prototype.hasOrientation = true;
    ActFace.prototype.showsIndex = true;
    // the stat beside the index, and its label
    ActFace.prototype.statKey = 'Clues';
    ActFace.prototype.indexLabel = 'AHLCG-ActNumber';

    // The index, the stat with its per investigator and asterisk toggles,
    // the deck and the orientation. The index and deck are the card's, shown
    // on both sides.
    ActFace.prototype.createPanels = function (diy, bindings, faceIndex) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = new ui.Grid();
        var cell = 'pushx, growx, sizegroup sp';
        var toggle = 'wmax 35, hmin 25, hmax 25';

        function card(key, control) {
            bindings.add(key, control, [0, 1]);
            face.boundControls.push(control);
            return control;
        }
        function side(key, control) {
            face.bind(bindings, faceIndex, key, control);
            return control;
        }
        var perInvestigator = side(
            'PerInvestigator',
            CardFace.iconButton('PerInvestigator')
        );
        var asterisk = side('Asterisk', new ui.toggleButton('*', null, false));
        perInvestigator.addActionListener(function () {
            asterisk.setSelected(false);
        });
        asterisk.addActionListener(function () {
            perInvestigator.setSelected(false);
        });

        panel.place(
            strings.string(this.indexLabel),
            'align right',
            card('ScenarioIndex', new ui.comboBox(o.combo20, null)),
            cell,
            strings.string('AHLCG-' + this.statKey),
            'align right, gapx 10',
            side(this.statKey, new ui.comboBox(o.comboClues, null)),
            cell,
            perInvestigator,
            toggle,
            asterisk,
            'wrap, ' + toggle,
            strings.string('AHLCG-ScenarioDeckID'),
            'align right',
            card(
                'ScenarioDeckID',
                new ui.comboBox(
                    [
                        'a',
                        'c',
                        'e',
                        'g',
                        'i',
                        'k',
                        'm',
                        'o',
                        'q',
                        's',
                        'u',
                        'w',
                        'y',
                    ],
                    null
                )
            ),
            cell
        );
        if (this.hasOrientation)
            panel.place(
                strings.string('AHLCG-Orientation'),
                'align right, gapx 10',
                side(
                    'Orientation',
                    new ui.comboBox(o.comboTemplateOrientation, null)
                ),
                'pushx, growx, span 3'
            );
        return [{ panel: panel, title: strings.string('AHLCG-BasicData') }];
    };

    ActFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        var boxes = CardFace.prototype.createPainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
        if (!this.showsIndex) return boxes;
        boxes.index = this.createBox(diy, sheet, 'ScenarioIndex');
        ActAgenda.initSuffixTags(diy, boxes.index);
        return boxes;
    };

    ActFace.prototype.partFormats = function (diy, suffix) {
        var alignment = String(
            diy.settings.get('AHLCG-Story-alignment', 'left')
        );
        return {
            ActStory: ['<' + alignment + '>', '<css>', '</css>'],
        };
    };

    ActFace.prototype.bodyRegion = function (diy, regionName) {
        var region = CardFace.prototype.bodyRegion.call(this, diy, regionName);
        return this.reversed ? ActAgenda.reverse(region) : region;
    };

    ActFace.prototype.collectorRegion = function (diy, name) {
        var region = CardFace.prototype.collectorRegion.call(this, diy, name);
        if (!this.reversed) return region;
        if (Collector.indexOf(name) >= 0)
            region.x += this.reversedCollectorShift;
        else ActAgenda.reverse(region);
        return region;
    };

    // the art's clip region, mirrored on a reversed card
    ActFace.prototype.placeArt = function (diy, portrait) {
        if (portrait == null) return;
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'DefaultPortrait-portrait-clip-region')
        );
        if (this.reversed) ActAgenda.reverse(region);
        var key = portrait.getBaseKey() + '-portrait-clip-region';
        if (String(diy.settings.get(key)) !== String(region.toString()))
            diy.settings.setRegion(key, region);
    };

    ActFace.prototype.paint = function (g, diy, sheet, boxes, collector, art) {
        var faceIndex = sheet.getSheetIndex();
        this.reversed =
            this.hasOrientation && ActAgenda.isReversed(this, diy, faceIndex);

        this.clearSheet(g, sheet);
        var transform = g.getTransform();
        FaceUtils.translateToTrim(g, sheet);
        this.placeArt(diy, art.Portrait);
        PortraitArt.paint(g, diy, sheet, art.Portrait);
        g.setTransform(transform);
        this.replaced = this.paintReplacement(g, sheet);
        if (!this.replaced) {
            let key = this.template + '-template';
            if (this.reversed)
                ActAgenda.paintMirroredTemplate(g, diy, sheet, key);
            else sheet.paintImage(g, key, 0, 0);
        }
        FaceUtils.translateToTrim(g, sheet);

        this.paintContent(g, diy, sheet, boxes, collector);
        this.reversed = false;
    };

    // the stat in the corner: clues
    ActFace.prototype.paintStat = function (g, diy, sheet, suffix, reverse) {
        LocationParts.paintClues(this, g, diy, sheet, suffix, true, reverse);
    };

    ActFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
        var suffix = this.suffix(sheet.getSheetIndex());
        var reversed = this.reversed;

        ActAgenda.paintName(this, g, diy, sheet, boxes.name, reversed);

        if (this.outlineX != null) {
            let region = this.bodyRegion(diy, 'Body');
            boxes.body.pageShape = FaceUtils.polygonShape(
                region,
                reversed
                    ? ActAgenda.reversePoints(this.outlineX)
                    : this.outlineX,
                this.outlineY
            );
        }
        this.paintBody(g, diy, boxes.body, suffix);

        this.paintStat(
            g,
            diy,
            sheet,
            suffix,
            reversed ? ActAgenda.reverse : null
        );
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
        if (this.showsIndex)
            ActAgenda.paintIndexFront(
                this,
                g,
                diy,
                sheet,
                boxes.index,
                String(strings.gstring(this.labelKey)),
                reversed
            );
    };

    return ActFace;
});
