// A scenario sheet: each side a rules page, a token page or art, chosen by
// $Template and $TemplateBack.
//
// Cards saved before version 31 have Resolution and ChaosFull page types, for
// a rules page with its Resolution option and a token page with its Full
// option, a token page's text as plain rules, and only the portraits their
// pages use.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import PortraitFace from './faces/PortraitFace.mjs';
import ScenarioRulesFace from './faces/ScenarioRulesFace.mjs';
import TextBlocks from './faces/TextBlocks.mjs';
import TokenRulesFace from './faces/TokenRulesFace.mjs';

const Settings = ['Template', 'TemplateBack'];
const Suffixes = ['', 'Back'];
const Pages = [
    {
        id: 'Title',
        label: 'AHLCG-Scenario-Title',
        face: ScenarioRulesFace,
    },
    {
        id: 'Chaos',
        label: 'AHLCG-StoryTemplate-Token',
        face: TokenRulesFace,
    },
    {
        id: 'Portrait',
        label: 'AHLCG-Scenario-Portrait',
        face: PortraitFace,
    },
];

function page(settings, side) {
    return String(settings.get(Settings[side], 'Title'));
}

export class ScenarioHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Scenario-Default', 'AHLCG-Scenario-Default'],
            settings: Settings,
            choices: [Pages, Pages],
            title: 'AHLCG-Template',
        });
    }

    upgradeChoices(diy) {
        var settings = diy.settings;
        if (diy.version < 16) {
            settings.set('Template', settings.get('PageType', 'Title'));
            settings.set('TemplateBack', settings.get('PageTypeBack', 'Title'));
            settings.reset('PageType');
            settings.reset('PageTypeBack');
        }
        Suffixes.forEach(function (suffix, side) {
            var type = page(settings, side);
            if (type === 'Resolution') {
                settings.set(Settings[side], 'Title');
                settings.set('Resolution' + suffix, '1');
            } else if (type === 'ChaosFull') {
                settings.set(Settings[side], 'Chaos');
                settings.set('ChaosFull' + suffix, '1');
            }
            // a token page's text was plain rules
            if (page(settings, side) === 'Chaos') {
                let rules = String(settings.get('Rules' + suffix, ''));
                TextBlocks.write(settings, suffix, [
                    { style: 'rules', text: rules, spacing: 0, tokens: [] },
                ]);
                settings.reset('Rules' + suffix);
            }
        });
    }

    // the portraits each side's page saved
    legacyPortraits(diy) {
        var settings = diy.settings;
        var chaos = false;
        var full = false;
        var list = [];
        Suffixes.forEach(function (suffix, side) {
            var type = page(settings, side);
            if (type === 'Portrait') list.push([side, 'Portrait']);
            if (type === 'Chaos') {
                if (String(settings.get('ChaosFull' + suffix, '0')) === '1')
                    full = true;
                else chaos = true;
            }
        });
        if (diy.version >= 17) {
            if (chaos) list.push('Collection');
            if (chaos || full) list.push('Encounter');
        }
        return list;
    }
}
