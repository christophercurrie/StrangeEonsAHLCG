// A weakness enemy with a player card back.
import ShimHandler from './handlers/ShimHandler.mjs';
import EnemyFace from './faces/EnemyFace.mjs';
import PlayerBackFace from './faces/PlayerBackFace.mjs';

export class WeaknessEnemyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-WeaknessEnemy-Default',
                'AHLCG-WeaknessEnemyBack-Default',
            ],
            faces: [EnemyFace, PlayerBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { Subtype: 'BasicWeakness' },
        });
    }
}
