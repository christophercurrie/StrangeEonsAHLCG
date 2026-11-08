// An enemy with art on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import EnemyFace from './faces/EnemyFace.mjs';
import PortraitFace from './faces/PortraitFace.mjs';

export class EnemyPortraitHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Enemy-Default', 'AHLCG-BackPortrait-Default'],
            faces: [EnemyFace, PortraitFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
        });
    }
}
