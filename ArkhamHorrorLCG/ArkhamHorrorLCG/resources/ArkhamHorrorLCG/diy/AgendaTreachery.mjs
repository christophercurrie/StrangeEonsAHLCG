// An agenda with a treachery on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaFace from './faces/AgendaFace.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';

export class AgendaTreacheryHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-Treachery-Default'],
            faces: [AgendaFace, TreacheryFace],
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
            // the art region moved in version 17; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 17) return;
                var portrait = art[0][0];
                portrait.setPanX(portrait.getPanX() + -10);
            },
        });
    }
}
