/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story asset on each side.
define([
    'handlers/exportHandler',
    'handlers/LegacyStoryAsset',
    'handlers/ShimHandler',
    'faces/AssetFace',
], function (exportHandler, LegacyStoryAsset, ShimHandler, AssetFace) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AssetStory-Default',
                'AHLCG-AssetStory-Default',
            ],
            faces: [AssetFace, AssetFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: {
                CardClass: 'Story',
                CardClassBack: 'Story',
                PortraitShare: '1',
            },
            upgrade: function (diy) {
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, '');
                LegacyStoryAsset.upgrade(diy.settings, 'Back');
                // a back without a title showed the component name
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
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
