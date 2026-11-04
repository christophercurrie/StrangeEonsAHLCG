// Drawing shared by act and agenda faces: the reversed orientation, which
// mirrors a front left to right, the two line title, the scenario index on
// each side and a back's title, which runs up its side.
//
// Settings: Orientation<suffix> is Standard or Reversed; $ScenarioIndex and
// $ScenarioDeckID are the card's, as legacy cards save them.
//
// Module: returns ActAgenda.
define([
    'faces/FaceUtils',
    'faces/PlayerCard',
    'se/common',
    'se/imageutils',
    'se/java',
    'se/markup',
], function (FaceUtils, PlayerCard, common, imageutils, Java, Layout) {
    const Color = Java.type('java.awt.Color');
    const Font = Java.type('java.awt.Font');
    const Light = new Color(0.996, 0.945, 0.859);
    const Dark = new Color(0, 0, 0);
    // the width of a landscape card's trim, in template pixels
    const Width = 525;

    function isReversed(face, diy, faceIndex) {
        return (
            String(
                diy.settings.get('Orientation' + face.suffix(faceIndex), '')
            ) === 'Reversed'
        );
    }

    // region mirrored left to right
    function reverse(region) {
        region.x = Width - (region.x + region.width);
        return region;
    }

    // the points of a shape mirrored left to right
    function reversePoints(xs) {
        return xs.map(function (x) {
            return 1.0 - x;
        });
    }

    // the face's template image, mirrored; a high resolution render uses the
    // <key>-hires image
    function paintMirroredTemplate(g, diy, sheet, key) {
        var ImageUtils = imageutils.ImageUtils;
        var image = ImageUtils.get(diy.settings.get(key));
        var hires = sheet.isHighResolutionRendering()
            ? diy.settings.get(key + '-hires')
            : null;
        var source = ImageUtils.mirror(
            hires != null ? ImageUtils.get(hires) : image,
            true,
            false
        );
        sheet.paintImage(
            g,
            source,
            new common.Region(0, 0, image.getWidth(), image.getHeight())
        );
    }

    // A one line title centered in <Name-region>; of two lines, the first at
    // its top and the second at its bottom.
    function paintName(face, g, diy, sheet, box, reversed) {
        var faceIndex = sheet.getSheetIndex();
        var title = face.getTitle(diy, faceIndex);
        box.markupText = '';
        if (title.length === 0) return;

        var region = diy.settings.getRegion(
            face.key(diy.settings, 'Name-region')
        );
        region.y += parseInt(FaceUtils.plugin().titleFontOffset);
        if (reversed) reverse(region);

        var lines = title.split('\n');
        if (lines.length > 1) {
            box.markupText = lines[0];
            box.alignment = Layout.LAYOUT_TOP | Layout.LAYOUT_CENTER;
            box.drawAsSingleLine(g, region);
            box.markupText = lines[1];
            box.alignment = Layout.LAYOUT_BOTTOM | Layout.LAYOUT_CENTER;
            box.drawAsSingleLine(g, region);
        } else {
            region.y += 1;
            box.markupText = lines[0];
            box.alignment = Layout.LAYOUT_MIDDLE | Layout.LAYOUT_CENTER;
            box.drawAsSingleLine(g, region);
        }
    }

    function index(diy) {
        return String(diy.settings.get('ScenarioIndex', ''));
    }

    function deckId(diy) {
        return String(diy.settings.get('ScenarioDeckID', 'a'));
    }

    // the type and index, such as Act 1a
    function paintIndexFront(face, g, diy, sheet, box, label, reversed) {
        var region = diy.settings.getRegion(
            face.key(diy.settings, 'ScenarioIndex-region')
        );
        region.y += parseInt(FaceUtils.plugin().typeFontOffset);
        if (reversed) {
            reverse(region);
            region.x -= 1;
        }
        box.markupText = label + ' <suf>' + index(diy) + deckId(diy) + '</suf>';
        box.drawAsSingleLine(g, region);
    }

    // the type and the index of the other side, such as ACT 1b; on two
    // lines if it doesn't fit on one
    function paintIndexBack(face, g, diy, sheet, box, label) {
        var region = diy.settings.getRegion(
            face.key(diy.settings, 'BackScenarioIndex-region')
        );
        region.y += parseInt(FaceUtils.plugin().typeFontOffset);
        var type = label.toUpperCase();
        var id = String.fromCharCode(deckId(diy).charCodeAt(0) + 1);
        var text = type + ' <sufb>' + index(diy) + id + '</sufb>';

        box.markupText = '';
        box.markupText = text;
        var height = box.measure(g, region);
        box.markupText = '';
        if (height < 15) {
            box.markupText = text;
            box.drawAsSingleLine(g, region);
            return;
        }
        var lineHeight = region.height / 2;
        region.height -= lineHeight;
        box.markupText = type;
        box.drawAsSingleLine(g, region);
        region.y += lineHeight;
        box.markupText = '<size 90%><sufb>' + index(diy) + id + '</sufb>';
        box.drawAsSingleLine(g, region);
    }

    // a back's title, turned to run up <Name-region> unless the user turned
    // that off, when it runs down it a letter a line
    function paintBackName(face, g, diy, sheet, box) {
        var title = face.getTitle(diy, sheet.getSheetIndex());
        var region = diy.settings.getRegion(
            face.key(diy.settings, 'Name-region')
        );
        var rotate = common.Settings.getUser().getBoolean(
            'AHLCG-DefaultRotateTitle',
            true
        );
        if (rotate) {
            box.markupText = title;
            let transform = g.getTransform();
            g.rotate(-Math.PI / 2, 0, 0);
            let turned = region.clone();
            turned.setRect(
                -region.getHeight() - region.getY(),
                region.getX(),
                region.getHeight(),
                region.getWidth()
            );
            box.draw(g, turned);
            g.setTransform(transform);
        } else if (title.length > 0) {
            box.markupText = title.split('').join('<br>');
            box.draw(g, region);
        }
    }

    // Doom, light on dark: a dash, a per investigator value, or a value with
    // an asterisk.
    function paintDoom(face, g, diy, sheet, suffix, reversed) {
        var o = FaceUtils.plugin();
        var settings = diy.settings;
        var doom = String(settings.get('Doom' + suffix, ''));
        var perInvestigator =
            String(settings.get('PerInvestigator' + suffix)) === '1';
        var asterisk = String(settings.get('Asterisk' + suffix)) === '1';
        function region(name) {
            var r = settings.getRegion(face.key(settings, name + '-region'));
            return reversed ? reverse(r) : r;
        }
        function title(text, r, font, size) {
            sheet.drawOutlinedTitle(
                g,
                text,
                r,
                font,
                size,
                0.8,
                Light,
                Dark,
                0,
                true
            );
        }
        var r = region('Doom');

        if (doom === '-') {
            PlayerCard.paintDash(face, g, diy, sheet, r, 0, 6);
        } else if (perInvestigator) {
            let value = region('DoomPerInv');
            let icon = region('DoomPerInvIcon');
            if (reversed) {
                value.x = r.x + (r.x + r.width - (value.x + value.width));
                icon.x = r.x + (r.x + r.width - (icon.x + icon.width));
            }
            let size = 14.0;
            let iconSize = 6.5;
            if (doom.length > 1) {
                value.x -= 1;
                icon.x += 1;
                size = 11.0;
                iconSize = 6.0;
            }
            if (doom === 'Star') {
                value.x += 1;
                value.y += 2;
                icon.x -= 3;
                title('*', value, o.chaosFont, 12.0);
            } else title(doom, value, o.enemyFont, size);
            title('p', icon, o.symbolFont, iconSize);
        } else if (asterisk) {
            let size = 14.0;
            let dx = 7;
            let dy = 7;
            if (doom === 'Star') dx = 4;
            else if (doom.length > 1) {
                r.x -= 1;
                size = 13.0;
            }
            r.x -= 4;
            if (doom === 'Star') {
                r.y += 2;
                title('*', r, o.chaosFont, 12.0);
            } else title(doom, r, o.enemyFont, size);
            let font = new Font(o.bodyFamily, Font.ITALIC, 12.0);
            r.x += dx;
            r.y += dy;
            r.x +=
                doom === 'Star' ? 6 : g.getFontMetrics(font).stringWidth(doom);
            title('*', r, font, 12.0);
        } else if (doom === 'Star') {
            r.y += 2;
            title('*', r, o.chaosFont, 12.0);
        } else {
            if (reversed) r.x -= 1;
            title(doom, r, o.enemyFont, 14.0);
        }
    }

    // the act and agenda index styles, <suf> and <sufb>
    function initSuffixTags(diy, box) {
        FaceUtils.plugin().SuffixTagList.forEach(function (item) {
            box.setStyleForTag(
                diy.settings.get(item + '-tag'),
                diy.settings.getTextStyle(item + '-style', null)
            );
        });
    }

    return {
        isReversed: isReversed,
        reverse: reverse,
        reversePoints: reversePoints,
        paintMirroredTemplate: paintMirroredTemplate,
        paintName: paintName,
        paintIndexFront: paintIndexFront,
        paintIndexBack: paintIndexBack,
        paintDoom: paintDoom,
        paintBackName: paintBackName,
        initSuffixTags: initSuffixTags,
    };
});
