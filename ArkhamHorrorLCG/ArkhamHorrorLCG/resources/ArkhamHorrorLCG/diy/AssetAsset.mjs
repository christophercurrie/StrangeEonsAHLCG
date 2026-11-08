// A player asset on each side.
import ShimHandler from './handlers/ShimHandler.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class AssetAssetHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Asset-Default', 'AHLCG-Asset-Default'],
            faces: [AssetFace, AssetFace],
            legacyPortraits: [[0, 'Portrait'], [1, 'Portrait'], 'Collection'],
            // a back without a title showed the component name
            upgrade: function (diy) {
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
            },
        });
    }
}
