// An act, front and back.
import LegacyActAgenda from './handlers/LegacyActAgenda.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import ActBackFace from './faces/ActBackFace.mjs';
import ActFace from './faces/ActFace.mjs';

export class ActHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Act-Default', 'AHLCG-ActBack-Default'],
            faces: [ActFace, ActBackFace],
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgrade: function (diy) {
                LegacyActAgenda.upgrade(diy, 'Act');
            },
            // the art region moved in version 17; art keeps its place
            upgradeArt: function (diy, art) {
                if (diy.version >= 17) return;
                var portrait = art[0][0];
                var reversed =
                    String(diy.settings.get('Orientation')) === 'Reversed';
                portrait.setPanX(portrait.getPanX() + (reversed ? -10 : 10));
            },
        });
    }
}
