// An investigator: class art front and deckbuilding back.
import InvestigatorSections from './handlers/InvestigatorSections.mjs';
import ShimHandler from './handlers/ShimHandler.mjs';
import InvestigatorBackFace from './faces/InvestigatorBackFace.mjs';
import InvestigatorFace from './faces/InvestigatorFace.mjs';

export class InvestigatorHandler extends ShimHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: [
                'AHLCG-Investigator-Default',
                'AHLCG-InvestigatorBack-Default',
            ],
            faces: [InvestigatorFace, InvestigatorBackFace],
            legacyPortraits: [
                [0, 'TransparentPortrait'],
                [1, 'Portrait'],
                'Collection',
            ],
            upgrade: function (diy) {
                var settings = diy.settings;
                if (diy.version < 10) settings.set('Unique', '1');
                if (diy.version < 12) InvestigatorSections.upgrade(settings);
            },
        });
    }
}
