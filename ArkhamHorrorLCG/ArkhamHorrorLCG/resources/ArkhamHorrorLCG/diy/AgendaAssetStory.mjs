// An agenda with a story asset on its back.
import LegacyStoryAsset from './handlers/LegacyStoryAsset.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaFace from './faces/AgendaFace.mjs';
import AssetFace from './faces/AssetFace.mjs';

export class AgendaAssetStoryHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-AssetStory-Default'],
            faces: [AgendaFace, AssetFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { CardClassBack: 'Story' },
            upgrade: function (diy) {
                // the art's clip region was set on the card for its orientation
                diy.settings.reset(
                    'AHLCG-Agenda-Portrait-portrait-clip-region'
                );
                // legacy story assets were Neutral or Weakness
                LegacyStoryAsset.upgrade(diy.settings, 'Back');
                // a back without a title showed the component name
                if (diy.settings.get('TitleBack') == null)
                    diy.settings.set('TitleBack', String(diy.name));
            },
        });
    }
}
