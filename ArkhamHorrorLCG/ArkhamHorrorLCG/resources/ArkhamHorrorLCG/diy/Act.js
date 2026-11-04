/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An act, front and back.
define([
    'handlers/exportHandler',
    'handlers/LegacyActAgenda',
    'handlers/ShimHandler',
    'faces/ActBackFace',
    'faces/ActFace',
], function (
    exportHandler,
    LegacyActAgenda,
    ShimHandler,
    ActBackFace,
    ActFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Act-Default', 'AHLCG-ActBack-Default'],
            faces: [ActFace, ActBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'Act');
            },
            // the art region moved in version 17; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 17) return;
                var portrait = art[0][0];
                var reversed =
                    String(diy.settings.get('Orientation')) === 'Reversed';
                portrait.setPanX(portrait.getPanX() + (reversed ? -10 : 10));
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
