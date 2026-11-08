// A legacy card's encounter set and collection: the user's defaults for a new
// card, and the set type, from the set's name.
//
// Settings: Encounter, EncounterNumber, EncounterTotal and EncounterType;
// Collection, CollectionNumber and CollectionType.
//
// Module: returns { setDefaultEncounter, setDefaultCollection,
// updateEncounter, updateCollection }.
import Collector from '../handlers/Collector.mjs';
import common from '../se/common.mjs';

function userDefault(key) {
    return String(common.Settings.getUser().get(key, ''));
}

function updateEncounter(card, diy) {
    Collector.update(diy, 'Encounter', card.portrait('Encounter'));
}

// a card with no collection portrait offers no user collections
function updateCollection(card, diy) {
    Collector.update(diy, 'Collection', card.portrait('Collection'));
}

function setDefaultEncounter(card, diy) {
    diy.settings.set('Encounter', userDefault('AHLCG-DefaultEncounterSet'));
    diy.settings.set('EncounterNumber', '1');
    diy.settings.set('EncounterTotal', '1');
    updateEncounter(card, diy);
}

function setDefaultCollection(card, diy) {
    diy.settings.set('Collection', userDefault('AHLCG-DefaultCollection'));
    diy.settings.set('CollectionNumber', '1');
    updateCollection(card, diy);
}

export default {
    setDefaultEncounter: setDefaultEncounter,
    setDefaultCollection: setDefaultCollection,
    updateEncounter: updateEncounter,
    updateCollection: updateCollection,
};
