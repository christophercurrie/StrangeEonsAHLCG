// A card whose faces are chosen in the editor. $FrontFace and $BackFace hold
// the chosen face ids; any face can be used on either side.
import FaceChoiceHandler from './handlers/FaceChoiceHandler.mjs';
import PlayerBackFace from './faces/PlayerBackFace.mjs';
import EncounterBackFace from './faces/EncounterBackFace.mjs';
import EnemyFace from './faces/EnemyFace.mjs';
import ScenarioRulesFace from './faces/ScenarioRulesFace.mjs';
import StoryFace from './faces/StoryFace.mjs';
import TokenRulesFace from './faces/TokenRulesFace.mjs';
import TreacheryFace from './faces/TreacheryFace.mjs';
import AssetFace from './faces/AssetFace.mjs';
import EventFace from './faces/EventFace.mjs';
import SkillFace from './faces/SkillFace.mjs';
import CustomizableFace from './faces/CustomizableFace.mjs';
import CustomizableBackFace from './faces/CustomizableBackFace.mjs';
import LocationFace from './faces/LocationFace.mjs';
import LocationBackFace from './faces/LocationBackFace.mjs';
import KeyFace from './faces/KeyFace.mjs';
import InvestigatorFace from './faces/InvestigatorFace.mjs';
import InvestigatorBackFace from './faces/InvestigatorBackFace.mjs';
import ActFace from './faces/ActFace.mjs';
import ActBackFace from './faces/ActBackFace.mjs';
import AgendaFace from './faces/AgendaFace.mjs';
import AgendaBackFace from './faces/AgendaBackFace.mjs';
import AgendaFrontPortraitFace from './faces/AgendaFrontPortraitFace.mjs';
import AgendaPortraitFace from './faces/AgendaPortraitFace.mjs';
import PortraitFace from './faces/PortraitFace.mjs';
import TreacheryLocationFace from './faces/TreacheryLocationFace.mjs';
import EnemyLocationFace from './faces/EnemyLocationFace.mjs';

// face ids, in menu order, and their faces
const Faces = {
    playerBack: PlayerBackFace,
    encounterBack: EncounterBackFace,
    enemy: EnemyFace,
    scenarioRules: ScenarioRulesFace,
    story: StoryFace,
    tokenRules: TokenRulesFace,
    treachery: TreacheryFace,
    asset: AssetFace,
    event: EventFace,
    skill: SkillFace,
    customizable: CustomizableFace,
    customizableBack: CustomizableBackFace,
    location: LocationFace,
    locationBack: LocationBackFace,
    key: KeyFace,
    investigator: InvestigatorFace,
    investigatorBack: InvestigatorBackFace,
    act: ActFace,
    actBack: ActBackFace,
    agenda: AgendaFace,
    agendaBack: AgendaBackFace,
    agendaFrontPortrait: AgendaFrontPortraitFace,
    agendaPortrait: AgendaPortraitFace,
    portrait: PortraitFace,
    treacheryLocation: TreacheryLocationFace,
    enemyLocation: EnemyLocationFace,
};

const Choices = Object.keys(Faces).map(function (id) {
    return { id: id, label: 'AHLCG-Face-' + id, face: Faces[id] };
});

export class FlexibleHandler extends FaceChoiceHandler {
    constructor() {
        super({
            templateKeys: [
                'AHLCG-FlexibleHandler-Front',
                'AHLCG-FlexibleHandler-Back',
            ],
            settings: ['FrontFace', 'BackFace'],
            choices: [Choices, Choices],
            defaults: ['playerBack', 'encounterBack'],
            title: 'AHLCG-Faces',
        });
    }
}
