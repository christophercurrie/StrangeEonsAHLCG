// A key, front and back.
import ShimHandler from './handlers/ShimHandler.mjs';
import KeyFace from './faces/KeyFace.mjs';

export class KeyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Key-Default', 'AHLCG-KeyBack-Default'],
            faces: [KeyFace, KeyFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { PortraitShare: '1' },
            upgrade: function (diy) {
                var settings = diy.settings;
                if (diy.version < 2) settings.set('PortraitShare', '0');
                // a back without a title kept its own unique symbol
                if (
                    settings.get('TitleBack') == null &&
                    String(settings.get('UniqueBack', '0')) !==
                        String(settings.get('Unique', '0'))
                )
                    settings.set('TitleBack', String(diy.name));
            },
        });
    }
}
