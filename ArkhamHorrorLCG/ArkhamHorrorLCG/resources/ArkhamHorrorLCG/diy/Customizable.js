/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A customizable upgrade sheet with its own back.
define([
    'handlers/exportHandler',
    'handlers/ShimHandler',
    'faces/CustomizableBackFace',
    'faces/CustomizableFace',
], function (
    exportHandler,
    ShimHandler,
    CustomizableBackFace,
    CustomizableFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Customizable-Default',
                'AHLCG-CustomizableBack-Default',
            ],
            faces: [CustomizableFace, CustomizableBackFace],
            legacyPortraits: ['Collection'],
        })
    );
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
