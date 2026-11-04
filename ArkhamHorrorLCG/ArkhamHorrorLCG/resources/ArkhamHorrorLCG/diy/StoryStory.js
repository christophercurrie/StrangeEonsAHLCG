/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// Story pages on both sides: a story page or a token page, chosen by
// $Template and $TemplateBack; the back can also be a player or encounter
// card back.
//
// Cards saved before version 31 have legacy story text (see
// handlers/LegacyStoryText) and a ChaosFull page type for a full token page.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryText',
    'handlers/StoryPages',
    'faces/EncounterBackFace',
    'faces/PlayerBackFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryText,
    StoryPages,
    EncounterBackFace,
    PlayerBackFace
) {
    const Suffixes = ['', 'Back'];
    const Settings = ['Template', 'TemplateBack'];
    // the legacy template key, which saved cards keep
    const TemplateKey = 'AHLCG-Story-Default';
    const Pages = StoryPages.Pages;
    const Backs = Pages.concat([
        { id: 'Player', label: 'AHLCG-Back-Player', face: PlayerBackFace },
        {
            id: 'Encounter',
            label: 'AHLCG-Back-Encounter',
            face: EncounterBackFace,
        },
    ]);

    function StoryStoryHandler() {
        FaceChoiceHandler.call(this, {
            templateKeys: [TemplateKey, TemplateKey],
            settings: Settings,
            choices: [Pages, Backs],
            title: 'AHLCG-Template',
        });
    }

    StoryStoryHandler.prototype = Object.create(FaceChoiceHandler.prototype);
    StoryStoryHandler.prototype.constructor = StoryStoryHandler;

    StoryStoryHandler.prototype.upgradeChoices = function (diy) {
        Settings.forEach(function (setting, faceIndex) {
            StoryPages.upgrade(diy.settings, setting, Suffixes[faceIndex]);
        });
    };

    StoryStoryHandler.prototype.legacyPortraits = function (diy) {
        return ['Collection', 'Encounter'];
    };

    StoryStoryHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        Suffixes.forEach(function (suffix) {
            LegacyStoryText.upgrade(diy.settings, suffix);
        });
    };

    exportHandler(globalThis, new StoryStoryHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
