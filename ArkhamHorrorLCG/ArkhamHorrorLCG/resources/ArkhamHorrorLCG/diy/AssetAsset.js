/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A player asset on each side.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/AssetFace',
], function (exportHandler, ShimHandler, AssetFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Asset-Default', 'AHLCG-Asset-Default'],
            faces: [AssetFace, AssetFace],
            legacyPortraits: [[0, 'Portrait'], [1, 'Portrait'], 'Collection'],
            // a back without a title showed the component name
            upgrade: function (diy) {
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
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
