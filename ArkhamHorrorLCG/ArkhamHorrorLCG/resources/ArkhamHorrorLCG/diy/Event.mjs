// A player event with a player or encounter card back.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import PlayerBacks from './handlers/PlayerBacks.mjs';
import EventFace from './faces/EventFace.mjs';

export class EventHandler extends FaceChoiceHandler {
    constructor() {
        super({
            // the legacy template keys, which saved cards keep
            templateKeys: ['AHLCG-Event-Default', 'AHLCG-EventBack-Default'],
            settings: [null, 'BackTypeBack'],
            choices: [
                [{ id: 'Event', label: 'AHLCG-Face-event', face: EventFace }],
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
