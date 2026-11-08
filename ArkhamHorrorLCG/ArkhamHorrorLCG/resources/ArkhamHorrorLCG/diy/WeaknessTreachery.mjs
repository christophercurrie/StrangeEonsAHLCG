// A weakness treachery with a player card back.
import ShimHandler from './handlers/ShimHandler.mjs';
import PlayerBackFace from './faces/PlayerBackFace.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';

export class WeaknessTreacheryHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-WeaknessTreachery-Default',
                'AHLCG-WeaknessTreacheryBack-Default',
            ],
            faces: [TreacheryFace, PlayerBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            cardDefaults: { Subtype: 'BasicWeakness' },
        });
    }
}
