// An enemy on each side.
import ShimHandler from './handlers/ShimHandler.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class EnemyEnemyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Enemy-Default', 'AHLCG-Enemy-Default'],
            faces: [EnemyFace, EnemyFace],
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
