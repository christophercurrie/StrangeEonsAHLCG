// An enemy with an encounter card back.
import FaceHandler from './handlers/FaceHandler.mjs';
import EncounterBackFace from './faces/EncounterBackFace.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class EnemyHandler extends FaceHandler {
    constructor() {
        super(
            // the legacy template keys, which saved cards keep
            {
                templateKeys: [
                    'AHLCG-Enemy-Default',
                    'AHLCG-EnemyBack-Default',
                ],
            },
            new EnemyFace(),
            new EncounterBackFace()
        );
    }

    legacyPortraits(diy) {
        return [[0, 'Portrait'], 'Collection', 'Encounter'];
    }
}
