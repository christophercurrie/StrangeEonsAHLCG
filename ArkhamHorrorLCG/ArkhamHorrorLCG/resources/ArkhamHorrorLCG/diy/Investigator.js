/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An investigator: class art front and deckbuilding back.
define([
    'handlers/exportHandler',
    'handlers/InvestigatorSections',
    'handlers/ShimHandler',
    'faces/InvestigatorBackFace',
    'faces/InvestigatorFace',
], function (
    exportHandler,
    InvestigatorSections,
    ShimHandler,
    InvestigatorBackFace,
    InvestigatorFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Investigator-Default',
                'AHLCG-InvestigatorBack-Default',
            ],
            faces: [InvestigatorFace, InvestigatorBackFace],
            legacyPortraits: [
                [0, 'TransparentPortrait'],
                [1, 'Portrait'],
                'Collection',
            ],
            upgrade: function (diy) {
                var settings = diy.settings;
                if (diy.version < 10) settings.set('Unique', '1');
                if (diy.version < 12) InvestigatorSections.upgrade(settings);
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
