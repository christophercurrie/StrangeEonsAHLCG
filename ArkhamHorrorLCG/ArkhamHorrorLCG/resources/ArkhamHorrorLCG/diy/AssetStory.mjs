// A story asset, an asset of the Story or StoryWeakness class, with a
// player or encounter card back.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import PlayerBacks from './handlers/PlayerBacks.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class AssetStoryHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AssetStory-Default',
                'AHLCG-AssetStoryBack-Default',
            ],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Asset', label: 'AHLCG-Face-asset', face: AssetFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { CardClass: 'Story' },
            // legacy story assets were Neutral or Weakness
            upgrade: function (diy) {
                LegacyStoryAsset.upgrade(diy.settings, '');
            },
            upgradeChoices: function (diy) {
                PlayerBacks.upgrade(diy.settings);
            },
        });
    }
}
