// Player skill: class art, title, level, up to six skill icons and game text
// in the skill's outline. A Weakness, BasicWeakness or StoryWeakness class
// card is a weakness skill; a Story or StoryWeakness one shows its encounter
// set, a story weakness's in place of the level.
//
// Module: returns SkillFace.
define([
    'faces/CardFace',
    'faces/FaceUtils',
    'faces/PlayerCard',
    'se/strings',
    'se/ui',
], function (CardFace, FaceUtils, PlayerCard, strings, ui) {
    const SkillCount = 6;

    function SkillFace() {
        CardFace.call(this);
        // whether the side being painted is a story weakness
        this.storyWeakness = false;
    }

    SkillFace.prototype = Object.create(CardFace.prototype);
    SkillFace.prototype.constructor = SkillFace;
    SkillFace.prototype.template = 'AHLCG-SkillFace';
    SkillFace.prototype.labelKey = 'AHLCG-Label-Skill';

    SkillFace.prototype.defaultValues = function (diy, faceIndex) {
        var values = { CardClass: 'Guardian', Level: '0' };
        for (let i = 1; i <= SkillCount; i++) values['Skill' + i] = 'None';
        return values;
    };

    SkillFace.prototype.createPanels = function (diy, bindings, faceIndex) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = new ui.Grid();
        var cell = 'pushx, growx, sizegroup sp';

        function list(name, items) {
            var control = new ui.comboBox(items, null);
            face.bind(bindings, faceIndex, name, control);
            return control;
        }

        panel.place(
            strings.string('AHLCG-Class'),
            'align right',
            list('CardClass', o.comboClassesBWS),
            cell,
            strings.string('AHLCG-Level'),
            'align right, gapx 10',
            list('Level', o.comboLevelsN),
            'wrap, ' + cell
        );
        for (let i = 1; i <= SkillCount; i++) {
            panel.place(
                strings.string('AHLCG-Icon') + ' ' + i,
                'align right',
                list('Skill' + i, o.comboSkills),
                (i < SkillCount ? 'wrap, ' : '') + cell
            );
        }
        return [{ panel: panel, title: strings.string('AHLCG-BasicData') }];
    };

    // the outline is the plug-in's, from the plain body region
    SkillFace.prototype.bodyShape = function (region) {
        return FaceUtils.plugin().getSkillTextShape(region);
    };

    SkillFace.prototype.templateKey = function (diy, faceIndex) {
        var cardClass = String(
            diy.settings.get('CardClass' + this.suffix(faceIndex), '')
        );
        return PlayerCard.templateKey(
            this,
            diy,
            faceIndex,
            PlayerCard.artInitial(cardClass)
        );
    };

    // a story weakness's encounter icon is where the level would be
    SkillFace.prototype.key = function (settings, name) {
        if (
            this.storyWeakness &&
            (name === 'EncounterIcon-region' ||
                name === 'ReturnEncounterIcon-region')
        )
            return this.template + '-StoryWeakness-EncounterIcon-region';
        return CardFace.prototype.key.call(this, settings, name);
    };

    SkillFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
        var suffix = this.suffix(sheet.getSheetIndex());
        var cardClass = String(diy.settings.get('CardClass' + suffix, ''));
        var art = PlayerCard.artInitial(cardClass);
        var weakness = PlayerCard.isWeakness(cardClass);
        this.storyWeakness = cardClass === 'StoryWeakness';

        this.paintLabel(g, diy, boxes.label);
        // the title sits a little higher on weakness art
        this.paintName(g, diy, sheet, boxes.name, art === 'W' ? 1 : 0);

        if (weakness) {
            if (!this.storyWeakness)
                PlayerCard.paintWeaknessLevel(this, g, diy, sheet, true);
            this.paintSubtype(
                g,
                diy,
                boxes.subtype,
                cardClass === 'BasicWeakness'
                    ? 'AHLCG-Label-BasicWeakness'
                    : 'AHLCG-Label-Weakness'
            );
            if (cardClass === 'BasicWeakness' && !this.replaced) {
                this.paintImage(
                    g,
                    diy,
                    sheet,
                    'overlays/AHLCG-BasicWeaknessSkill.png',
                    'BasicWeaknessSkill'
                );
                this.paintImage(
                    g,
                    diy,
                    sheet,
                    'icons/AHLCG-BasicWeakness.png',
                    'BasicWeaknessIcon'
                );
            }
        } else {
            PlayerCard.paintLevel(
                this,
                g,
                diy,
                sheet,
                art,
                String(diy.settings.get('Level' + suffix, '0')),
                true
            );
        }

        PlayerCard.paintSkillIcons(
            this,
            g,
            diy,
            sheet,
            suffix,
            cardClass,
            SkillCount,
            true
        );
        this.paintBody(
            g,
            diy,
            boxes.body,
            suffix,
            weakness ? 'WeaknessBody' : 'Body'
        );

        var story = cardClass === 'Story' || this.storyWeakness;
        if (cardClass === 'Story')
            this.paintImage(
                g,
                diy,
                sheet,
                'overlays/AHLCG-Asset-EncounterSetOverlay.png',
                'Encounter-overlay'
            );
        else if (this.storyWeakness && !this.replaced)
            this.paintImage(
                g,
                diy,
                sheet,
                'overlays/AHLCG-StoryWeaknessSkill.png',
                'StoryWeaknessSkill'
            );
        this.paintCollector(g, diy, sheet, boxes, collector, story, story);
        this.storyWeakness = false;
    };

    return SkillFace;
});
