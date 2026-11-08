// The chaos template: a title with an encounter icon frame over game text
// blocks, which can include intro text and chaos token blocks. A full page has
// no title or frame, and gives their space to the text.
//
// Module: returns TokenRulesFace.
import FaceUtils from './FaceUtils.mjs';
import TextBlocks from './TextBlocks.mjs';
import TextBlocksFace from './TextBlocksFace.mjs';
import markup from '../se/markup.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';
import Java from '../se/java.mjs';

const BasicStroke = Java.type('java.awt.BasicStroke');
const Color = Java.type('java.awt.Color');
const ListItem = Java.type('ca.cgjennings.apps.arkham.diy.ListItem');
const Difficulties = ['None', 'Front', 'Back', 'Unique'];
// space a difficulty line and a second title line take from the text
const DifficultyHeight = 29;
const SecondLineHeight = 24;

class TokenRulesFace extends TextBlocksFace {
    template = 'AHLCG-TokenRulesFace';
    usesTemplateReplacement = true;
    blockStyles = TextBlocks.Styles.concat(['intro', 'token']);

    setDefaults(diy, faceIndex, keep) {
        super.setDefaults(diy, faceIndex, keep);
        this.setValues(diy, faceIndex, keep, {
            BlockTokens1: '',
            ChaosFull: '0',
            Difficulty: 'None',
            TemplateReplacement: '',
        });
    }

    createTextOptions(bindings, faceIndex) {
        var panel = new ui.Grid();
        var fullBox = new ui.checkBox(strings.string('AHLCG-FullPage'));
        this.bind(bindings, faceIndex, 'ChaosFull', fullBox);

        var items = Difficulties.map(function (id) {
            var label =
                id === 'None'
                    ? strings.string('AHLCG-Difficulty-None')
                    : strings.gstring('AHLCG-Difficulty-' + id);
            return new ListItem(id, label);
        });
        var difficultyList = new ui.comboBox(items, null);
        this.bind(bindings, faceIndex, 'Difficulty', difficultyList);

        panel.place(
            fullBox,
            'wrap',
            strings.string('AHLCG-Difficulty'),
            'split 2',
            difficultyList,
            'wrap'
        );
        return panel;
    }

    createPainter(diy, sheet, faceIndex) {
        var boxes = super.createPainter(diy, sheet, faceIndex);
        boxes.difficulty = this.createBox(diy, sheet, 'Difficulty');
        boxes.intro = this.createBox(diy, sheet, 'Intro');
        boxes.intro.setLineTightness(
            Number(
                diy.settings.get(this.key(diy.settings, 'Intro-tightness'))
            ) * FaceUtils.plugin().bodyFontTightness
        );
        boxes.intro.setTextFitting(markup.FIT_SCALE_TEXT);
        boxes.tokens = [];
        return boxes;
    }

    createTokenBox(diy, sheet) {
        var box = this.createBox(diy, sheet, 'Token');
        box.setLineTightness(
            Number(
                diy.settings.get(this.key(diy.settings, 'Token-tightness'))
            ) * FaceUtils.plugin().bodyFontTightness
        );
        box.setTextFitting(markup.FIT_SCALE_TEXT);
        FaceUtils.initBodyTags(diy, box);
        return box;
    }

    isFullPage(diy, faceIndex) {
        return (
            String(
                diy.settings.get('ChaosFull' + this.suffix(faceIndex), '0')
            ) === '1'
        );
    }

    getDifficulty(diy, faceIndex) {
        return String(
            diy.settings.get('Difficulty' + this.suffix(faceIndex), 'None')
        );
    }

    textRegion(diy, faceIndex, name) {
        if (this.isFullPage(diy, faceIndex))
            return super.textRegion(diy, faceIndex, 'Full' + name);

        var region = super.textRegion(diy, faceIndex, name);
        if (name === 'Body' || name === 'Story') {
            let offset = 0;
            if (this.getTitle(diy, faceIndex).indexOf('\n') > 0)
                offset += SecondLineHeight;
            if (this.getDifficulty(diy, faceIndex) !== 'None')
                offset += DifficultyHeight;
            region.y += offset;
            region.height -= offset;
        }
        return region;
    }

    paint(g, diy, sheet, boxes, collector) {
        var faceIndex = sheet.getSheetIndex();
        var full = this.isFullPage(diy, faceIndex);

        var replaced = this.paintTemplate(g, sheet);
        if (!full && !replaced)
            sheet.paintImage(g, this.template + '-EncounterFrame');
        FaceUtils.translateToTrim(g, sheet);

        var top;
        if (full) top = this.textRegion(diy, faceIndex, 'Token').y;
        else {
            top = diy.settings.getRegion(
                this.key(diy.settings, 'Difficulty-region')
            ).y;
            let title = this.getTitle(diy, faceIndex);
            if (title.length > 0)
                top = this.paintChaosTitle(g, diy, boxes.name, title);
            top = this.paintDifficulty(
                g,
                diy,
                boxes.difficulty,
                this.getDifficulty(diy, faceIndex),
                top
            );
        }

        this.paintText(g, diy, sheet, boxes, top);
        this.paintCollector(g, diy, sheet, boxes, collector, !full);
    }

    // Each line of the title above a double rule as wide as the last line.
    // Returns the bottom of the rule.
    paintChaosTitle(g, diy, box, title) {
        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Name-region')
        );
        region.y += parseInt(FaceUtils.plugin().titleFontOffset);

        box.markupText = 'Size';
        var lineHeight = box.measure(g, region);

        var width = 0;
        title.split('\n').forEach(function (line) {
            box.markupText = line;
            width = box.drawAsSingleLine(g, region);
            region.y += lineHeight * 0.8;
            region.height -= lineHeight * 0.8;
        });

        g.setPaint(Color.BLACK);
        g.setStroke(new BasicStroke(1.0));
        g.drawLine(
            region.x + (region.width - width) / 2,
            region.y + 2,
            region.x + (region.width + width) / 2 + 2,
            region.y + 2
        );
        g.drawLine(
            region.x + (region.width - width) / 2,
            region.y + 6,
            region.x + (region.width + width) / 2 + 2,
            region.y + 6
        );

        return region.y + 12;
    }

    // returns where the next block starts
    paintDifficulty(g, diy, box, difficulty, y) {
        if (difficulty === 'None') return y;

        var region = diy.settings.getRegion(
            this.key(diy.settings, 'Difficulty-region')
        );
        region.y = y + parseInt(FaceUtils.plugin().typeFontOffset);
        box.markupText = strings.gstring('AHLCG-Difficulty-' + difficulty);
        box.drawAsSingleLine(g, region);
        return y + DifficultyHeight;
    }
}

export default TokenRulesFace;
