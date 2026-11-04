// The page types of the legacy story handlers' $Template settings: a story
// page or a token page, as FaceChoiceHandler choices.
//
// Module: returns { Pages, upgrade }.
define(['faces/StoryFace', 'faces/TokenRulesFace'], function (
    StoryFace,
    TokenRulesFace
) {
    const Pages = [
        { id: 'Story', label: 'AHLCG-StoryTemplate-Story', face: StoryFace },
        {
            id: 'Chaos',
            label: 'AHLCG-StoryTemplate-Token',
            face: TokenRulesFace,
        },
    ];

    // An older save's full token page, a page type of its own, becomes a
    // token page with its Full option.
    function upgrade(settings, setting, suffix) {
        var page = String(settings.get(setting, 'Story'));
        if (page === 'ChaosFull' || page === 'ChaosFullText') {
            settings.set(setting, 'Chaos');
            settings.set('ChaosFull' + suffix, '1');
        }
    }

    return { Pages: Pages, upgrade: upgrade };
});
