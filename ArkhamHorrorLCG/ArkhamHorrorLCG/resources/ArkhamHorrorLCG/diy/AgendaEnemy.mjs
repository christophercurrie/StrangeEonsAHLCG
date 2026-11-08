// An agenda with an enemy on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaFace from './faces/AgendaFace.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class AgendaEnemyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-Enemy-Default'],
            faces: [AgendaFace, EnemyFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            // the art's clip region was set on the card for its orientation
            upgrade: function (diy) {
                diy.settings.reset(
                    'AHLCG-Agenda-Portrait-portrait-clip-region'
                );
            },
        });
    }
}
