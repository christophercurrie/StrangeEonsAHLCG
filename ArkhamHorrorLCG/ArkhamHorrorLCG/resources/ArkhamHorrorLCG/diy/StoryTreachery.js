/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story page, or a token page, chosen by $Template, with a treachery on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the treachery art under the legacy key.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryText',
    'handlers/StoryPages',
    'faces/TreacheryFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryText,
    StoryPages,
    TreacheryFace
) {
    function StoryTreacheryHandler() {
        FaceChoiceHandler.call(this, {
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Treachery-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Treachery',
                        label: 'AHLCG-Face-treachery',
                        face: TreacheryFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
        });
    }

    StoryTreacheryHandler.prototype = Object.create(
        FaceChoiceHandler.prototype
    );
    StoryTreacheryHandler.prototype.constructor = StoryTreacheryHandler;

    StoryTreacheryHandler.prototype.upgradeChoices = function (diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    };

    StoryTreacheryHandler.prototype.legacyPortraits = function (diy) {
        return [[1, 'Portrait'], 'Collection', 'Encounter'];
    };

    StoryTreacheryHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
    };

    exportHandler(globalThis, new StoryTreacheryHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
