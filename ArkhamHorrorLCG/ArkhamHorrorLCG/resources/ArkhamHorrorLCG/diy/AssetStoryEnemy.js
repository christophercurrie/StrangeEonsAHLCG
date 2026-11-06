/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story asset with an enemy on its back.
define([
    'handlers/exportHandler',
    'handlers/LegacyStoryAsset',
    'handlers/ShimHandler',
    'faces/AssetFace',
    'faces/EnemyFace',
], function (
    exportHandler,
    LegacyStoryAsset,
    ShimHandler,
    AssetFace,
    EnemyFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-AssetStory-Default', 'AHLCG-Enemy-Default'],
            faces: [AssetFace, EnemyFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { CardClass: 'Story' },
            upgrade: function (diy) {
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, '');
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
