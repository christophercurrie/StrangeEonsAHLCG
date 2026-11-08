// A story page, or a token page, chosen by $Template, with a treachery on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the treachery art under the legacy key.
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';

export class StoryTreacheryHandler extends FaceChoiceHandler {
    constructor() {
        super({
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

    upgradeChoices(diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
    }

    legacyPortraits(diy) {
        return [[1, 'Portrait'], 'Collection', 'Encounter'];
    }

    upgrade(diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
    }
}
