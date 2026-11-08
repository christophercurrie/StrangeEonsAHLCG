// A legacy card's collector line, drawn right to left: collection number and
// icon, encounter number, copyright and artist; and its encounter icon and
// watermark.
//
// Settings: Collection, CollectionType, CollectionNumber[<suffix>];
// Encounter, EncounterType, EncounterNumber[<suffix>] and
// EncounterTotal[<suffix>]; Copyright; Artist<suffix>, or Artist when the
// portrait is shared. A set type of 0 is the plug-in's; others use the
// card's Collection or Encounter portrait.
//
// Module: returns { paint, paintArtist, paintEncounterIcon, paintWatermark }.
import FaceUtils from '../faces/FaceUtils.mjs';
import ImageFilters from './ImageFilters.mjs';
import imageutils from '../se/imageutils.mjs';
import Java from '../se/java.mjs';
import strings from '../se/strings.mjs';

const AlphaComposite = Java.type('java.awt.AlphaComposite');

function icon(name) {
    return imageutils.ImageUtils.get(
        'ArkhamHorrorLCG/icons/AHLCG-' + name + '.png'
    );
}

function offsetRegion(diy, key) {
    var region = diy.settings.getRegion(key);
    region.y += parseInt(FaceUtils.plugin().collectionFontOffset);
    return region;
}

// a region moved left, if need be, to end at x
function leftOf(region, x) {
    if (x - region.width < region.x) region.x = x - region.width;
    return region;
}

// a side's value, or the card's
function sideValue(card, key, faceIndex) {
    var value = card.settings.get(key + card.suffix(faceIndex));
    return value == null ? card.settings.get(key) : value;
}

function paintArtist(card, g, diy, sheet, box, forceFrontValue) {
    var faceIndex = sheet.getSheetIndex();
    var valueIndex = forceFrontValue ? 0 : faceIndex;
    var artist = String(card.settings.get('Artist' + card.suffix(valueIndex)));
    if (artist === '' && card.get('PortraitShare') === '1')
        artist = String(card.settings.get('Artist'));
    if (artist.length === 0) return;

    box.markupText = strings.gstring('AHLCG-IllustratorShort') + ' ' + artist;
    box.drawAsSingleLine(
        g,
        offsetRegion(diy, card.key(faceIndex, 'Artist-region'))
    );
}

function paintCopyright(card, g, diy, sheet, box) {
    var region = offsetRegion(
        diy,
        card.key(sheet.getSheetIndex(), 'Copyright-region')
    );
    if (FaceUtils.plugin().bodyFamily === 'Times New Roman') region.y -= 1;
    // appending applies a style change
    box.markupText = '';
    box.markupText += card.settings.get('Copyright');
    box.drawAsSingleLine(g, region);
}

// the left edge of the number, or undefined if it is blank
function paintCollectionNumber(card, g, diy, sheet, box) {
    var faceIndex = sheet.getSheetIndex();
    var number = sideValue(card, 'CollectionNumber', faceIndex);
    if (number != null && String(number) === '') return undefined;

    var region = offsetRegion(
        diy,
        card.key(faceIndex, 'CollectionNumber-region')
    );
    box.markupText = number;
    var width = box.drawAsSingleLine(g, region);
    return region.x + region.width - width;
}

// the collection icon, inverted, ending at x; returns its left edge
function paintCollectionIcon(card, g, diy, sheet, x) {
    var faceIndex = sheet.getSheetIndex();
    var region = leftOf(
        diy.settings.getRegion(
            card.key(faceIndex, 'DefaultCollection-portrait-clip-region'),
            diy.settings.getRegion(
                card.key(faceIndex, 'Collection-portrait-clip-region')
            )
        ),
        x
    );
    var image =
        card.get('CollectionType') === '0'
            ? icon(card.get('Collection'))
            : card.portrait('Collection').getImage();
    sheet.paintImage(g, ImageFilters.inverted(image), region);
    return region.x;
}

// the encounter number and total ending at x
function paintEncounterNumber(card, g, diy, sheet, box, x) {
    var faceIndex = sheet.getSheetIndex();
    var number = sideValue(card, 'EncounterNumber', faceIndex);
    var total = sideValue(card, 'EncounterTotal', faceIndex);
    if (String(number) === '' && String(total) === '') return;

    var region = leftOf(
        offsetRegion(diy, card.key(faceIndex, 'EncounterNumber-region')),
        x
    );
    var separator = FaceUtils.plugin().OS === 'Mac' ? ' / ' : ' / ';
    // appending applies a style change
    box.markupText = number;
    box.markupText += separator + total;
    box.drawAsSingleLine(g, region);
}

// The encounter icon at its clip region, or the Return to version's.
// A custom icon is the card's Encounter portrait, painted at the region
// so its editor placement applies; an Ultimatum inverts the plug-in's.
function paintEncounterIcon(card, g, diy, sheet) {
    var faceIndex = sheet.getSheetIndex();
    var name = card.get('Encounter');
    var portraitKey =
        'AHLCG-' + card.type(0) + '-Encounter-portrait-clip-region';

    // icon locations differ by card type, so start from the default
    diy.settings.reset(portraitKey);
    diy.settings.reset(
        'AHLCG-' + card.type(0) + '-ReturnEncounter-portrait-clip-region'
    );

    function clip(kind) {
        return diy.settings.getRegion(
            card.key(faceIndex, 'Default' + kind + '-portrait-clip-region'),
            diy.settings.getRegion(
                card.key(faceIndex, kind + '-portrait-clip-region')
            )
        );
    }

    if (name.substring(0, 6) === 'Return') {
        sheet.paintImage(g, icon(name), clip('ReturnEncounter'));
        return;
    }
    var region = clip('Encounter');
    if (card.get('EncounterType') === '0') {
        let image = icon(name);
        if (card.type(faceIndex) === 'Ultimatum')
            image = ImageFilters.inverted(image);
        sheet.paintImage(g, image, region);
        return;
    }
    diy.settings.setRegion(portraitKey, region);
    card.portrait('Encounter').paint(g, sheet.getRenderTarget());
}

// the encounter icon, faint, filling its watermark region; leaves g's
// composite faint
function paintWatermark(card, g, diy, sheet) {
    var region = diy.settings.getRegion(
        card.key(sheet.getSheetIndex(), 'Watermark-portrait-clip-region')
    );
    var image =
        card.get('EncounterType') === '0'
            ? icon(card.get('Encounter'))
            : card.portrait('Encounter').getImage();
    var sized = imageutils.ImageUtils.resize(
        image,
        region.width,
        region.height
    );
    g.setComposite(AlphaComposite.SrcOver.derive(0.06));
    g.drawImage(sized, region.x, region.y, null);
}

// The collector line from the boxes given; a null box or false icon
// flag leaves that part out.
function paint(
    card,
    g,
    diy,
    sheet,
    collectionBox,
    collectionIcon,
    encounterBox,
    encounterIcon,
    copyrightBox,
    artistBox
) {
    var faceIndex = sheet.getSheetIndex();
    function style(box, name) {
        if (box)
            box.defaultStyle = diy.settings.getTextStyle(
                card.key(faceIndex, name + '-style'),
                null
            );
    }
    style(collectionBox, 'CollectionNumber');
    style(encounterBox, 'EncounterNumber');
    style(copyrightBox, 'Copyright');
    // the card type can change after the box is created
    if (copyrightBox)
        copyrightBox.alignment = diy.settings.getTextAlignment(
            card.key(faceIndex, 'Copyright-alignment')
        );

    var x = sheet.getTemplateWidth() - 2 * FaceUtils.bleedPixels(sheet);
    if (collectionBox)
        x = paintCollectionNumber(card, g, diy, sheet, collectionBox) - 3;
    if (collectionIcon) x = paintCollectionIcon(card, g, diy, sheet, x) - 11;
    else x -= 21;
    if (encounterIcon) paintEncounterIcon(card, g, diy, sheet);
    if (encounterBox)
        paintEncounterNumber(card, g, diy, sheet, encounterBox, x);
    if (copyrightBox) paintCopyright(card, g, diy, sheet, copyrightBox);
    if (artistBox) paintArtist(card, g, diy, sheet, artistBox, false);
}

export default {
    paint: paint,
    paintArtist: paintArtist,
    paintEncounterIcon: paintEncounterIcon,
    paintWatermark: paintWatermark,
};
