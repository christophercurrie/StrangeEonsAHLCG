/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A story asset, an asset of the Story or StoryWeakness class, with a
// player or encounter card back.
define([
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'handlers/PlayerBacks',
    'faces/AssetFace',
], function (exportHandler, FaceChoiceHandler, PlayerBacks, AssetFace) {
    exportHandler(
        globalThis,
        new FaceChoiceHandler({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AssetStory-Default',
                'AHLCG-AssetStoryBack-Default',
            ],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Asset', label: 'AHLCG-Face-asset', face: AssetFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { CardClass: 'Story' },
            // legacy story assets were Neutral or Weakness
            upgrade: function (diy) {
                var settings = diy.settings;
                var weakness = String(settings.get('CardClass')) === 'Weakness';
                settings.set('CardClass', weakness ? 'StoryWeakness' : 'Story');
            },
            upgradeChoices: function (diy) {
                PlayerBacks.upgrade(diy.settings);
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
