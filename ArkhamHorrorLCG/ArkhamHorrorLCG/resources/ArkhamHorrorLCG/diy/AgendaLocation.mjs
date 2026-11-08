// An agenda with a location on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import AgendaFace from './faces/AgendaFace.mjs';
import LocationFace from './faces/LocationFace.mjs';

export class AgendaLocationHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Agenda-Default', 'AHLCG-Location-Default'],
            faces: [AgendaFace, LocationFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            cardDefaults: {
                LocationIconBack: 'Circle',
                Connection1IconBack: 'None',
                Connection2IconBack: 'None',
                Connection3IconBack: 'None',
                Connection4IconBack: 'None',
                Connection5IconBack: 'None',
                Connection6IconBack: 'None',
            },
            // the art's clip region was set on the card for its orientation
            upgrade: function (diy) {
                diy.settings.reset(
                    'AHLCG-Agenda-Portrait-portrait-clip-region'
                );
            },
            // the art region moved in version 18; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 18) return;
                var portrait = art[0][0];
                portrait.setPanX(portrait.getPanX() + -10);
            },
        });
    }
}
