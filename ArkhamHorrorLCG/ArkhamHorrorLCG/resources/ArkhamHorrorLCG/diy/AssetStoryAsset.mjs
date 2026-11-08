// A story asset on each side.
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class AssetStoryAssetHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AssetStory-Default',
                'AHLCG-AssetStory-Default',
            ],
            faces: [AssetFace, AssetFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: {
                CardClass: 'Story',
                CardClassBack: 'Story',
                PortraitShare: '1',
            },
            upgrade: function (diy) {
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, '');
                LegacyStoryAsset.upgrade(diy.settings, 'Back');
                // a back without a title showed the component name
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
            },
        });
    }
}
