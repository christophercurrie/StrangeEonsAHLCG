// Enemy card: art, title and subtitle, fight, health and evade, damage and
// horror, and game text that follows the outline of the art window.
//
// Module: returns EnemyFace.
define([
    'faces/CollectorInfo',
    'faces/Face',
    'faces/FaceUtils',
    'faces/PortraitArt',
    'se/imageutils',
    'se/markup',
    'se/strings',
    'se/ui',
], function (
    CollectorInfo,
    Face,
    FaceUtils,
    PortraitArt,
    imageutils,
    markup,
    strings,
    ui
) {
    const Parts = ['Traits', 'Keywords', 'Rules', 'Flavor', 'Victory'];
    const White = java.awt.Color.WHITE;
    const Black = java.awt.Color.BLACK;

    function EnemyFace() {
        Face.call(this);
    }

    EnemyFace.prototype = Object.create(Face.prototype);
    EnemyFace.prototype.constructor = EnemyFace;
    EnemyFace.prototype.template = 'AHLCG-EnemyFace';
    EnemyFace.prototype.portraits = ['Portrait'];
    EnemyFace.prototype.usesCollection = true;
    EnemyFace.prototype.usesEncounter = true;
    EnemyFace.prototype.usesCopyright = true;
    EnemyFace.prototype.usesTemplateReplacement = true;
    EnemyFace.prototype.fillReturnEncounterIcon = true;

    EnemyFace.prototype.setDefaults = function (diy, faceIndex, keep) {
        var values = {
            Unique: '0',
            Subtitle: '',
            Health: '2',
            PerInvestigator: '0',
            Attack: '2',
            PerInvestigatorAttack: '0',
            Evade: '2',
            PerInvestigatorEvade: '0',
            Damage: '0',
            Horror: '0',
            Artist: '',
        };
        Parts.forEach(function (part) {
            values[part] = '';
        });
        // the front's title is the component name
        if (faceIndex !== 0) values.Title = '';
        this.setValues(diy, faceIndex, keep, values);

        // keyed <part><suffix>Spacing, as legacy cards save them
        var suffix = this.suffix(faceIndex);
        var spacing = {};
        Parts.slice(0, -1).forEach(function (part) {
            spacing[part + suffix + 'Spacing'] = '0';
        });
        this.setSettings(diy, keep, spacing);
    };

    EnemyFace.prototype.createInterface = function (diy, bindings, faceIndex) {
        return {
            general: [
                {
                    panel: this.createTitlePanel(diy, bindings, faceIndex),
                    title: strings.string('AHLCG-Title'),
                },
                {
                    panel: this.createStatPanel(bindings, faceIndex),
                    title: strings.string('AHLCG-BasicData'),
                },
            ],
            tabs: [
                {
                    panel: FaceUtils.createTextPanel(
                        this,
                        bindings,
                        faceIndex,
                        Parts,
                        '',
                        6
                    ),
                    title: strings.string('AHLCG-Rules'),
                },
            ],
        };
    };

    function iconButton(name) {
        var ImageUtils = imageutils.ImageUtils;
        return new ui.toggleButton(
            '',
            ImageUtils.createIcon(
                ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + name + '.png'),
                12,
                12
            ),
            false
        );
    }

    // title with a unique toggle, and subtitle
    EnemyFace.prototype.createTitlePanel = function (diy, bindings, faceIndex) {
        var panel = new ui.Grid();
        var titleField = new ui.textField('', 30);
        if (faceIndex === 0) {
            diy.setNameField(titleField);
            titleField.setText(diy.getName());
        } else this.bind(bindings, faceIndex, 'Title', titleField);

        var uniqueButton = iconButton('Unique');
        this.bind(bindings, faceIndex, 'Unique', uniqueButton);
        var subtitleField = new ui.textField('', 30);
        this.bind(bindings, faceIndex, 'Subtitle', subtitleField);

        panel.place(
            strings.string('AHLCG-Title'),
            'align right',
            uniqueButton,
            'split, wmax 35, hmin 25, hmax 25',
            titleField,
            'wrap, pushx, growx',
            strings.string('AHLCG-Subtitle'),
            'align right',
            subtitleField,
            'wrap, pushx, growx'
        );
        return panel;
    };

    // stats, each with a per investigator toggle, and damage and horror
    EnemyFace.prototype.createStatPanel = function (bindings, faceIndex) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = new ui.Grid();

        function list(name, items) {
            var control = new ui.comboBox(items, null);
            face.bind(bindings, faceIndex, name, control);
            return control;
        }
        function perInvestigator(name) {
            var control = iconButton('PerInvestigator');
            face.bind(bindings, faceIndex, name, control);
            return control;
        }
        var toggle = 'wmax 35, hmin 25, hmax 25';

        panel.place(
            strings.string('AHLCG-Attack'),
            'align right',
            list('Attack', o.comboEnemyStat),
            'pushx, growx',
            perInvestigator('PerInvestigatorAttack'),
            toggle,
            strings.string('AHLCG-Damage'),
            'align right, gapx 10',
            list('Damage', o.combo5),
            'wrap, pushx, growx, sizegroup sp',
            strings.string('AHLCG-Health'),
            'align right',
            list('Health', o.comboEnemyHealth),
            'pushx, growx',
            perInvestigator('PerInvestigator'),
            toggle,
            strings.string('AHLCG-Horror'),
            'align right',
            list('Horror', o.combo5),
            'wrap, pushx, growx, sizegroup sp',
            strings.string('AHLCG-Evade'),
            'align right',
            list('Evade', o.comboEnemyStat),
            'pushx, growx',
            perInvestigator('PerInvestigatorEvade'),
            toggle
        );
        return panel;
    };

    EnemyFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        var boxes = {
            label: this.createBox(diy, sheet, 'Label'),
            name: this.createBox(diy, sheet, 'Name'),
            subtitle: this.createBox(diy, sheet, 'Subtitle'),
            body: this.createBox(diy, sheet, 'Body'),
            artist: this.createBox(diy, sheet, 'Artist'),
            collectionNumber: this.createBox(diy, sheet, 'CollectionNumber'),
            encounterNumber: this.createBox(diy, sheet, 'EncounterNumber'),
            copyright: this.createBox(diy, sheet, 'Copyright'),
        };
        FaceUtils.initBodyTags(diy, boxes.name);
        boxes.body.pageShape = FaceUtils.plugin().getEnemyTextShape(
            diy.settings.getRegion(this.key(diy.settings, 'Body-region'))
        );
        FaceUtils.initBodyTags(diy, boxes.body);
        FaceUtils.initCopyrightTags(diy, boxes.copyright);
        return boxes;
    };

    EnemyFace.prototype.paint = function (
        g,
        diy,
        sheet,
        boxes,
        collector,
        art
    ) {
        var settings = diy.settings;
        var suffix = this.suffix(sheet.getSheetIndex());
        var subtitle = String(settings.get('Subtitle' + suffix, ''));

        // the art shows through the template
        this.clearSheet(g, sheet);
        var transform = g.getTransform();
        FaceUtils.translateToTrim(g, sheet);
        PortraitArt.paint(g, diy, sheet, art.Portrait);
        g.setTransform(transform);
        this.paintTemplateImage(
            g,
            sheet,
            subtitle.length > 0 ? this.template + '-Subtitled-template' : null
        );
        FaceUtils.translateToTrim(g, sheet);

        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);
        if (subtitle.length > 0)
            this.paintSubtitle(g, diy, boxes.subtitle, subtitle);

        ['Attack', 'Evade'].forEach(function (stat) {
            this.paintStat(g, diy, sheet, stat, suffix);
        }, this);
        this.paintHealth(g, diy, sheet, suffix);
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintTokens(g, diy, sheet, 'Damage', suffix);
        this.paintTokens(g, diy, sheet, 'Horror', suffix);

        CollectorInfo.paint(g, diy, sheet, this, boxes, collector, true);
        CollectorInfo.paintArtist(g, diy, sheet, this, boxes.artist);
    };

    EnemyFace.prototype.paintLabel = function (g, diy, box) {
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Label-region')
        );
        region.y += parseInt(FaceUtils.plugin().typeFontOffset);
        box.markupText = String(
            strings.gstring('AHLCG-Label-Enemy')
        ).toUpperCase();
        box.drawAsSingleLine(g, region);
    };

    // a back without a title of its own shows the component name
    EnemyFace.prototype.getTitle = function (diy, faceIndex) {
        var title = Face.prototype.getTitle.call(this, diy, faceIndex);
        return title.length > 0 ? title : String(diy.name);
    };

    // The title, after the unique symbol if unique; each line of a two line
    // title a little lower.
    EnemyFace.prototype.paintName = function (g, diy, sheet, box) {
        var faceIndex = sheet.getSheetIndex();
        var title = this.getTitle(diy, faceIndex);
        if (title.length === 0) return;

        if (String(diy.settings.get('Unique' + this.suffix(faceIndex))) === '1')
            title = '<uni>' + title;

        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Name-region')
        );
        region.y += parseInt(FaceUtils.plugin().titleFontOffset);

        title.split('\n').forEach(function (line) {
            box.markupText = line;
            box.drawAsSingleLine(g, region);
            region.y += 16;
            region.height -= 16;
        });
    };

    EnemyFace.prototype.paintSubtitle = function (g, diy, box, subtitle) {
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Subtitle-region')
        );
        region.y += parseInt(FaceUtils.plugin().subtitleFontOffset);
        box.markupText = subtitle;
        box.drawAsSingleLine(g, region);
    };

    function outlined(sheet, g, text, region, font, size) {
        sheet.drawOutlinedTitle(
            g,
            text,
            region,
            font,
            size,
            0.8,
            White,
            Black,
            0,
            true
        );
    }

    // a dash for '-'; a per investigator value is narrower, followed by the
    // per investigator symbol
    EnemyFace.prototype.paintStat = function (g, diy, sheet, stat, suffix) {
        var o = FaceUtils.plugin();
        var settings = diy.settings;
        var value = String(settings.get(stat + suffix, ''));
        var region = function (name) {
            return settings.getRegion(this.key(settings, name + '-region'));
        }.bind(this);

        if (value === '-') {
            let dash = region(stat);
            dash.y += 6;
            outlined(sheet, g, '—', dash, o.costFont, 11.5);
        } else if (
            String(settings.get('PerInvestigator' + stat + suffix)) === '1'
        ) {
            let valueRegion = region(stat + 'PerInv');
            let iconRegion = region(stat + 'PerInvIcon');
            let size = 11.5;
            let symbolSize = 5.5;
            if (Number(value) === 1) {
                valueRegion.x -= 1;
                iconRegion.x -= 4;
            } else if (Number(value) > 9) {
                size = 10.5;
                symbolSize = 5.0;
                iconRegion.x += 4;
            }
            outlined(sheet, g, value, valueRegion, o.enemyFont, size);
            outlined(sheet, g, 'p', iconRegion, o.symbolFont, symbolSize);
        } else {
            outlined(sheet, g, value, region(stat), o.enemyFont, 11.0);
        }
    };

    EnemyFace.prototype.paintHealth = function (g, diy, sheet, suffix) {
        var o = FaceUtils.plugin();
        var settings = diy.settings;
        var health = String(settings.get('Health' + suffix, ''));
        var region = function (name) {
            return settings.getRegion(this.key(settings, name + '-region'));
        }.bind(this);

        if (health === '-') {
            let dash = region('HealthPerInv');
            dash.x += 5;
            dash.y += 6;
            outlined(sheet, g, '—', dash, o.costFont, 11.5);
        } else if (String(settings.get('PerInvestigator' + suffix)) === '1') {
            let valueRegion = region('HealthPerInv');
            let iconRegion = region('HealthPerInvIcon');
            let size = 13.5;
            if (health === 'X') {
                valueRegion.x += 2;
                iconRegion.x += 2;
            }
            if (Number(health) > 9) {
                size = 13.0;
                iconRegion.x += 4;
            }
            outlined(sheet, g, health, valueRegion, o.enemyFont, size);
            outlined(sheet, g, 'p', iconRegion, o.symbolFont, 6.5);
        } else {
            outlined(sheet, g, health, region('Health'), o.enemyFont, 13.5);
        }
    };

    EnemyFace.prototype.paintBody = function (g, diy, box, suffix) {
        var settings = diy.settings;
        var o = FaceUtils.plugin();

        var region = settings.getRegion(this.key(settings, 'Body-region'));
        region.y += parseInt(o.bodyFontOffset);

        box.setReplacementForTag('fullnameb', settings.get('TitleBack'));
        box.setLineTightness(
            Number(settings.get(this.key(settings, 'Body-tightness'))) *
                o.bodyFontTightness
        );
        box.setTextFitting(markup.FIT_SCALE_TEXT);
        box.markupText = FaceUtils.partsMarkup(settings, Parts, suffix);
        markup.updateNameTags(box, diy);
        box.draw(g, region);
    };

    // a Damage or Horror token for each point, up to five
    EnemyFace.prototype.paintTokens = function (g, diy, sheet, name, suffix) {
        var count = Number(diy.settings.get(name + suffix, '0'));
        var image = imageutils.ImageUtils.get(
            'ArkhamHorrorLCG/overlays/AHLCG-' + name + '.png'
        );
        for (let i = 1; i <= count; i++) {
            sheet.paintImage(
                g,
                image,
                diy.settings.getRegion(
                    this.key(diy.settings, name + i + '-region')
                )
            );
        }
    };

    return EnemyFace;
});
