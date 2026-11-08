// A treachery with an encounter card back.
import ShimHandler from './handlers/ShimHandler.mjs';
import EncounterBackFace from './faces/EncounterBackFace.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';

export class TreacheryHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Treachery-Default',
                'AHLCG-TreacheryBack-Default',
            ],
            faces: [TreacheryFace, EncounterBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
        });
    }
}
