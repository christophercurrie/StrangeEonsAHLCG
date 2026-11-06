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
    'handlers/LegacyTokenText',
    'faces/TextBlocks',
    'faces/TokenRulesFace',
], function (
    CardVersion,
    exportHandler,
    FaceHandler,
    LegacyTokenText,
    TextBlocks,
    TokenRulesFace
) {
    const Suffixes = ['', 'Back'];
    // the legacy template key, which saved cards keep
    const TemplateKey = 'AHLCG-Chaos-Default';

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
            var blocks = LegacyTokenText.toBlocks(settings, suffix);
            if (blocks.length > 0) TextBlocks.write(settings, suffix, blocks);
            LegacyTokenText.clear(settings, suffix);
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
