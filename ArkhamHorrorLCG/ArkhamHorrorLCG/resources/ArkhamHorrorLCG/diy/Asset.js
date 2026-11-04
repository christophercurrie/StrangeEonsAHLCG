/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A player asset with a player or encounter card back.
define([
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/PlayerBacks',
    'faces/AssetFace',
], function (exportHandler, FaceChoiceHandler, PlayerBacks, AssetFace) {
    exportHandler(
        globalThis,
        new FaceChoiceHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Asset-Default', 'AHLCG-AssetBack-Default'],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Asset', label: 'AHLCG-Face-asset', face: AssetFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection'],
            upgradeChoices: function (diy) {
                PlayerBacks.upgrade(diy.settings);
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
