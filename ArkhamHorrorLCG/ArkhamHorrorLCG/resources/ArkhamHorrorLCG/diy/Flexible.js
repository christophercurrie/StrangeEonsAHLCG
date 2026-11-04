/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A card whose faces are chosen in the editor. $FrontFace and $BackFace hold
// the chosen face ids; any face can be used on either side.
define([
    'handlers/exportHandler',
    'handlers/FaceChoiceHandler',
    'faces/PlayerBackFace',
    'faces/EncounterBackFace',
    'faces/EnemyFace',
    'faces/ScenarioRulesFace',
    'faces/StoryFace',
    'faces/TokenRulesFace',
    'faces/TreacheryFace',
], function (
    exportHandler,
    FaceChoiceHandler,
    PlayerBackFace,
    EncounterBackFace,
    EnemyFace,
    ScenarioRulesFace,
    StoryFace,
    TokenRulesFace,
    TreacheryFace
) {
    // face ids, in menu order, and their faces
    const Faces = {
        playerBack: PlayerBackFace,
        encounterBack: EncounterBackFace,
        enemy: EnemyFace,
        scenarioRules: ScenarioRulesFace,
        story: StoryFace,
        tokenRules: TokenRulesFace,
        treachery: TreacheryFace,
    };

    const Choices = Object.keys(Faces).map(function (id) {
        return { id: id, label: 'AHLCG-Face-' + id, face: Faces[id] };
    });

    exportHandler(
        globalThis,
        new FaceChoiceHandler({
            templateKeys: [
                'AHLCG-FlexibleHandler-Front',
                'AHLCG-FlexibleHandler-Back',
            ],
            settings: ['FrontFace', 'BackFace'],
            choices: [Choices, Choices],
            defaults: ['playerBack', 'encounterBack'],
            title: 'AHLCG-Faces',
        })
    );
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
