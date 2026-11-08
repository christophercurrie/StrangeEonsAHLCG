// A story page, or a token page, chosen by $Template, with a token page on
// the back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText) and legacy token text and a header on the back
// (see handlers/LegacyTokenText).
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import LegacyTokenText from './handlers/LegacyTokenText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import TextBlocks from './faces/TextBlocks.mjs';
import TokenRulesFace from './faces/TokenRulesFace.mjs';

export class StoryChaosHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Chaos-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Chaos',
                        label: 'AHLCG-Face-tokenRules',
                        face: TokenRulesFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
        });
    }

    upgradeChoices(diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    }

    legacyPortraits(diy) {
        return ['Collection', 'Encounter'];
    }

    upgrade(diy) {
        if (diy.version >= CardVersion) return;
        var settings = diy.settings;
        LegacyStoryText.upgrade(settings, '');
        // the back's header leads its tokens
        var blocks = LegacyTokenText.toBlocks(settings, 'Back');
        var header = String(settings.get('HeaderBack', ''));
        if (header.length > 0)
            blocks.unshift({
                style: 'intro',
                text: header,
                spacing: 0,
                tokens: [],
            });
        if (blocks.length > 0) TextBlocks.write(settings, 'Back', blocks);
        LegacyTokenText.clear(settings, 'Back');
        settings.reset('HeaderBack');
    }
}
