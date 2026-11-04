/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An agenda, front and back.
define([
    'handlers/exportHandler',
    'handlers/LegacyActAgenda',
    'handlers/ShimHandler',
    'faces/AgendaBackFace',
    'faces/AgendaFace',
], function (
    exportHandler,
    LegacyActAgenda,
    ShimHandler,
    AgendaBackFace,
    AgendaFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-AgendaBack-Default'],
            faces: [AgendaFace, AgendaBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'Agenda');
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
