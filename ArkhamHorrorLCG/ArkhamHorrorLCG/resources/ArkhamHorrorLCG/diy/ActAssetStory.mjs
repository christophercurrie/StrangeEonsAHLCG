// An act with a story asset on its back.
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import ActFace from './faces/ActFace.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class ActAssetStoryHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Act-Default', 'AHLCG-AssetStory-Default'],
            faces: [ActFace, AssetFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { CardClassBack: 'Story' },
            upgrade: function (diy) {
                // the art's clip region was set on the card for its orientation
                diy.settings.reset('AHLCG-Act-Portrait-portrait-clip-region');
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, 'Back');
                // a back without a title showed the component name
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
            },
            // the art region moved in version 17; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 17) return;
                var portrait = art[0][0];
                portrait.setPanX(portrait.getPanX() + 10);
            },
        });
    }
}
