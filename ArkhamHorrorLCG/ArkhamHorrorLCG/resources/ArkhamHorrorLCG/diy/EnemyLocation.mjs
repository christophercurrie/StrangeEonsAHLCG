// An enemy that is also a location, with a location on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import EnemyLocationFace from './faces/EnemyLocationFace.mjs';
import LocationFace from './faces/LocationFace.mjs';

export class EnemyLocationHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-EnemyLocation-Default',
                'AHLCG-Location-Default',
            ],
            faces: [EnemyLocationFace, LocationFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: {
                PortraitShare: '1',
                LocationIconBack: 'Circle',
                Connection1IconBack: 'None',
                Connection2IconBack: 'None',
                Connection3IconBack: 'None',
                Connection4IconBack: 'None',
                Connection5IconBack: 'None',
                Connection6IconBack: 'None',
            },
        });
    }
}
