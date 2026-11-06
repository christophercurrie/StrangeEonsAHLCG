/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story page, or a token page, chosen by $Template, with a token page on
// the back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText) and legacy token text and a header on the back
// (see handlers/LegacyTokenText).
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryText',
    'handlers/LegacyTokenText',
    'handlers/StoryPages',
    'faces/TextBlocks',
    'faces/TokenRulesFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryText,
    LegacyTokenText,
    StoryPages,
    TextBlocks,
    TokenRulesFace
) {
    function StoryChaosHandler() {
        FaceChoiceHandler.call(this, {
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Chaos-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Chaos',
                        label: 'AHLCG-Face-tokenRules',
                        face: TokenRulesFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
        });
    }

    StoryChaosHandler.prototype = Object.create(FaceChoiceHandler.prototype);
    StoryChaosHandler.prototype.constructor = StoryChaosHandler;

    StoryChaosHandler.prototype.upgradeChoices = function (diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    };

    StoryChaosHandler.prototype.legacyPortraits = function (diy) {
        return ['Collection', 'Encounter'];
    };

    StoryChaosHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        var settings = diy.settings;
        LegacyStoryText.upgrade(settings, '');
        // the back's header leads its tokens
        var blocks = LegacyTokenText.toBlocks(settings, 'Back');
        var header = String(settings.get('HeaderBack', ''));
        if (header.length > 0)
            blocks.unshift({
                style: 'intro',
                text: header,
                spacing: 0,
                tokens: [],
            });
        if (blocks.length > 0) TextBlocks.write(settings, 'Back', blocks);
        LegacyTokenText.clear(settings, 'Back');
        settings.reset('HeaderBack');
    };

    exportHandler(globalThis, new StoryChaosHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
