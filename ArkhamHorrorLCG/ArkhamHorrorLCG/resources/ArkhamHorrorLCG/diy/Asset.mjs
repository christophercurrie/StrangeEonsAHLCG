// A player asset with a player or encounter card back.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import PlayerBacks from './handlers/PlayerBacks.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class AssetHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Asset-Default', 'AHLCG-AssetBack-Default'],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Asset', label: 'AHLCG-Face-asset', face: AssetFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection'],
            upgradeChoices: function (diy) {
                PlayerBacks.upgrade(diy.settings);
            },
        });
    }
}
