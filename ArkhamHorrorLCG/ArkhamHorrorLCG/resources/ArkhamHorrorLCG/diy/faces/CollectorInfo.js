// The collector line, drawn right to left: collection number and icon, then
// encounter number; the copyright, in its own region; and the encounter icon,
// in the face's own place.
//
// Face settings: CollectionNumber, EncounterNumber, Copyright (-region, boxes),
// CollectionIcon-region, EncounterIcon-region and ReturnEncounterIcon-region.
//
// Module: returns CollectorInfo.
/* global ca */
define(['faces/FaceUtils', 'se/imageutils'], function (FaceUtils, imageutils) {
    const Sides = ['Front', 'Back'];
    const ENCOUNTER_CLIP_KEY = 'AHLCG-Face-Encounter-portrait-clip-region';

    function iconPath(name) {
        return 'ArkhamHorrorLCG/icons/AHLCG-' + name + '.png';
    }

    function inverted(image) {
        return new ca.cgjennings.graphics.filters.InversionFilter().filter(
            image,
            null
        );
    }

    // the region, moved left to end at x if it would otherwise pass it
    function endAt(region, x) {
        if (x - region.width < region.x) region.x = x - region.width;
        return region;
    }

    // Light collector text would vanish on ink saver's white sheet. The sheet
    // can switch modes after its boxes are made, so this is set for each paint.
    function setText(box, sheet, text) {
        box.markupText = sheet.isPrototypeRenderingModeEnabled()
            ? '<color #000000>' + text + '</color>'
            : text;
    }

    // returns the left edge of the number
    function paintCollectionNumber(g, diy, sheet, face, box, suffix, x) {
        var faceIndex = sheet.getSheetIndex();
        var number = String(diy.settings.get('CollectionNumber', ''));
        if (number === '') return x;

        var region = diy.settings.getRegion(
            face.key(diy.settings, 'CollectionNumber-region')
        );
        region.y += parseInt(FaceUtils.plugin().collectionFontOffset);

        if (suffix) {
            let flip = String(diy.settings.get('flipSuffix', '0')) === '1';
            number += (faceIndex === 0) !== flip ? 'a' : 'b';
        }
        setText(box, sheet, number);

        return region.x + region.width - box.drawAsSingleLine(g, region);
    }

    // returns the left edge of the icon
    function paintCollectionIcon(diy, g, sheet, face, portrait, x) {
        var region = endAt(
            diy.settings.getRegion(
                face.key(diy.settings, 'CollectionIcon-region')
            ),
            x
        );
        var icon =
            String(diy.settings.get('CollectionType', '0')) === '0'
                ? imageutils.ImageUtils.get(
                      iconPath(diy.settings.get('Collection'))
                  )
                : portrait.getImage();
        sheet.paintImage(
            g,
            face.invertCollectionIcon ? inverted(icon) : icon,
            region
        );
        return region.x;
    }

    function paintEncounterNumber(g, diy, sheet, face, box, x) {
        var number = String(diy.settings.get('EncounterNumber', ''));
        var total = String(diy.settings.get('EncounterTotal', ''));
        if (number === '' && total === '') return;

        var region = endAt(
            diy.settings.getRegion(
                face.key(diy.settings, 'EncounterNumber-region')
            ),
            x
        );
        region.y += parseInt(FaceUtils.plugin().collectionFontOffset);

        var separator = ' / ';
        if (face.compactEncounterTotal) separator = '/';
        else if (FaceUtils.plugin().OS === 'Mac') separator = '\u200a/\u200a';
        setText(box, sheet, number + separator + total);
        box.drawAsSingleLine(g, region);
    }

    function paintCopyright(g, diy, sheet, face, box) {
        var region = diy.settings.getRegion(
            face.key(diy.settings, 'Copyright-region')
        );
        var o = FaceUtils.plugin();
        region.y += parseInt(o.collectionFontOffset);
        if (String(o.bodyFamily) === 'Times New Roman') region.y -= 1;

        setText(box, sheet, String(diy.settings.get('Copyright', '')));
        box.drawAsSingleLine(g, region);
    }

    function paintEncounterIcon(g, diy, sheet, face, portrait) {
        var settings = diy.settings;
        var name = String(settings.get('Encounter', ''));

        if (name.substring(0, 6) === 'Return') {
            sheet.paintImage(
                g,
                imageutils.ImageUtils.get(iconPath(name)),
                settings.getRegion(
                    face.key(settings, 'ReturnEncounterIcon-region')
                )
            );
            return;
        }

        var region = settings.getRegion(
            face.key(settings, 'EncounterIcon-region')
        );
        if (String(settings.get('EncounterType', '0')) === '0') {
            sheet.paintImage(
                g,
                imageutils.ImageUtils.get(iconPath(name)),
                region
            );
        } else {
            // the portrait applies its scale and pan within its clip region
            settings.setRegion(ENCOUNTER_CLIP_KEY, region);
            portrait.paint(g, sheet.getRenderTarget());
        }
    }

    // collector: { collection, encounter, suffix }, the card's portraits and
    // whether the collection number takes a side suffix
    function paint(g, diy, sheet, face, boxes, collector, encounterIcon) {
        var faceIndex = sheet.getSheetIndex();
        var side = Sides[faceIndex];
        var x = sheet.getTemplateWidth() - 2 * FaceUtils.bleedPixels(sheet);

        if (
            String(diy.settings.get('ShowCollectionNumber' + side, '1')) === '1'
        ) {
            x =
                paintCollectionNumber(
                    g,
                    diy,
                    sheet,
                    face,
                    boxes.collectionNumber,
                    collector.suffix,
                    x
                ) - 3;
            x =
                paintCollectionIcon(
                    diy,
                    g,
                    sheet,
                    face,
                    collector.collection,
                    x
                ) - 11;
        } else x -= 21;

        if (encounterIcon)
            paintEncounterIcon(g, diy, sheet, face, collector.encounter);

        if (
            String(diy.settings.get('ShowEncounterNumber' + side, '1')) === '1'
        ) {
            paintEncounterNumber(g, diy, sheet, face, boxes.encounterNumber, x);
        }

        if (String(diy.settings.get('ShowCopyright' + side, '1')) === '1') {
            paintCopyright(g, diy, sheet, face, boxes.copyright);
        }
    }

    return { paint: paint };
});
