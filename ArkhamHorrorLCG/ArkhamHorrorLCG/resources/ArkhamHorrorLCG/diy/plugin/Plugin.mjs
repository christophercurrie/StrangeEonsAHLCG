// The plug-in: registers the game, its settings, strings and class map, and
// the shared object and preferences category.
//
// Module: returns { getName, getDescription, getVersion, getPluginType,
// initialize }.
import PluginInfo from '../core/PluginInfo.mjs';
import GameObject from './GameObject.mjs';
import PreferenceCategory from '../prefs/Category.mjs';
import StyleSettings from '../core/StyleSettings.mjs';
import common from '../se/common.mjs';
import extension from '../se/extension.mjs';

// settings files under ArkhamHorrorLCG/settings, in load order
const SettingsFiles = [
    'AHLCG-Handlers',
    'AHLCG-Game',
    'AHLCG-Templates',
    'AHLCG-Asset',
    'AHLCG-Event',
    'AHLCG-Skill',
    'AHLCG-Investigator',
    'AHLCG-Enemy',
    'AHLCG-WeaknessEnemy',
    'AHLCG-Treachery',
    'AHLCG-TreacheryLocation',
    'AHLCG-WeaknessTreachery',
    'AHLCG-Location',
    'AHLCG-EnemyLocation',
    'AHLCG-Agenda',
    'AHLCG-Act',
    'AHLCG-Chaos',
    'AHLCG-Ultimatum',
    'AHLCG-AssetStory',
    'AHLCG-AgendaPortrait',
    'AHLCG-MiniInvestigator',
    'AHLCG-Scenario',
    'AHLCG-BackPortrait',
    'AHLCG-Story',
    'AHLCG-Guide75',
    'AHLCG-GuideA4',
    'AHLCG-Divider',
    'AHLCG-AgendaFrontPortrait',
    'AHLCG-Customizable',
    'AHLCG-GuideLetter',
    'AHLCG-Key',
    'faces/Face',
    'faces/StoryFace',
    'faces/TokenRulesFace',
    'faces/ScenarioRulesFace',
    'faces/PlayerBackFace',
    'faces/EncounterBackFace',
    'faces/EnemyFace',
    'faces/TreacheryFace',
    'faces/AssetFace',
    'faces/EventFace',
    'faces/SkillFace',
    'faces/CustomizableFace',
    'faces/CustomizableBackFace',
    'faces/LocationFace',
    'faces/LocationBackFace',
    'faces/KeyFace',
    'faces/InvestigatorFace',
    'faces/InvestigatorBackFace',
    'faces/ActFace',
    'faces/ActBackFace',
    'faces/AgendaFace',
    'faces/AgendaBackFace',
    'faces/AgendaFrontPortraitFace',
    'faces/AgendaPortraitFace',
    'faces/PortraitFace',
    'faces/TreacheryLocationFace',
    'faces/EnemyLocationFace',
    'AHLCG-Concealed',
    'AHLCG-PackCover',
    'AHLCG-BoxCover',
];

function initialize() {
    common.Language.getInterface().addStrings(
        'ArkhamHorrorLCG/text/AHLCG-Interface'
    );
    common.Language.getGame().addStrings('ArkhamHorrorLCG/text/AHLCG-Game');

    const game = extension.Game.register(
        'AHLCG',
        'AHLCG-ArkhamHorrorLCG',
        PluginInfo.image('AHLCG-Game', 'icons', 'png')
    );
    SettingsFiles.forEach(function (file) {
        game.masterSettings.addSettingsFrom(
            'ArkhamHorrorLCG/settings/' + file + '.settings'
        );
    });

    const o = GameObject.create(game.masterSettings);
    common.Eons.namedObjects.AHLCGObject = o;
    StyleSettings.expand(game.masterSettings, o);
    try {
        PreferenceCategory.register(common.Eons.namedObjects.AHLCGObject);
    } catch (ex) {
        Error.handleUncaught(ex);
    }

    extension.ClassMap.add('ArkhamHorrorLCG/ArkhamHorrorLCG.classmap');
}

export default {
    getName: PluginInfo.name,
    getDescription: PluginInfo.description,
    getVersion: PluginInfo.version,
    getPluginType: extension.getPluginType,
    initialize: initialize,
};
