/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A location: its revealed side, and an unrevealed side or a player or
// encounter card back.
define([
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/PlayerBacks',
    'faces/LocationBackFace',
    'faces/LocationFace',
], function (
    exportHandler,
    FaceChoiceHandler,
    PlayerBacks,
    LocationBackFace,
    LocationFace
) {
    exportHandler(
        globalThis,
        new FaceChoiceHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Location-Default',
                'AHLCG-LocationBack-Default',
            ],
            settings: [null, 'BackTypeBack'],
            choices: [
                [
                    {
                        id: 'Location',
                        label: 'AHLCG-Face-location',
                        face: LocationFace,
                    },
                ],
                [
                    {
                        id: 'Standard',
                        label: 'AHLCG-Back-Standard',
                        face: LocationBackFace,
                    },
                ].concat(PlayerBacks.Backs),
            ],
            cardDefaults: { PortraitShare: '1' },
            title: 'AHLCG-Template',
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            // the back was BackType before version 16
            upgradeChoices: function (diy) {
                var settings = diy.settings;
                if (diy.version < 16) {
                    let back = settings.get('BackType');
                    settings.set(
                        'BackTypeBack',
                        back != null ? back : 'Standard'
                    );
                    settings.reset('BackType');
                }
                if (settings.get('BackTypeBack') == null)
                    settings.set('BackTypeBack', 'Standard');
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
