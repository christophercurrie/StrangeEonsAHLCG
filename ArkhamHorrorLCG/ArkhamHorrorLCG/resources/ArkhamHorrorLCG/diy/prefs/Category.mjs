// The plug-in's preferences category: default values, encounter sets,
// collections, default fonts and language options, in user settings.
//
// Module: returns { register }.
import SetCatalog from '../core/SetCatalog.mjs';
import Defaults from './Defaults.mjs';
import Fonts from './Fonts.mjs';
import SetTables from './SetTables.mjs';
import common from '../se/common.mjs';
import Java from '../se/java.mjs';
import strings from '../se/strings.mjs';

const Preferences = Java.type(
    'ca.cgjennings.apps.arkham.dialog.prefs.Preferences'
);

// registers the category for the plug-in's shared object
function register(o) {
    var defaults = Defaults.create(o);
    var encounters = SetTables.create(SetTables.Encounter);
    var collections = SetTables.create(SetTables.Collection);
    var fonts = Fonts.create();

    function load() {
        var settings = common.Settings.getUser();
        Defaults.load(defaults, settings);
        SetTables.load(o, encounters, settings);
        SetTables.load(o, collections, settings);
        Defaults.select(
            defaults.encounter,
            settings.get('AHLCG-DefaultEncounterSet')
        );
        Defaults.select(
            defaults.collection,
            settings.get('AHLCG-DefaultCollection')
        );
        Fonts.load(fonts, settings);
    }

    function store() {
        var settings = common.Settings.getUser();
        Defaults.store(defaults, settings);
        SetTables.store(o, encounters, settings);
        SetTables.store(o, collections, settings);
        SetCatalog.updateUsedEncounterSets(o);
        SetCatalog.updateUsedCollections(o);
        Fonts.store(fonts, settings);
    }

    var pc = Java.extend(
        'ca.cgjennings.apps.arkham.dialog.prefs.FillInPreferenceCategory',
        { loadSettings: load, storeSettings: store },
        [strings.string('AHLCG'), 'ArkhamHorrorLCG/icons/AHLCG-GameL.png']
    );

    Defaults.layout(pc, defaults);
    [
        [encounters, defaults.encounter],
        [collections, defaults.collection],
    ].forEach(function (pair) {
        function changed() {
            Defaults.refresh(o, pair[1], pair[0]);
        }
        pair[0].standard.addTableModelListener(changed);
        pair[0].user.addTableModelListener(changed);
    });
    SetTables.layout(pc, encounters);
    SetTables.layout(pc, collections);
    Fonts.layout(pc, fonts);
    Fonts.layoutLanguage(pc, fonts);
    pc.addResetKeys('AHLCG-FontsEdited');

    Preferences.registerCategory(pc);
    return pc;
}

export default { register: register };
