// The page types of the legacy story handlers' $Template settings: a story
// page or a token page, as FaceChoiceHandler choices.
//
// Module: returns { Pages, upgrade }.
import StoryFace from '../faces/StoryFace.mjs';
import TokenRulesFace from '../faces/TokenRulesFace.mjs';

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

export default { Pages: Pages, upgrade: upgrade };
