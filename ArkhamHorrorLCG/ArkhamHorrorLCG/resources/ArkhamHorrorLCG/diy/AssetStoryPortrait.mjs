// A story asset with art on its back.
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AssetFace from './faces/AssetFace.mjs';
import PortraitFace from './faces/PortraitFace.mjs';

export class AssetStoryPortraitHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AssetStory-Default',
                'AHLCG-BackPortrait-Default',
            ],
            faces: [AssetFace, PortraitFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { CardClass: 'Story' },
            upgrade: function (diy) {
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, '');
            },
        });
    }
}
