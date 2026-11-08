// The plug-in's shared object, Eons.namedObjects.AHLCGObject: the fonts,
// editor lists, sets, tag lists, text shapes and tints that cards share.
//
// Module: returns { create }, where create( masterSettings ) makes the
// object.
import Choices from '../core/Choices.mjs';
import SetCatalog from '../core/SetCatalog.mjs';
import TagLists from '../core/TagLists.mjs';
import TextShapes from '../core/TextShapes.mjs';
import Tints from '../core/Tints.mjs';
import Typography from '../core/Typography.mjs';
import Collections from '../data/Collections.mjs';
import EncounterSets from '../data/EncounterSets.mjs';
import common from '../se/common.mjs';
import Java from '../se/java.mjs';

const PlatformSupport = Java.type('ca.cgjennings.platform.PlatformSupport');

class GameObject {
    constructor(masterSettings) {
        var o = this;
        o.OS = PlatformSupport.PLATFORM_IS_MAC ? 'Mac' : 'Windows';

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
}

function create(masterSettings) {
    return new GameObject(masterSettings);
}

export default { create: create };
