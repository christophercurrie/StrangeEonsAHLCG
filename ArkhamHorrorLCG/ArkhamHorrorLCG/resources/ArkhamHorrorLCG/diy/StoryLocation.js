/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story page, or a token page, chosen by $Template, with a location on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the location art under the legacy key.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryText',
    'handlers/StoryPages',
    'faces/LocationFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryText,
    StoryPages,
    LocationFace
) {
    function StoryLocationHandler() {
        FaceChoiceHandler.call(this, {
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Location-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Location',
                        label: 'AHLCG-Face-location',
                        face: LocationFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
            cardDefaults: {
                LocationIconBack: 'Circle',
                Connection1IconBack: 'None',
                Connection2IconBack: 'None',
                Connection3IconBack: 'None',
                Connection4IconBack: 'None',
                Connection5IconBack: 'None',
                Connection6IconBack: 'None',
            },
        });
    }

    StoryLocationHandler.prototype = Object.create(FaceChoiceHandler.prototype);
    StoryLocationHandler.prototype.constructor = StoryLocationHandler;

    StoryLocationHandler.prototype.upgradeChoices = function (diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    };

    StoryLocationHandler.prototype.legacyPortraits = function (diy) {
        return [[1, 'Portrait'], 'Collection', 'Encounter'];
    };

    StoryLocationHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
    };

    exportHandler(globalThis, new StoryLocationHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
