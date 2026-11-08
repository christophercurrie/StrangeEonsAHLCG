// The encounter sets and collections offered in the editor: the basic ones,
// the standard ones the user has chosen to use, and the user's own, with their
// icons. Use flags are kept in user settings, AHLCG-Use<type><n>, 40 to a key.
//
// Module: returns { updateUsedEncounterSets, updateUsedCollections,
// storeUsedValue, loadUsedValue, createUserSettingValue }; the update
// functions set the lists and their types on the plug-in's shared object.
import UserImages from './UserImages.mjs';
import common from '../se/common.mjs';
import imageutils from '../se/imageutils.mjs';
import Java from '../se/java.mjs';
import strings from '../se/strings.mjs';

const ListItem = Java.type('ca.cgjennings.apps.arkham.diy.ListItem');
const ImageUtils = imageutils.ImageUtils;
const Settings = common.Settings;

function updateUsedEncounterSets(o) {
    var settings = Settings.getUser();

    o.comboEncounter = [];
    o.encounterTypes = [];

    o.comboEncounter = o.comboEncounter.concat(o.basicEncounterList);
    for (let index = 0; index < o.comboEncounter.length; index++) {
        let item = o.comboEncounter[index];

        o.comboEncounter[index] = new ListItem(
            item,
            strings.string('AHLCG-' + item),
            ImageUtils.createIcon(
                ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'),
                24,
                24
            )
        );

        // Custom (index == 0): -1
        // All others: 0
        if (index === 0) o.encounterTypes[index] = -1;
        else o.encounterTypes[index] = 0;
    }

    // Standard: 0
    for (let index = 0; index < o.standardEncounterList.length; index++) {
        let entry = o.standardEncounterList[index];
        let item = entry[0];

        let used = loadUsedValue('Encounter', entry[3]);

        if (used) {
            o.comboEncounter[o.comboEncounter.length] = new ListItem(
                item,
                strings.string('AHLCG-' + item),
                ImageUtils.createIcon(
                    ImageUtils.get(
                        'ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'
                    ),
                    24,
                    24
                )
            );

            o.encounterTypes[o.encounterTypes.length] = 0;
        }
    }

    var userCount = settings.getInt('AHLCG-UserEncounterCount', 0);

    // User: Settings index
    for (let index = 0; index < userCount; index++) {
        let used = settings.getBoolean('AHLCG-UseUserEncounter' + (index + 1));

        if (used) {
            let name = settings.get(
                'AHLCG-UserEncounterName' + (index + 1),
                ''
            );
            let item = createUserSettingValue(name);
            let icon = settings.get(
                'AHLCG-UserEncounterIcon' + (index + 1),
                ''
            );

            // a set whose icon can't be read is left out of the list
            let image = UserImages.read(icon);
            if (image == null) continue;

            o.comboEncounter[o.comboEncounter.length] = new ListItem(
                item,
                name,
                ImageUtils.createIcon(image, 24, 24)
            );

            o.encounterTypes[o.encounterTypes.length] = index + 1;
        }
    }
}

function updateUsedCollections(o) {
    var settings = Settings.getUser();

    o.comboCollection = [];
    o.collectionTypes = [];

    o.comboCollection = o.comboCollection.concat(o.basicCollectionList);
    for (let index = 0; index < o.comboCollection.length; index++) {
        let item = o.comboCollection[index];

        o.comboCollection[index] = new ListItem(
            item,
            strings.string('AHLCG-' + item),
            ImageUtils.createIcon(
                ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'),
                24,
                24
            )
        );

        // Custom (index == 0): -1
        // All others: 0
        if (index === 0) o.collectionTypes[index] = -1;
        else o.collectionTypes[index] = 0;
    }

    // Standard: 0
    for (let index = 0; index < o.standardCollectionList.length; index++) {
        let entry = o.standardCollectionList[index];
        let item = entry[0];

        //		let used = loadUsedValue( 'Collection', index );
        let used = loadUsedValue('Collection', entry[2]);

        if (used) {
            o.comboCollection[o.comboCollection.length] = new ListItem(
                item,
                strings.string('AHLCG-' + item),
                ImageUtils.createIcon(
                    ImageUtils.get(
                        'ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'
                    ),
                    24,
                    24
                )
            );

            o.collectionTypes[o.collectionTypes.length] = 0;
        }
    }

    var userCount = settings.getInt('AHLCG-UserCollectionCount', 0);

    // User: Settings index
    for (let index = 0; index < userCount; index++) {
        let used = settings.getBoolean('AHLCG-UseUserCollection' + (index + 1));

        if (used) {
            let name = settings.get(
                'AHLCG-UserCollectionName' + (index + 1),
                ''
            );
            let item = createUserSettingValue(name);
            let icon = settings.get(
                'AHLCG-UserCollectionIcon' + (index + 1),
                ''
            );

            // a set whose icon can't be read is left out of the list
            let image = UserImages.read(icon);
            if (image == null) continue;

            o.comboCollection[o.comboCollection.length] = new ListItem(
                item,
                name,
                ImageUtils.createIcon(image, 24, 24)
            );

            o.collectionTypes[o.collectionTypes.length] = index + 1;
        }
    }
}

function storeUsedValue(type, index, value) {
    var charToInsert = value ? '1' : '0';
    var usedIndex = Math.floor(index / 40 + 1);
    var usedString = String(
        Settings.getUser().get('AHLCG-Use' + type + usedIndex, 0)
    );

    usedString =
        usedString.substring(0, index % 40) +
        charToInsert +
        usedString.substring((index % 40) + 1);

    Settings.getUser().set('AHLCG-Use' + type + usedIndex, usedString);
}

function loadUsedValue(type, index) {
    var usedIndex = Math.floor(index / 40 + 1);
    var usedString = String(
        Settings.getUser().get('AHLCG-Use' + type + usedIndex, '')
    );

    if (usedString.length < (index % 40) + 1) return true; // set new ones to true
    if (usedString.charAt(index % 40) === '1') return true; // == '1'?
    return false;
}

function createUserSettingValue(string) {
    return String(string).replace(/\W/g, '');
}

export default {
    updateUsedEncounterSets: updateUsedEncounterSets,
    updateUsedCollections: updateUsedCollections,
    storeUsedValue: storeUsedValue,
    loadUsedValue: loadUsedValue,
    createUserSettingValue: createUserSettingValue,
};
