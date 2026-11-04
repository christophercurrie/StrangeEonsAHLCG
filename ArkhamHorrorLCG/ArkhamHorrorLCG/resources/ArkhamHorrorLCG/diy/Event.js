/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A player event with a player or encounter card back.
define([
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/PlayerBacks',
    'faces/EventFace',
], function (exportHandler, FaceChoiceHandler, PlayerBacks, EventFace) {
    exportHandler(
        globalThis,
        new FaceChoiceHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Event-Default', 'AHLCG-EventBack-Default'],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Event', label: 'AHLCG-Face-event', face: EventFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
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
