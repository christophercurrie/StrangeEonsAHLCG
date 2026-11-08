// An agenda, front and back.
import LegacyActAgenda from './handlers/LegacyActAgenda.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaBackFace from './faces/AgendaBackFace.mjs';
import AgendaFace from './faces/AgendaFace.mjs';

export class AgendaHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-AgendaBack-Default'],
            faces: [AgendaFace, AgendaBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'Agenda');
            },
        });
    }
}
