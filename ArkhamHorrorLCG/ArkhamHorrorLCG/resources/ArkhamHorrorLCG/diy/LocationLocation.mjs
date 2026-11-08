// A location revealed on both sides; the back copies the front's icons
// unless set.
import ShimHandler from './handlers/ShimHandler.mjs';
import LocationFace from './faces/LocationFace.mjs';

export class LocationLocationHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Location-Default', 'AHLCG-Location-Default'],
            faces: [LocationFace, LocationFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: { PortraitShare: '1' },
        });
    }
}
