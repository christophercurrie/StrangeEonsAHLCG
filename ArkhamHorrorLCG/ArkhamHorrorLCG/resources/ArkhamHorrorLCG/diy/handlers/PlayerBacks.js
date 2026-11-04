// The backs a player card can have, chosen by $BackTypeBack as legacy cards
// save it, as FaceChoiceHandler choices.
//
// Module: returns { Backs, upgrade }.
define(['faces/EncounterBackFace', 'faces/PlayerBackFace'], function (
    EncounterBackFace,
    PlayerBackFace
) {
    const Backs = [
        { id: 'Player', label: 'AHLCG-Back-Player', face: PlayerBackFace },
        {
            id: 'Encounter',
            label: 'AHLCG-Back-Encounter',
            face: EncounterBackFace,
        },
    ];

    // Some legacy cards saved the back under a missing binding suffix.
    function upgrade(settings) {
        var lost = settings.get('BackTypeundefined');
        if (lost != null) {
            settings.set('BackTypeBack', lost);
            settings.reset('BackTypeundefined');
        }
        if (settings.get('BackTypeBack') == null)
            settings.set('BackTypeBack', 'Player');
    }

    return { Backs: Backs, upgrade: upgrade };
});
