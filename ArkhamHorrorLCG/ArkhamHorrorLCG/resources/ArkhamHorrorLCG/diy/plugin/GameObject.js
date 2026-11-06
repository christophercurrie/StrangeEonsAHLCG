// The plug-in's shared object, Eons.namedObjects.AHLCGObject: the fonts,
// editor lists, sets, tag lists, text shapes and tints that cards share.
//
// Module: returns { create }, where create( masterSettings ) makes the
// object.
define([
    'core/Choices',
    'core/SetCatalog',
    'core/TagLists',
    'core/TextShapes',
    'core/Tints',
    'core/Typography',
    'data/Collections',
    'data/EncounterSets',
    'se/common',
    'se/java',
], function (
    Choices,
    SetCatalog,
    TagLists,
    TextShapes,
    Tints,
    Typography,
    Collections,
    EncounterSets,
    common,
    Java
) {
    const System = Java.type('java.lang.System');
    const Locale = Java.type('java.util.Locale');

    function GameObject(masterSettings) {
        var o = this;
        o.OS = 'Windows';
        var systemOS = String(
            System.getProperty('os.name', 'generic')
        ).toLowerCase(Locale.ENGLISH);
        if (systemOS.indexOf('mac') >= 0 || systemOS.indexOf('darwin') >= 0)
            o.OS = 'Mac';

        Typography.apply(o);

        // template image setting keys, by image path, to find the image key of
        // a face template setting
        o.templateKeys = {};
        var templates = new common.Settings();
        templates.addSettingsFrom(
            'ArkhamHorrorLCG/settings/AHLCG-Templates.settings'
        );
        for (let it = templates.getKeySet().iterator(); it.hasNext();) {
            let key = String(it.next());
            o.templateKeys[templates.get(key)] = key;
        }

        Choices.apply(o);
        o.basicEncounterList = EncounterSets.basic;
        o.standardEncounterList = EncounterSets.standard;
        o.basicCollectionList = Collections.basic;
        o.standardCollectionList = Collections.standard;
        o.encounterTypes = [];
        o.collectionTypes = [];
        SetCatalog.updateUsedEncounterSets(o);
        SetCatalog.updateUsedCollections(o);
        TagLists.apply(o);
        TextShapes.install(o);
        Tints.install(o);
    }

    function create(masterSettings) {
        return new GameObject(masterSettings);
    }

    return { create: create };
});
