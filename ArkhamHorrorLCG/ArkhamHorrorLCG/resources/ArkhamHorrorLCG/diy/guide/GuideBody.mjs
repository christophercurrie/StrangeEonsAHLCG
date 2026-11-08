// A campaign guide column's text: plain text, <section> and <header> titles
// with their rules, and boxes, drawn top to bottom in the column's region.
//
// Markup: <section [color=RRGGBB]> and <header [color=RRGGBB]> end at their
// closing tags. Boxes are <boxres> resolutions, <boxsa> standalone notes,
// <boxkey> keys, <boxint> interludes and <boxfla> flashbacks (an interlude
// colored 0.630, 0.48, 0.48); [header] adds a box's title,
// [bracket] its bracket, and [color=H,S,B] tints it.
//
// Module: returns { paint }.
import FaceUtils from '../faces/FaceUtils.mjs';
import common from '../se/common.mjs';
import imageutils from '../se/imageutils.mjs';
import Java from '../se/java.mjs';
import strings from '../se/strings.mjs';

const BasicStroke = Java.type('java.awt.BasicStroke');
const Color = Java.type('java.awt.Color');
const TextAttribute = Java.type('java.awt.font.TextAttribute');
const Region2D = Java.type('resources.Settings$Region2D');
const CompoundShape = Java.type('ca.cgjennings.layout.PageShape$CompoundShape');
const CupShape = Java.type('ca.cgjennings.layout.PageShape$CupShape');
const InsetShape = Java.type('ca.cgjennings.layout.PageShape$InsetShape');
const FACE_FRONT = 0;
const Start =
    /<(?:section|header)(?:\s+colou?r\s*=\s*[A-Fa-f0-9.]{6})*>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/;
const HexColor = /colou?r\s*=\s*([A-Fa-f0-9.]{6})/;
const HsbColor = /colou?r\s*=\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/;
const Teal = '415a55';

function overlay(name) {
    return imageutils.ImageUtils.get(
        'ArkhamHorrorLCG/overlays/AHLCG-' + name + '.png'
    );
}

function rule(g, color, x1, x2, y, gap) {
    g.setPaint(color);
    g.setStroke(new BasicStroke(1.0));
    g.drawLine(x1, y, x2, y);
    g.drawLine(x1, y + gap, x2, y + gap);
}

function paint(
    card,
    g,
    diy,
    sheet,
    bodyBox,
    headerBox,
    bodyRegion,
    text,
    spacing
) {
    var o = FaceUtils.plugin();
    var settings = diy.settings;
    var guide75 = card.type(0) === 'Guide75';
    function tightness(name) {
        return Number(
            card.get(card.key(FACE_FRONT, name, '-tightness') + '-tightness')
        );
    }
    function style(name) {
        return settings.getTextStyle(
            card.key(FACE_FRONT, name + '-style'),
            null
        );
    }
    var bodyTightness = tightness('Body');
    var sectionTightness = tightness('BodySection');

    if (isNaN(spacing)) spacing = 100;
    var factor = (o.bodyFontTightness * 1.2 * spacing) / 100.0;
    if (o.bodyFamily === 'Times New Roman') {
        factor = factor * 0.98;
        let bodyStyle = bodyBox.getDefaultStyle();
        bodyStyle.add(TextAttribute.WIDTH, 0.96);
        bodyStyle.add(TextAttribute.TRACKING, -0.01);
        bodyBox.setDefaultStyle(bodyStyle);
    }
    bodyRegion.y += parseInt(o.bodyFontOffset);
    text = String(text);

    // draws text before a special part, moving the region below it
    function before(prefix, end) {
        if (/\S/.test(prefix)) prefix = prefix + end;
        bodyBox.markupText = prefix;
        bodyBox.setLineTightness(bodyTightness * factor);
        let height = bodyBox.measure(g, bodyRegion);
        bodyBox.draw(g, bodyRegion);
        bodyBox.markupText = '';
        bodyRegion.y += height;
        bodyRegion.height -= height;
    }

    // a section or header and its text; returns the text after it
    function titled(start, tag) {
        var colorMatch = HexColor.exec(start[0]);
        var close = '</' + tag + '>';
        var endMatch = new RegExp('<\\/' + tag + '>').exec(text);
        if (start.index > 0) before(text.slice(0, start.index), '<lvs>');

        var special;
        var rest = '';
        if (endMatch) {
            special = text.slice(start.index, endMatch.index + close.length);
            rest = text.slice(endMatch.index + close.length);
        } else special = text.slice(start.index);

        if (tag === 'header') {
            bodyRegion.y += 8;
            bodyRegion.height -= 8;
        }
        var open = '<' + tag + '>';
        special = special.replace(new RegExp('<' + tag + '.*?>'), open);
        special = special.replace(
            open,
            open + '<color ' + (colorMatch ? colorMatch[1] : Teal) + '>'
        );
        if (tag === 'section')
            special = special.replace(/<\section>/, '<color><section>');
        else special = special.replace(open, '<color>' + open);

        bodyBox.markupText = special;
        bodyBox.setLineTightness(sectionTightness * factor);
        var height = bodyBox.measure(g, bodyRegion);
        bodyBox.draw(g, bodyRegion);
        bodyBox.markupText = '';

        if (tag === 'section') {
            let color;
            if (colorMatch) {
                let hex = colorMatch[1].match(/.{1,2}/g);
                color = new Color(
                    parseInt(hex[0], 16) / 256.0,
                    parseInt(hex[1], 16) / 256.0,
                    parseInt(hex[2], 16) / 256.0
                );
            } else color = new Color(0.255, 0.353, 0.333);
            rule(
                g,
                color,
                bodyRegion.x,
                bodyRegion.x + bodyRegion.width + 2,
                bodyRegion.y + height - 1,
                4
            );
            bodyRegion.y += height - 4;
            bodyRegion.height -= height - 4;
        } else {
            bodyRegion.y += height - 12;
            bodyRegion.height -= height - 12;
        }
        bodyBox.setLineTightness(bodyTightness * factor);
        return rest;
    }

    // a box's top, middle and bottom images
    function boxImages(kind, colorMatch, interlude, bracket, endMatch) {
        var images = {};
        if (colorMatch != null) {
            let h = parseFloat(colorMatch[1]);
            let s = parseFloat(colorMatch[2]);
            let b = parseFloat(colorMatch[3]);
            let b2 = b;
            if (!interlude) {
                b2 += 0.3;
                if (b2 > 1.0) b2 = 1.0;
            }
            let tcBox;
            let tcMid;
            let tcBracket = null;
            if (interlude) {
                tcBox = o.getIntBoxTint();
                tcMid = o.getIntMidTint();
            } else if (bracket) {
                tcBox = o.getResBoxTint();
                tcBracket = o.getBracketTint();
                tcMid = o.getResMidTint();
            } else {
                tcBox = o.getResBoxTint();
                tcMid = o.getResMidTint();
                if (endMatch) tcBracket = o.getBracketTint();
            }
            tcBox.setFactors(h, s, b2);
            images.top = tcBox.getTintedImage();
            images.bottom = images.top;
            tcMid.setFactors(h, s, b2);
            images.middle = tcMid.getTintedImage();
            if (tcBracket) tcBracket.setFactors(h, s, b);
            if (bracket) images.topBracket = tcBracket.getTintedImage();
            if (!interlude && endMatch)
                images.bottomBracket = tcBracket.getTintedImage();
            return images;
        }
        images.top = overlay(
            'Box' + kind + (bracket && !interlude ? 'Bracket' : '')
        );
        if (interlude) images.bottom = images.top;
        else if (endMatch) images.bottom = overlay('Box' + kind + 'Bracket');
        else images.bottom = overlay('Box' + kind);
        images.middle = overlay('Box' + kind + 'Line');
        return images;
    }

    // a box's title, with rules beneath it
    function boxHeader(res, sa) {
        if (res) {
            let headerRegion = new Region2D(
                bodyRegion.x,
                bodyRegion.y,
                bodyRegion.width,
                bodyRegion.height
            );
            headerBox.defaultStyle = style('ResHeader');
            headerBox.markupText = strings.gstring('AHLCG-Scenario-Header1');
            let height = headerBox.measure(g, headerRegion);
            let width1 = headerBox.drawAsSingleLine(g, headerRegion) + 4.0;
            headerRegion.y += height;
            headerBox.markupText =
                '<size 80%>' +
                strings.gstring('AHLCG-Scenario-Header2') +
                '<size 125%>';
            height += headerBox.measure(g, headerRegion);
            let width2 = headerBox.drawAsSingleLine(g, headerRegion) + 4.0;
            let width = Math.max(width1, width2);
            let x = headerRegion.x + (headerRegion.width - width) / 2;
            rule(
                g,
                new Color(0.388, 0.145, 0.114),
                x,
                x + width,
                bodyRegion.y + height,
                5
            );
            return;
        }
        headerBox.defaultStyle = style(sa ? 'SAHeader' : 'KeyHeader');
        headerBox.markupText =
            '<size 90%>' +
            strings.gstring(
                sa ? 'AHLCG-Guide-Standalone' : 'AHLCG-Guide-Keys'
            ) +
            '<size 111%>';
        var height = headerBox.measure(g, bodyRegion);
        var width = headerBox.drawAsSingleLine(g, bodyRegion) + 4.0;
        rule(
            g,
            sa
                ? new Color(0.176, 0.357, 0.345)
                : new Color(0.494, 0.024, 0.027),
            bodyRegion.x + (bodyRegion.width - width) / 2,
            bodyRegion.x + (bodyRegion.width + width) / 2,
            bodyRegion.y + height - 2,
            5
        );
    }

    // the cup shaped outline of an interlude's text, narrowed or widened
    // so the text needs as few lines as it can
    function interludeShape(textRegion, sectionHeight) {
        var inset = 24;
        function shape() {
            bodyBox.setPageShape(
                new CompoundShape(
                    new CupShape(24, 24, bodyRegion.y + 12, 0, 0),
                    bodyRegion.y + sectionHeight - 12,
                    new InsetShape(inset, inset)
                )
            );
            textRegion.height = sectionHeight + 2;
            return bodyBox.measure(g, textRegion);
        }
        // the cup may push the text down a line
        var measured = shape();
        while (measured > sectionHeight) {
            sectionHeight = measured;
            measured = shape();
        }
        // if it fits without the indents, shrink them
        if (measured < sectionHeight) {
            sectionHeight = measured;
            do {
                inset -= 4;
                measured = shape();
            } while (measured > sectionHeight && inset > 0);
        }
        sectionHeight = measured;
        if (sectionHeight < 60) sectionHeight = 60;
        shape();
        return sectionHeight;
    }

    // a box and its text; returns the text after it
    function box(start) {
        var colorMatch = HsbColor.exec(start[0]);
        var res = /boxres/.test(start[0]);
        var sa = /boxsa/.test(start[0]);
        var keybox = /boxkey/.test(start[0]);
        var interlude = /boxint/.test(start[0]);
        var flashback = /boxfla/.test(start[0]);
        var header = /\sheader/.test(start[0]);
        var bracket = /\sbracket/.test(start[0]);
        var endMatch = null;

        if (flashback) {
            if (colorMatch == null)
                colorMatch = ['color', '0.630', '0.48', '0.48'];
            interlude = true;
        }
        if (keybox && colorMatch == null)
            colorMatch = ['color', '0.000', '0.97', '0.55'];

        if (res) endMatch = /<\/boxres>/.exec(text);
        else if (sa) endMatch = /<\/boxsa>/.exec(text);
        else if (keybox) endMatch = /<\/boxkey>/.exec(text);
        else if (flashback) endMatch = /<\/boxfla>/.exec(text);
        else if (interlude) endMatch = /<\/boxint>/.exec(text);
        if (interlude) {
            header = false;
            bracket = false;
        }

        if (start.index > 0) before(text.slice(0, start.index), '<br>');

        var special;
        var rest = '';
        if (endMatch) {
            let len = endMatch[0].length;
            special = text.slice(start.index, endMatch.index + len);
            rest = text.slice(endMatch.index + len);
        } else special = text.slice(start.index);

        var headerHeight = header ? (res ? 80 : 47) : 0;
        var boxRegion = guide75
            ? new common.Region(
                  bodyRegion.x - 22,
                  bodyRegion.y,
                  bodyRegion.width + 30,
                  bodyRegion.height
              )
            : new common.Region(
                  bodyRegion.x - 15,
                  bodyRegion.y,
                  bodyRegion.width + 30,
                  bodyRegion.height
              );
        if (interlude) {
            boxRegion.x += 5;
            boxRegion.width -= 7;
            bodyRegion.y += 5;
            bodyRegion.height -= 10;
        }

        // space before the header or first text
        bodyRegion.x += guide75 ? 16 : 24;
        bodyRegion.width -= 48;
        bodyRegion.y += header ? 29 : 27;
        bodyRegion.height -= header ? 29 : 27;

        var textRegion = new common.Region(bodyRegion);
        if (interlude) textRegion.width += 5;

        bodyBox.markupText = special;
        bodyBox.setLineTightness(bodyTightness * factor);
        var sectionHeight = bodyBox.measure(g, textRegion);
        if (interlude)
            sectionHeight = interludeShape(textRegion, sectionHeight);

        var kind = res ? 'Res' : interlude ? 'Int' : 'SA';
        var images = boxImages(kind, colorMatch, interlude, bracket, endMatch);
        var ratio = images.top.height / images.top.width;
        var topHeight = Math.round(boxRegion.width * ratio);
        var rSectionHeight = Math.round(sectionHeight);
        var rHeaderHeight = Math.round(headerHeight);
        var top = new common.Region(
            boxRegion.x,
            boxRegion.y,
            boxRegion.width,
            topHeight
        );
        sheet.paintImage(g, images.top, top);
        if (images.topBracket) sheet.paintImage(g, images.topBracket, top);
        boxRegion.y += topHeight;
        boxRegion.height -= topHeight;

        var minHeight = interlude ? 60 : 84;
        if (rSectionHeight + rHeaderHeight > minHeight)
            sheet.paintImage(
                g,
                images.middle,
                new common.Region(
                    boxRegion.x,
                    boxRegion.y,
                    boxRegion.width,
                    rSectionHeight + rHeaderHeight - minHeight
                )
            );
        if (rSectionHeight + rHeaderHeight < minHeight)
            rSectionHeight = minHeight - rHeaderHeight;
        boxRegion.y += rSectionHeight + rHeaderHeight;
        boxRegion.height -= rSectionHeight + rHeaderHeight;

        var bottom = new common.Region(
            boxRegion.x,
            boxRegion.y - minHeight,
            boxRegion.width,
            topHeight
        );
        var ImageUtils = imageutils.ImageUtils;
        sheet.paintImage(
            g,
            ImageUtils.mirror(images.bottom, false, true),
            bottom
        );
        if (images.bottomBracket)
            sheet.paintImage(
                g,
                ImageUtils.mirror(images.bottomBracket, false, true),
                bottom
            );

        if (header) {
            boxHeader(res, sa);
            bodyRegion.y += headerHeight;
            bodyRegion.height -= headerHeight;
        }

        textRegion.y = bodyRegion.y;
        textRegion.height = bodyRegion.height;
        bodyBox.setStyleForTag(
            'boxbullet',
            style(res ? 'ResBullet' : 'SABullet')
        );
        bodyBox.setLineTightness(bodyTightness * factor);
        bodyBox.draw(g, textRegion);
        bodyBox.markupText = '';

        bodyRegion.x -= 24;
        bodyRegion.width += 48;
        bodyRegion.y += sectionHeight + 55;
        bodyRegion.height -= sectionHeight + 55;
        bodyBox.setPageShape(null);
        return rest;
    }

    while (text.length > 0) {
        let start = Start.exec(text);
        if (!start) {
            bodyBox.markupText = text;
            bodyBox.setLineTightness(bodyTightness * factor);
            bodyBox.draw(g, bodyRegion);
            bodyBox.markupText = '';
            text = '';
            continue;
        }
        let tag = /<([a-zA-Z]+)/.exec(start[0])[1];
        if (tag === 'section' || tag === 'header') text = titled(start, tag);
        else text = box(start);
    }
}

export default { paint: paint };
