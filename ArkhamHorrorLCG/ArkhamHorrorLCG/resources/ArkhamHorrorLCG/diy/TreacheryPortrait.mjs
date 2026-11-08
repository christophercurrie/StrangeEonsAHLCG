// A treachery with art on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';
import PortraitFace from './faces/PortraitFace.mjs';

export class TreacheryPortraitHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Treachery-Default',
                'AHLCG-BackPortrait-Default',
            ],
            faces: [TreacheryFace, PortraitFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
        });
    }
}
