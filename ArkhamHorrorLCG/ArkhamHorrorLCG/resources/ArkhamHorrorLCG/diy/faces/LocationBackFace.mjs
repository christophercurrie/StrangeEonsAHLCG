// Unrevealed location: art, title and subtitle, the location's icon and its
// connections, which can copy the revealed side's, game text in the location
// outline, the collection and encounter icons, artist and copyright. A side
// without a title of its own shows the component name.
//
// Module: returns LocationBackFace.
import CardFace from './CardFace.mjs';
import CollectorInfo from './CollectorInfo.mjs';
import Face from './Face.mjs';
import FaceUtils from './FaceUtils.mjs';
import LocationFace from './LocationFace.mjs';
import LocationParts from './LocationParts.mjs';
import strings from '../se/strings.mjs';

class LocationBackFace extends LocationFace {
    template = 'AHLCG-LocationBackFace';
    parts = ['Traits', 'Keywords', 'Rules', 'Flavor'];
    bodyParts = null;
    showsCollectionNumber = false;
    connectionChoices = 'comboConnectionsBack';
    noConnection = 'Copy front';

    defaultValues(diy, faceIndex) {
        var values = {
            LocationIcon: 'Copy front',
            ShowEncounterIcon: '1',
        };
        for (let i = 1; i <= 6; i++)
            values['Connection' + i + 'Icon'] = 'Copy front';
        return values;
    }

    createPanels(diy, bindings, faceIndex) {
        return [
            {
                panel: this.createConnectionPanel(bindings, faceIndex),
                title: strings.string('AHLCG-Connections'),
            },
        ];
    }

    bodyShape(region) {
        return FaceUtils.polygonShape(
            region,
            [0.111, 0.0, 0.0, 1.0, 1.0, 0.889],
            [0.0, 0.204, 1.0, 1.0, 0.204, 0.0]
        );
    }

    getTitle(diy, faceIndex) {
        var title = Face.prototype.getTitle.call(this, diy, faceIndex);
        return title.length > 0 ? title : String(diy.name);
    }

    // no victory box
    createPainter(diy, sheet, faceIndex) {
        return CardFace.prototype.createPainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
    }

    paintContent(g, diy, sheet, boxes, collector) {
        var settings = diy.settings;
        var suffix = this.suffix(sheet.getSheetIndex());
        var subtitle = String(settings.get('Subtitle' + suffix, ''));

        if (String(settings.get('ShowEncounterIcon' + suffix, '1')) === '1')
            CollectorInfo.paintEncounterIcon(g, diy, sheet, this, collector);
        this.paintLabel(g, diy, boxes.label);
        this.paintName(g, diy, sheet, boxes.name);
        if (subtitle.length > 0)
            this.paintSubtitle(g, diy, boxes.subtitle, subtitle);
        CollectorInfo.paintCollectionIcon(g, diy, sheet, this, collector);

        var icon = String(settings.get('LocationIcon' + suffix, 'None'));
        var front = String(settings.get('LocationIcon', 'None'));
        if (icon !== 'None' && !(front === 'None' && icon === 'Copy front'))
            LocationParts.paintIcon(
                this,
                g,
                diy,
                sheet,
                'LocationIcon',
                suffix,
                true
            );
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintConnections(g, diy, sheet, suffix);

        CollectorInfo.paintArtist(g, diy, sheet, this, boxes.artist);
        if (String(settings.get('Copyright', '')).length > 0)
            CollectorInfo.paintCopyright(g, diy, sheet, this, boxes.copyright);
    }
}

export default LocationBackFace;
