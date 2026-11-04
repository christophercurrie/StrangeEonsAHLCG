/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// Chaos token effects: the token rules face on both sides, for the easy and
// standard difficulties on the front and hard and expert on the back.
//
// Cards saved before version 31 have a fixed layout: text for each token,
// <token><suffix>, joined to another token's group by Merge<token><suffix>,
// and a tracking box on the front that both sides show.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceHandler',
    'faces/TextBlocks',
    'faces/TokenRulesFace',
], function (
    CardVersion,
    exportHandler,
    FaceHandler,
    TextBlocks,
    TokenRulesFace
) {
    const Tokens = ['Skull', 'Cultist', 'Tablet', 'ElderThing'];
    const Suffixes = ['', 'Back'];
    // the legacy template key, which saved cards keep
    const TemplateKey = 'AHLCG-Chaos-Default';

    // Token blocks for a side of a legacy card, grouped as the legacy layout
    // grouped them: a token without text is left out unless merged, and a
    // group shows the text of its first token that has some.
    function legacyBlocks(settings, suffix) {
        var text = Tokens.map(function (token) {
            return String(settings.get(token + suffix, ''));
        });
        var group = text.map(function (t, i) {
            return t.length > 0 ? i : Tokens.length;
        });
        Tokens.forEach(function (token, i) {
            var j = Tokens.indexOf(
                String(settings.get('Merge' + token + suffix, 'None'))
            );
            if (j < 0) return;
            group[i] = group[j] = Math.min(group[i], group[j]);
        });

        var blocks = [];
        for (let g = 0; g < Tokens.length; g++) {
            let members = Tokens.filter(function (token, i) {
                return group[i] === g;
            });
            if (members.length === 0) continue;
            blocks.push({
                style: 'token',
                text: text.filter(function (t, i) {
                    return group[i] === g && t.length > 0;
                })[0],
                spacing: 0,
                tokens: members,
            });
        }
        return blocks;
    }

    function clearLegacyKeys(settings, suffix) {
        Tokens.forEach(function (token) {
            settings.reset(token + suffix);
            settings.reset(token + suffix + 'Spacing');
            settings.reset('Merge' + token + suffix);
        });
    }

    function ChaosHandler() {
        FaceHandler.call(
            this,
            { templateKeys: [TemplateKey, TemplateKey] },
            new TokenRulesFace(),
            new TokenRulesFace()
        );
    }

    ChaosHandler.prototype = Object.create(FaceHandler.prototype);
    ChaosHandler.prototype.constructor = ChaosHandler;

    ChaosHandler.prototype.setCardDefaults = function (diy) {
        diy.settings.set('Difficulty', 'Front');
        diy.settings.set('DifficultyBack', 'Back');
    };

    ChaosHandler.prototype.legacyPortraits = function (diy) {
        return ['Collection', 'Encounter'];
    };

    ChaosHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        var settings = diy.settings;

        Suffixes.forEach(function (suffix) {
            var blocks = legacyBlocks(settings, suffix);
            if (blocks.length > 0) TextBlocks.write(settings, suffix, blocks);
            clearLegacyKeys(settings, suffix);
        });

        settings.set('Difficulty', 'Front');
        settings.set('DifficultyBack', 'Back');
        settings.set('TitleBack', diy.name);
        if (String(settings.get('TrackerBoxBack', '')).length === 0) {
            settings.set('TrackerBoxBack', settings.get('TrackerBox', ''));
            settings.set(
                'TrackerHeightBack',
                settings.get('TrackerHeight', '100')
            );
        }
    };

    exportHandler(globalThis, new ChaosHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
