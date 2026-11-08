// An act with an enemy on its back.
import ShimHandler from './handlers/ShimHandler.mjs';
import ActFace from './faces/ActFace.mjs';
import EnemyFace from './faces/EnemyFace.mjs';

export class ActEnemyHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Act-Default', 'AHLCG-Enemy-Default'],
            faces: [ActFace, EnemyFace],
            legacyPortraits: [
                [0, 'Portrait'],
                [1, 'Portrait'],
                'Collection',
                'Encounter',
            ],
            // the art's clip region was set on the card for its orientation
            upgrade: function (diy) {
                diy.settings.reset('AHLCG-Act-Portrait-portrait-clip-region');
            },
            // the art region moved in version 17; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 17) return;
                var portrait = art[0][0];
                portrait.setPanX(portrait.getPanX() + 10);
            },
        });
    }
}
