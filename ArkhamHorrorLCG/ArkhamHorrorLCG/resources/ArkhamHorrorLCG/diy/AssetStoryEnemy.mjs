// A story asset with an enemy on its back.
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AssetFace from './faces/AssetFace.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class AssetStoryEnemyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-AssetStory-Default', 'AHLCG-Enemy-Default'],
            faces: [AssetFace, EnemyFace],
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
