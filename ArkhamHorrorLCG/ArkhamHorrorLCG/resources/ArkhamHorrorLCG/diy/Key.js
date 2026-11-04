/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A key, front and back.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/KeyFace',
], function (exportHandler, ShimHandler, KeyFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Key-Default', 'AHLCG-KeyBack-Default'],
            faces: [KeyFace, KeyFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { PortraitShare: '1' },
            upgrade: function (diy) {
                var settings = diy.settings;
                if (diy.version < 2) settings.set('PortraitShare', '0');
                // a back without a title kept its own unique symbol
                if (
                    settings.get('TitleBack') == null &&
                    String(settings.get('UniqueBack', '0')) !==
                        String(settings.get('Unique', '0'))
                )
                    settings.set('TitleBack', String(diy.name));
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
