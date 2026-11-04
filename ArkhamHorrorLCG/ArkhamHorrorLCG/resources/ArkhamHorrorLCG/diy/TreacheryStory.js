/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story weakness treachery with a player card back.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/PlayerBackFace',
    'faces/TreacheryFace',
], function (exportHandler, ShimHandler, PlayerBackFace, TreacheryFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-WeaknessTreachery-Default',
                'AHLCG-TreacheryStoryBack-Default',
            ],
            faces: [TreacheryFace, PlayerBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { Subtype: 'StoryWeakness' },
            upgrade: function (diy) {
                // legacy cards are always story weaknesses
                diy.settings.set('Subtype', 'StoryWeakness');
            },
        })
    );
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
