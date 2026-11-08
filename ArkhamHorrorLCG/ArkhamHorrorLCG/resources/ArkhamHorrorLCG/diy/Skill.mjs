// A player skill with a player or encounter card back.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import PlayerBacks from './handlers/PlayerBacks.mjs';
import SkillFace from './faces/SkillFace.mjs';

export class SkillHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Skill-Default', 'AHLCG-SkillBack-Default'],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Skill', label: 'AHLCG-Face-skill', face: SkillFace }],
                PlayerBacks.Backs,
            ],
            title: 'AHLCG-Template',
            legacyPortraits: [[0, 'Portrait'], 'Collection', 'Encounter'],
            upgradeChoices: function (diy) {
                PlayerBacks.upgrade(diy.settings);
            },
        });
    }
}
