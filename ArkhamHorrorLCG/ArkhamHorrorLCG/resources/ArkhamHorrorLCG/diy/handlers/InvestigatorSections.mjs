// Investigator backs from before named sections kept each section in a key
// of its own; upgrade moves them to Text<n>Back, Text<n>NameBack and
// Text<n>BackSpacing.
//
// Module: returns { upgrade }.

const Names = [
    'Deck Size',
    'Secondary Class Choice',
    'Deckbuilding Options',
    'Deckbuilding Requirements</hdr> (do not count toward deck size)<hdr>',
    'Deckbuilding Restrictions',
    'Additional Requirements',
    'Additional Restrictions',
    '',
];
// each section's old key, a misspelling also read
const Old = [
    ['DeckSize'],
    ['SecondaryClass'],
    ['DeckOptions'],
    ['DeckRequirements'],
    ['DeckRestrictions'],
    ['AdditionalRequirements', 'AdditionalReqirements'],
];

function upgrade(settings) {
    function value(keys, appendix, missing) {
        for (let i = 0; i < keys.length; i++) {
            let v = settings.get(keys[i] + 'Back' + appendix);
            if (v != null) return v;
        }
        return missing;
    }
    Names.forEach(function (name, i) {
        var n = i + 1;
        var old = Old[i] || [];
        settings.set('Text' + n + 'NameBack', name);
        settings.set('Text' + n + 'Back', value(old, '', ''));
        if (n < 8)
            settings.set(
                'Text' + n + 'BackSpacing',
                value(old, 'Spacing', '0')
            );
    });
    Old.forEach(function (keys) {
        keys.forEach(function (key) {
            settings.reset(key + 'Back');
            settings.reset(key + 'BackSpacing');
        });
    });
}

export default { upgrade: upgrade };
