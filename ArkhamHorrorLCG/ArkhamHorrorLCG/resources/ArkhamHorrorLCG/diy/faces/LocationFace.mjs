// Revealed location: art, title and subtitle, shroud and clues, the
// location's icon and its connections, game text in the location outline,
// victory, and the collector line.
//
// Module: returns LocationFace.
import CardFace from './CardFace.mjs';
import FaceUtils from './FaceUtils.mjs';
import LocationParts from './LocationParts.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

const Connections = 6;

class LocationFace extends CardFace {
    template = 'AHLCG-LocationFace';
    labelKey = 'AHLCG-Label-Location';
    hasUnique = false;
    hasSubtitle = true;
    subtitleRegion = 'SubtitleText';
    fillReturnEncounterIcon = true;
    bodyParts = ['Traits', 'Keywords', 'Rules', 'Flavor'];

    // the icon list of a connection, and the default for one; a back's
    // icons copy the front's
    connectionChoices = 'comboConnections';
    noConnection = 'None';

    iconChoices(faceIndex) {
        return faceIndex === 0
            ? this.connectionChoices
            : 'comboConnectionsBack';
    }

    defaultValues(diy, faceIndex) {
        var back = faceIndex !== 0;
        var values = {
            LocationIcon: back ? 'Copy front' : 'Circle',
            Shroud: '1',
            Clues: '1',
            PerInvestigator: '1',
            ShroudPerInvestigator: '0',
            ShowEncounterIcon: '1',
        };
        for (let i = 1; i <= Connections; i++)
            values['Connection' + i + 'Icon'] = back
                ? 'Copy front'
                : this.noConnection;
        return values;
    }

    createStatPanel(bindings, faceIndex) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = new ui.Grid();
        function control(name, created) {
            face.bind(bindings, faceIndex, name, created);
            return created;
        }
        var toggle = 'wmax 35, hmin 25, hmax 25';
        panel.place(
            strings.string('AHLCG-Shroud'),
            'align right',
            control('Shroud', new ui.comboBox(o.comboXD20, null)),
            'pushx, growx, sizegroup sp',
            control(
                'ShroudPerInvestigator',
                CardFace.iconButton('PerInvestigator')
            ),
            toggle,
            strings.string('AHLCG-Clues'),
            'align right',
            control('Clues', new ui.comboBox(o.comboClues, null)),
            'pushx, growx, sizegroup sp',
            control('PerInvestigator', CardFace.iconButton('PerInvestigator')),
            'wrap, ' + toggle
        );
        return panel;
    }

    // the location's icon and its connections, and whether it shows its
    // encounter set
    createConnectionPanel(bindings, faceIndex) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = new ui.Grid();
        var items = o[this.iconChoices(faceIndex)];
        function list(name) {
            var control = new ui.comboBox(items, null);
            face.bind(bindings, faceIndex, name, control);
            return control;
        }
        var cell = 'pushx, growx, sizegroup sp';
        panel.place(
            strings.string('AHLCG-Icon'),
            'align right',
            list('LocationIcon'),
            'wrap, ' + cell
        );
        for (let i = 1; i <= 3; i++) {
            panel.place(
                String(i),
                'align right',
                list('Connection' + i + 'Icon'),
                cell,
                String(i + 3),
                'align right, gapx 10',
                list('Connection' + (i + 3) + 'Icon'),
                'wrap, ' + cell
            );
        }
        var show = new ui.checkBox(
            strings.string('AHLCG-EncounterSet'),
            true,
            null
        );
        this.bind(bindings, faceIndex, 'ShowEncounterIcon', show);
        panel.place(show, 'skip 1, span 3, wrap');
        return panel;
    }

    createPanels(diy, bindings, faceIndex) {
        return [
            {
                panel: this.createStatPanel(bindings, faceIndex),
                title: strings.string('AHLCG-BasicData'),
            },
            {
                panel: this.createConnectionPanel(bindings, faceIndex),
                title: strings.string('AHLCG-Connections'),
            },
        ];
    }

    bodyShape(region) {
        return FaceUtils.plugin().getLocationTextShape(region);
    }

    templateKey(diy, faceIndex) {
        var subtitle = String(
            diy.settings.get('Subtitle' + this.suffix(faceIndex), '')
        );
        return subtitle.length > 0 ? this.template + '-ST-template' : null;
    }

    createPainter(diy, sheet, faceIndex) {
        var boxes = super.createPainter(diy, sheet, faceIndex);
        // body text, aligned as victory
        boxes.victory = this.createBox(diy, sheet, 'Body');
        boxes.victory.alignment = diy.settings.getTextAlignment(
            this.key(diy.settings, 'Victory-alignment')
        );
        boxes.victory.setLineTightness(
            Number(
                diy.settings.get(this.key(diy.settings, 'Victory-tightness'))
            )
        );
        FaceUtils.initBodyTags(diy, boxes.victory);
        return boxes;
    }

    // the victory text, ending in a period
    paintVictory(g, diy, box, suffix) {
        var victory = String(diy.settings.get('Victory' + suffix, ''));
        if (victory !== '' && victory.slice(-1) !== '.') victory += '.';
        box.markupText = '<vic>' + victory + '</vic>';
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Victory-region')
        );
        region.y += parseInt(FaceUtils.plugin().victoryFontOffset);
        box.draw(g, region);
    }

    paintConnections(g, diy, sheet, suffix) {
        for (let i = 1; i <= Connections; i++) {
            LocationParts.paintIcon(
                this,
                g,
                diy,
                sheet,
                'Connection' + i + 'Icon',
                suffix,
                false
            );
        }
    }

    paintContent(g, diy, sheet, boxes, collector) {
        var suffix = this.suffix(sheet.getSheetIndex());
        var subtitle = String(diy.settings.get('Subtitle' + suffix, ''));

        this.paintName(g, diy, sheet, boxes.name);
        if (subtitle.length > 0)
            this.paintSubtitle(g, diy, boxes.subtitle, subtitle);
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintVictory(g, diy, boxes.victory, suffix);
        if (LocationParts.hasIcon(diy, 'LocationIcon', suffix))
            LocationParts.paintIcon(
                this,
                g,
                diy,
                sheet,
                'LocationIcon',
                suffix,
                true
            );
        LocationParts.paintShroud(this, g, diy, sheet, suffix);
        LocationParts.paintClues(this, g, diy, sheet, suffix, false, null);
        this.paintConnections(g, diy, sheet, suffix);

        var icon =
            String(diy.settings.get('ShowEncounterIcon' + suffix, '1')) === '1';
        this.paintCollector(g, diy, sheet, boxes, collector, icon, true);
        this.paintLabel(g, diy, boxes.label);
    }
}

export default LocationFace;
