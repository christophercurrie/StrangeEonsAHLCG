/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story page, or a token page, chosen by $Template, with an enemy on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the enemy art under the legacy key.
define([
    'handlers/CardVersion',
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/LegacyStoryText',
    'handlers/StoryPages',
    'faces/EnemyFace',
], function (
    CardVersion,
    exportHandler,
    FaceChoiceHandler,
    LegacyStoryText,
    StoryPages,
    EnemyFace
) {
    function StoryEnemyHandler() {
        FaceChoiceHandler.call(this, {
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Enemy-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [{ id: 'Enemy', label: 'AHLCG-Face-enemy', face: EnemyFace }],
            ],
            title: 'AHLCG-Template',
        });
    }

    StoryEnemyHandler.prototype = Object.create(FaceChoiceHandler.prototype);
    StoryEnemyHandler.prototype.constructor = StoryEnemyHandler;

    StoryEnemyHandler.prototype.upgradeChoices = function (diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    };

    StoryEnemyHandler.prototype.upgrade = function (diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
    };

    exportHandler(globalThis, new StoryEnemyHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
