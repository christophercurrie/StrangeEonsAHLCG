/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A treachery with an encounter card back.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/EncounterBackFace',
    'faces/TreacheryFace',
], function (exportHandler, ShimHandler, EncounterBackFace, TreacheryFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Treachery-Default',
                'AHLCG-TreacheryBack-Default',
            ],
            faces: [TreacheryFace, EncounterBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
        })
    );
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
