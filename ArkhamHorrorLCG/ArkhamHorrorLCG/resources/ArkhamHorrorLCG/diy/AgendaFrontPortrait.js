/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An agenda with full art on its front.
define([
    'handlers/exportHandler',
    'handlers/LegacyActAgenda',
    'handlers/ShimHandler',
    'faces/AgendaBackFace',
    'faces/AgendaFrontPortraitFace',
], function (
    exportHandler,
    LegacyActAgenda,
    ShimHandler,
    AgendaBackFace,
    AgendaFrontPortraitFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AgendaFrontPortrait-Default',
                'AHLCG-AgendaBack-Default',
            ],
            faces: [AgendaFrontPortraitFace, AgendaBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'AgendaFrontPortrait');
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
