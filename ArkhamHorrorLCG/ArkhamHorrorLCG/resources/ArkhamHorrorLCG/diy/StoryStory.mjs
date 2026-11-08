// Story pages on both sides: a story page or a token page, chosen by
// $Template and $TemplateBack; the back can also be a player or encounter
// card back.
//
// Cards saved before version 31 have legacy story text (see
// handlers/LegacyStoryText) and a ChaosFull page type for a full token page.
import CardVersion from './handlers/CardVersion.mjs';
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import LegacyStoryText from './handlers/LegacyStoryText.mjs';
import StoryPages from './handlers/StoryPages.mjs';
import EncounterBackFace from './faces/EncounterBackFace.mjs';
import PlayerBackFace from './faces/PlayerBackFace.mjs';

const Suffixes = ['', 'Back'];
const Settings = ['Template', 'TemplateBack'];
// the legacy template key, which saved cards keep
const TemplateKey = 'AHLCG-Story-Default';
const Pages = StoryPages.Pages;
const Backs = Pages.concat([
    { id: 'Player', label: 'AHLCG-Back-Player', face: PlayerBackFace },
    {
        id: 'Encounter',
        label: 'AHLCG-Back-Encounter',
        face: EncounterBackFace,
    },
]);

export class StoryStoryHandler extends FaceChoiceHandler {
    constructor() {
        super({
            templateKeys: [TemplateKey, TemplateKey],
            settings: Settings,
            choices: [Pages, Backs],
            title: 'AHLCG-Template',
        });
    }

    upgradeChoices(diy) {
        Settings.forEach(function (setting, faceIndex) {
            StoryPages.upgrade(diy.settings, setting, Suffixes[faceIndex]);
        });
    }

    legacyPortraits(diy) {
        return ['Collection', 'Encounter'];
    }

    upgrade(diy) {
        if (diy.version >= CardVersion) return;
        Suffixes.forEach(function (suffix) {
            LegacyStoryText.upgrade(diy.settings, suffix);
        });
    }
}
