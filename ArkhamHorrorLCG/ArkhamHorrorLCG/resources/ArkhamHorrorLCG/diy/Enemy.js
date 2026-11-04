/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An enemy with an encounter card back.
define([
    'handlers/exportHandler',
    'handlers/FaceHandler',
    'faces/EncounterBackFace',
    'faces/EnemyFace',
], function (exportHandler, FaceHandler, EncounterBackFace, EnemyFace) {
    function EnemyHandler() {
        FaceHandler.call(
            this,
            // the legacy template keys, which saved cards keep
            { templateKeys: ['AHLCG-Enemy-Default', 'AHLCG-EnemyBack-Default'] },
            new EnemyFace(),
            new EncounterBackFace()
        );
    }

    EnemyHandler.prototype = Object.create(FaceHandler.prototype);
    EnemyHandler.prototype.constructor = EnemyHandler;

    EnemyHandler.prototype.legacyPortraits = function (diy) {
        return [[0, 'Portrait'], 'Collection', 'Encounter'];
    };

    exportHandler(globalThis, new EnemyHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
