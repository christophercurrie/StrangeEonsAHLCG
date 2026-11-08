// A story page, or a token page, chosen by $Template, with an enemy on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the enemy art under the legacy key.
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class StoryEnemyHandler extends FaceChoiceHandler {
    constructor() {
        super({
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
