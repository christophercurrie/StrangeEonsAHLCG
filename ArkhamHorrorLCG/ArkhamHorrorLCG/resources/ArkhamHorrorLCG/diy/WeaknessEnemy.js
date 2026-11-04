/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A weakness enemy with a player card back.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/EnemyFace',
    'faces/PlayerBackFace',
], function (exportHandler, ShimHandler, EnemyFace, PlayerBackFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-WeaknessEnemy-Default',
                'AHLCG-WeaknessEnemyBack-Default',
            ],
            faces: [EnemyFace, PlayerBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { Subtype: 'BasicWeakness' },
        })
    );
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
