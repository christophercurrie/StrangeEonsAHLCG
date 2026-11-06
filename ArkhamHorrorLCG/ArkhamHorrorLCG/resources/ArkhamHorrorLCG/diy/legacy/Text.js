// Legacy card text: titles, the two line Concealed title, game text and
// single line text such as the Ultimatum subtitle and traits.
//
// Settings: Unique<suffix>, Title<suffix> for a back's own title, and
// <part><suffix> game text with <part><suffix>Spacing; Template chooses a
// Concealed card's NamedDecoy title.
//
// Module: returns { name, twoLineName, body, singleLine }.
define(['faces/FaceUtils', 'se/markup'], function (FaceUtils, markup) {
    const FACE_FRONT = 0;
    // card types whose titles are capitals
    const Capitals = { Guide75: true, GuideA4: true, GuideLetter: true };

    function offsetRegion(diy, key, offset) {
        var region = diy.settings.getRegion(key);
        region.y += parseInt(offset);
        return region;
    }

    // The title, one line to a line of text, starting at <Name-region>, or
    // <NameWithSubtitle-region> for a subtitled Ultimatum. A back shows its
    // own title if it has one, otherwise the card's name.
    function name(card, g, diy, sheet, box) {
        var faceIndex = sheet.getSheetIndex();
        var type = card.type(faceIndex);
        var suffix = card.suffix(faceIndex);
        var unique = card.get('Unique' + suffix);
        if (unique == null) unique = card.get('Unique');

        var title = String(diy.name);
        if (faceIndex !== FACE_FRONT) {
            let own = card.get('Title' + suffix);
            if (own != null) title = own;
        }
        if (title.length === 0) return;
        if (unique === '1') title = '<uni>' + title;
        if (Capitals[type]) title = title.toUpperCase();

        var key = card.key(faceIndex, 'Name-region');
        if (type === 'Ultimatum' && card.get('Subtitle').length > 0)
            key = card.key(faceIndex, 'NameWithSubtitle-region');
        var region = offsetRegion(diy, key, FaceUtils.plugin().titleFontOffset);

        title.split('\n').forEach(function (line) {
            box.markupText = line;
            box.drawAsSingleLine(g, region);
            region.y += 16;
            region.height -= 16;
        });
    }

    // A Concealed title: of two lines, the first at the top of
    // <Name-region> and the second at its bottom; one line is centered. A
    // NamedDecoy uses its own style and region, with a smaller second line
    // in parentheses.
    function twoLineName(card, g, diy, sheet, box) {
        var faceIndex = sheet.getSheetIndex();
        var title = String(diy.name);
        var decoy = card.get('Template') === 'NamedDecoy';

        if (decoy) {
            box = markup.markupBox(sheet);
            box.defaultStyle = diy.settings.getTextStyle(
                card.key(FACE_FRONT, 'DecoyName-style'),
                null
            );
            box.alignment = diy.settings.getTextAlignment(
                card.key(FACE_FRONT, 'DecoyName-alignment')
            );
        }
        // clearing first applies a style change at once
        box.markupText = '';
        if (title.length === 0) return;

        var region = offsetRegion(
            diy,
            decoy
                ? 'AHLCG-Concealed-DecoyName-region'
                : card.key(faceIndex, 'Name-region'),
            FaceUtils.plugin().titleFontOffset
        );
        var unique = card.get('Unique' + card.suffix(faceIndex)) === '1';
        box.markupText = unique ? '<uni>' + title : title;

        var lines = title.split('\n');
        if (lines.length > 1) {
            box.markupText = lines[0];
            box.alignment = markup.LAYOUT_TOP | markup.LAYOUT_CENTER;
            box.drawAsSingleLine(g, region);
            if (decoy && lines[1][0] === '(') {
                box.markupText = '<size 85%>' + lines[1];
                region.height -= 5;
            } else box.markupText = lines[1];
            box.alignment = markup.LAYOUT_BOTTOM | markup.LAYOUT_CENTER;
            box.drawAsSingleLine(g, region);
            return;
        }
        region.y -= decoy ? 4 : 9;
        box.markupText = lines[0];
        box.alignment = markup.LAYOUT_MIDDLE | markup.LAYOUT_CENTER;
        box.drawAsSingleLine(g, region);
    }

    // the parts' game text in <Body-region>, scaled to fit
    function body(card, g, diy, sheet, box, parts) {
        var faceIndex = sheet.getSheetIndex();
        var o = FaceUtils.plugin();
        var region = offsetRegion(
            diy,
            card.key(faceIndex, 'Body-region'),
            o.bodyFontOffset
        );

        box.setReplacementForTag('fullnameb', card.settings.get('TitleBack'));
        box.setLineTightness(
            Number(
                card.get(
                    card.key(faceIndex, 'Body', '-tightness') + '-tightness'
                )
            ) * o.bodyFontTightness
        );
        box.setTextFitting(markup.FIT_SCALE_TEXT);
        box.markupText = FaceUtils.partsMarkup(
            diy.settings,
            parts,
            card.suffix(faceIndex)
        );
        markup.updateNameTags(box, diy);
        box.draw(g, region);
    }

    // text on one line in the face's <name>-region
    function singleLine(card, g, diy, sheet, box, name, text) {
        box.markupText = text;
        box.drawAsSingleLine(
            g,
            diy.settings.getRegion(
                card.key(sheet.getSheetIndex(), name + '-region')
            )
        );
    }

    return {
        name: name,
        twoLineName: twoLineName,
        body: body,
        singleLine: singleLine,
    };
});
