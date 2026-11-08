// A story page, or a token page, chosen by $Template, with a location on the
// back.
//
// Cards saved before version 31 have legacy story text on the front (see
// handlers/LegacyStoryText), a ChaosFull page type for a full token page, and
// the location art under the legacy key.
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import LocationFace from './faces/LocationFace.mjs';

export class StoryLocationHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Story-Default', 'AHLCG-Location-Default'],
            settings: ['Template', null],
            choices: [
                StoryPages.Pages,
                [
                    {
                        id: 'Location',
                        label: 'AHLCG-Face-location',
                        face: LocationFace,
                    },
                ],
            ],
            title: 'AHLCG-Template',
            cardDefaults: {
                LocationIconBack: 'Circle',
                Connection1IconBack: 'None',
                Connection2IconBack: 'None',
                Connection3IconBack: 'None',
                Connection4IconBack: 'None',
                Connection5IconBack: 'None',
                Connection6IconBack: 'None',
            },
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
