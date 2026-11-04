// Treachery card, or a weakness treachery: $Subtype<suffix> is None,
// Weakness, BasicWeakness or StoryWeakness. A weakness uses the weakness
// template, its <template>-Weakness-<name> settings where they differ, and a
// subtype line; a basic or story weakness adds the weakness overlay, a basic
// weakness its icon. Only a plain or story weakness treachery shows the
// encounter set.
//
// Module: returns TreacheryFace.
define([
    'faces/CardFace',
    'faces/Face',
    'faces/FaceUtils',
    'se/strings',
    'se/ui',
], function (CardFace, Face, FaceUtils, strings, ui) {
    const Subtypes = ['None', 'BasicWeakness', 'Weakness', 'StoryWeakness'];

    function TreacheryFace() {
        CardFace.call(this);
        // the side's subtype, while it is painted
        this.subtype = 'None';
    }

    TreacheryFace.prototype = Object.create(CardFace.prototype);
    TreacheryFace.prototype.constructor = TreacheryFace;
    TreacheryFace.prototype.template = 'AHLCG-TreacheryFace';
    TreacheryFace.prototype.labelKey = 'AHLCG-Label-Treachery';
    TreacheryFace.prototype.hasSubtype = true;
    TreacheryFace.prototype.fillReturnEncounterIcon = true;

    TreacheryFace.prototype.defaultValues = function (diy, faceIndex) {
        return { Subtype: 'None' };
    };

    TreacheryFace.prototype.clearType = function (diy, faceIndex) {
        diy.settings.reset('Subtype' + this.suffix(faceIndex));
    };

    TreacheryFace.prototype.createPanels = function (diy, bindings, faceIndex) {
        var panel = new ui.Grid();
        var items = Subtypes.map(function (id) {
            return new arkham.diy.ListItem(
                id,
                strings.string('AHLCG-WknType-' + id)
            );
        });
        var list = new ui.comboBox(items, null);
        this.bind(bindings, faceIndex, 'Subtype', list);
        panel.place(
            strings.string('AHLCG-Type'),
            'align right',
            list,
            'pushx, growx'
        );
        return [{ panel: panel, title: strings.string('AHLCG-BasicData') }];
    };

    TreacheryFace.prototype.readSubtype = function (diy, faceIndex) {
        var subtype = String(
            diy.settings.get('Subtype' + this.suffix(faceIndex), 'None')
        );
        this.subtype = Subtypes.indexOf(subtype) >= 0 ? subtype : 'None';
        return this.subtype;
    };

    // a weakness's own settings, where it has them
    TreacheryFace.prototype.key = function (settings, name) {
        if (this.subtype !== 'None') {
            let key = this.template + '-Weakness-' + name;
            if (settings.get(key) != null) return key;
        }
        return Face.prototype.key.call(this, settings, name);
    };

    TreacheryFace.prototype.createPainter = function (diy, sheet, faceIndex) {
        this.readSubtype(diy, faceIndex);
        return CardFace.prototype.createPainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
    };

    TreacheryFace.prototype.templateKey = function (diy, faceIndex) {
        return this.subtype === 'None'
            ? null
            : this.template + '-Weakness-template';
    };

    TreacheryFace.prototype.paint = function (
        g,
        diy,
        sheet,
        boxes,
        collector,
        art
    ) {
        this.readSubtype(diy, sheet.getSheetIndex());
        CardFace.prototype.paint.call(
            this,
            g,
            diy,
            sheet,
            boxes,
            collector,
            art
        );
    };

    TreacheryFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
        var suffix = this.suffix(sheet.getSheetIndex());
        var subtype = this.subtype;

        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);

        if (subtype !== 'None') {
            // the overlays are part of the template
            if (!this.replaced && subtype !== 'Weakness')
                this.paintImage(
                    g,
                    diy,
                    sheet,
                    'overlays/AHLCG-BasicWeakness.png',
                    'BasicWeakness'
                );
            if (!this.replaced && subtype === 'BasicWeakness')
                this.paintImage(
                    g,
                    diy,
                    sheet,
                    'icons/AHLCG-BasicWeakness.png',
                    'BasicWeaknessIcon'
                );
            this.paintSubtype(
                g,
                diy,
                boxes.subtype,
                subtype === 'BasicWeakness'
                    ? 'AHLCG-Label-BasicWeakness'
                    : 'AHLCG-Label-Weakness'
            );
        }

        this.paintBody(g, diy, boxes.body, suffix);

        var encounter = subtype === 'None' || subtype === 'StoryWeakness';
        this.paintCollector(
            g,
            diy,
            sheet,
            boxes,
            collector,
            encounter,
            encounter
        );
    };

    return TreacheryFace;
});
