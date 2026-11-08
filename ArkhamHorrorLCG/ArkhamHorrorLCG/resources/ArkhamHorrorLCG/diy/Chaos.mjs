// Chaos token effects: the token rules face on both sides, for the easy and
// standard difficulties on the front and hard and expert on the back.
//
// Cards saved before version 31 have a fixed layout: text for each token,
// <token><suffix>, joined to another token's group by Merge<token><suffix>,
// and a tracking box on the front that both sides show.
import CardVersion from './handlers/CardVersion.mjs';
import FaceHandler from './handlers/FaceHandler.mjs';
import LegacyTokenText from './handlers/LegacyTokenText.mjs';
import TextBlocks from './faces/TextBlocks.mjs';
import TokenRulesFace from './faces/TokenRulesFace.mjs';

const Suffixes = ['', 'Back'];
// the legacy template key, which saved cards keep
const TemplateKey = 'AHLCG-Chaos-Default';

export class ChaosHandler extends FaceHandler {
    constructor() {
        super(
            { templateKeys: [TemplateKey, TemplateKey] },
            new TokenRulesFace(),
            new TokenRulesFace()
        );
    }

    setCardDefaults(diy) {
        diy.settings.set('Difficulty', 'Front');
        diy.settings.set('DifficultyBack', 'Back');
    }

    legacyPortraits(diy) {
        return ['Collection', 'Encounter'];
    }

    upgrade(diy) {
        if (diy.version >= CardVersion) return;
        var settings = diy.settings;

        Suffixes.forEach(function (suffix) {
            var blocks = LegacyTokenText.toBlocks(settings, suffix);
            if (blocks.length > 0) TextBlocks.write(settings, suffix, blocks);
            LegacyTokenText.clear(settings, suffix);
        });

        settings.set('Difficulty', 'Front');
        settings.set('DifficultyBack', 'Back');
        settings.set('TitleBack', diy.name);
        if (String(settings.get('TrackerBoxBack', '')).length === 0) {
            settings.set('TrackerBoxBack', settings.get('TrackerBox', ''));
            settings.set(
                'TrackerHeightBack',
                settings.get('TrackerHeight', '100')
            );
        }
    }
}
