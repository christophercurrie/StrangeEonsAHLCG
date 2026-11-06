/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story page, or a token page, chosen by $Template, with a story asset on
// the back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the asset art under the legacy key.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryAsset',
    'handlers/LegacyStoryText',
    'handlers/StoryPages',
    'faces/AssetFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryAsset,
    LegacyStoryText,
    StoryPages,
    AssetFace
) {
    function StoryAssetHandler() {
        FaceChoiceHandler.call(this, {
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-AssetStory-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Asset',
                        label: 'AHLCG-Face-asset',
                        face: AssetFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
            cardDefaults: { CardClassBack: 'Story' },
        });
    }

    StoryAssetHandler.prototype = Object.create(FaceChoiceHandler.prototype);
    StoryAssetHandler.prototype.constructor = StoryAssetHandler;

    StoryAssetHandler.prototype.upgradeChoices = function (diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
        // a back without a title showed the component name
        if (diy.settings.get('TitleBack') == null)
            diy.settings.set('TitleBack', String(diy.name));
    };

    StoryAssetHandler.prototype.legacyPortraits = function (diy) {
        return [[1, 'Portrait'], 'Collection', 'Encounter'];
    };

    StoryAssetHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
        LegacyStoryAsset.upgrade(diy.settings, 'Back');
    };

    exportHandler(globalThis, new StoryAssetHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
