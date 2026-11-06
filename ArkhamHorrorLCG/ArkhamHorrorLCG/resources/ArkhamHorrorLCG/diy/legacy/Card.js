// A legacy handler's card: its settings, each face's card type and binding
// suffix, and its portraits, by the names in its portrait type list
// (<name>-Front, -Back or -Both).
//
// Module: returns Card.
define(function () {
    // card types that fall back to another type's settings
    const Subtypes = {
        AgendaPortrait: 'Agenda',
        WeaknessEnemy: 'Enemy',
        WeaknessTreachery: 'Treachery',
        ChaosStory: 'Chaos',
        StoryChaos: 'Chaos',
        StoryChaosFull: 'Chaos',
        KeyBack: 'Key',
    };

    function Card(settings, types, suffixes, portraitTypes, portraits) {
        this.settings = settings;
        this.types = types;
        this.suffixes = suffixes;
        this.portraitTypes = portraitTypes;
        this.portraits = portraits;
    }

    // a setting as a string, or null
    Card.prototype.get = function (key) {
        var value = this.settings.get(key);
        return value == null ? null : String(value);
    };

    Card.prototype.type = function (faceIndex) {
        return this.types[faceIndex];
    };

    Card.prototype.suffix = function (faceIndex) {
        return this.suffixes[faceIndex];
    };

    // AHLCG-<type>-<key>, AHLCG-<subtype>-<key> or AHLCG-<key>: the first
    // whose <key><appendix> setting exists
    Card.prototype.key = function (faceIndex, key, appendix) {
        var type = this.types[faceIndex];
        var tail = key + (appendix == null ? '' : appendix);
        if (this.settings.get('AHLCG-' + type + '-' + tail) != null)
            return 'AHLCG-' + type + '-' + key;
        var subtype = Subtypes[type];
        if (
            subtype &&
            this.settings.get('AHLCG-' + subtype + '-' + tail) != null
        )
            return 'AHLCG-' + subtype + '-' + key;
        return 'AHLCG-' + key;
    };

    // the index of the named portrait, or null
    Card.prototype.portraitIndex = function (name) {
        for (let i = 0; i < this.portraitTypes.length; i++)
            if (this.portraitTypes[i].split('-')[0] === name) return i;
        return null;
    };

    Card.prototype.portrait = function (name) {
        return this.portraits[this.portraitIndex(name)];
    };

    return Card;
});
