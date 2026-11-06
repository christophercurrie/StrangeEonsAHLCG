/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// An agenda with a story asset on its back.
define([
    'handlers/exportHandler',
    'handlers/LegacyStoryAsset',
    'handlers/ShimHandler',
    'faces/AgendaFace',
    'faces/AssetFace',
], function (
    exportHandler,
    LegacyStoryAsset,
    ShimHandler,
    AgendaFace,
    AssetFace
) {
    exportHandler(
        globalThis,
        new ShimHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-AssetStory-Default'],
            faces: [AgendaFace, AssetFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { CardClassBack: 'Story' },
            upgrade: function (diy) {
                // the art's clip region was set on the card for its orientation
                diy.settings.reset(
                    'AHLCG-Agenda-Portrait-portrait-clip-region'
                );
                // legacy story assets were Neutral or Weakness
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
