// A treachery that is also a location, with an encounter card back.
import ShimHandler from './handlers/ShimHandler.mjs';
import EncounterBackFace from './faces/EncounterBackFace.mjs';
import TreacheryLocationFace from './faces/TreacheryLocationFace.mjs';

export class TreacheryLocationHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-TreacheryLocation-Default',
                'AHLCG-TreacheryBack-Default',
            ],
            faces: [TreacheryLocationFace, EncounterBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
        });
    }
}
