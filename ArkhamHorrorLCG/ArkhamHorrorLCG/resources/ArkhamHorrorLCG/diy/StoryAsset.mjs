// A story page, or a token page, chosen by $Template, with a story asset on
// the back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the asset art under the legacy key.
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class StoryAssetHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-AssetStory-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Asset',
                        label: 'AHLCG-Face-asset',
                        face: AssetFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
            cardDefaults: { CardClassBack: 'Story' },
        });
    }

    upgradeChoices(diy) {
        StoryPages.upgrade(diy.settings, 'Template', '');
        // a back without a title showed the component name
        if (diy.settings.get('TitleBack') == null)
            diy.settings.set('TitleBack', String(diy.name));
    }

    legacyPortraits(diy) {
        return [[1, 'Portrait'], 'Collection', 'Encounter'];
    }

    upgrade(diy) {
        if (diy.version >= CardVersion) return;
        LegacyStoryText.upgrade(diy.settings, '');
        LegacyStoryAsset.upgrade(diy.settings, 'Back');
    }
}
