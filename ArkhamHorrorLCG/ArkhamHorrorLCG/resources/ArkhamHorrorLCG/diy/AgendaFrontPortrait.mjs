// An agenda with full art on its front.
import LegacyActAgenda from './handlers/LegacyActAgenda.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaBackFace from './faces/AgendaBackFace.mjs';
import AgendaFrontPortraitFace from './faces/AgendaFrontPortraitFace.mjs';

export class AgendaFrontPortraitHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-AgendaFrontPortrait-Default',
                'AHLCG-AgendaBack-Default',
            ],
            faces: [AgendaFrontPortraitFace, AgendaBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'AgendaFrontPortrait');
            },
        });
    }
}
