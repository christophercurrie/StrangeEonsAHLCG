// Story text as the legacy story handlers save it, per side: three parts A,
// B and C, each <field><part><suffix> with <field><part><suffix>Spacing, a
// rule before each part after the first that has text, and Victory<suffix>.
// Only part A has traits; rules have no spacing.
//
// Module: returns { toBlocks, clear, upgrade }.
import TextBlocks from '../faces/TextBlocks.mjs';

const Parts = ['A', 'B', 'C'];
const Fields = [
    ['Traits', 'traits'],
    ['Header', 'header'],
    ['AccentedStory', 'story'],
    ['Rules', 'rules'],
];

function block(settings, style, name, suffix) {
    return {
        style: style,
        text: String(settings.get(name + suffix, '')),
        spacing:
            parseInt(settings.get(name + suffix + 'Spacing', '0'), 10) || 0,
        tokens: [],
    };
}

// Text blocks laid out as the legacy layout draws the side. Blocks
// without text are left out, and so are rules before parts without text,
// which the legacy layout doesn't draw.
function toBlocks(settings, suffix) {
    var blocks = [];
    Parts.forEach(function (part, i) {
        let texts = Fields.filter(function (field) {
            return i === 0 || field[0] !== 'Traits';
        })
            .map(function (field) {
                return block(settings, field[1], field[0] + part, suffix);
            })
            .filter(function (b) {
                return b.text.length > 0;
            });
        if (texts.length === 0) return;
        if (i > 0)
            blocks.push({
                style: 'rule',
                text: '',
                spacing: 0,
                tokens: [],
            });
        blocks.push.apply(blocks, texts);
    });
    var victory = block(settings, 'victory', 'Victory', suffix);
    if (victory.text.length > 0) blocks.push(victory);
    return blocks;
}

function clear(settings, suffix) {
    Parts.forEach(function (part) {
        Fields.forEach(function (field) {
            settings.reset(field[0] + part + suffix);
            settings.reset(field[0] + part + suffix + 'Spacing');
        });
    });
    settings.reset('Victory' + suffix);
    settings.reset('Victory' + suffix + 'Spacing');
}

// replaces a side's legacy text with blocks, if it has any
function upgrade(settings, suffix) {
    var blocks = toBlocks(settings, suffix);
    if (blocks.length > 0) TextBlocks.write(settings, suffix, blocks);
    clear(settings, suffix);
}

export default { toBlocks: toBlocks, clear: clear, upgrade: upgrade };
