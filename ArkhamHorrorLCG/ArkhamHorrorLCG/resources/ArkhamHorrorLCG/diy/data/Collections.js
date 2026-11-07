// The collections: the basic choices, and each standard collection as
// [ name key, tag, index into the use flags ].
//
// Module: returns { basic, standard }.
define(function () {
    var o = {};
    o.basicCollectionList = ['CustomCollection', 'StrangeEons'];

    // Highest: 33 (Hemlock vale)
    o.standardCollectionList = [
        ['CarnevaleOfHorrors', 'ccarhor', 3], //  3
        ['CoreSet', 'core', 0], //  0
        ['CurseOfTheRougarou', 'ccurrou', 2], //  2
        ['EdgeOfTheEarth', 'eote', 25], // 25
        ['EdgeOfTheEarthInv', 'eotei', 26], // 26
        ['FortuneAndFolly', 'forfol', 31], // 31
        ['GuardiansOfTheAbyss', 'guaaby', 8], //  8
        ['HarveyWalters', 'harwal', 18], // 18
        ['JacquelineFine', 'jacfin', 20], // 20
        ['MachinationsThroughTime', 'mtime', 30], // 30
        ['MurderAtTheExcelsiorHotel', 'mateh', 13], // 13
        ['NathanielCho', 'natcho', 17], // 17
        ['ParallelInvestigators', 'parallel', 14], // 14
        ['Promos', 'cpromo', 27], // 27
        ['ReturnToTheCircleUndone', 'rttcu', 24], // 24
        ['ReturnToTheDunwichLegacy', 'rttdl', 9], //  9
        ['ReturnToTheForgottenAge', 'rttfa', 16], // 16
        ['ReturnToTheNightOfTheZealot', 'rtnotz', 7], //  7
        ['ReturnToThePathToCarcosa', 'rttptc', 11], // 11
        ['StellaClark', 'stecla', 21], // 21
        ['TheBlobThatAteEverything', 'blob', 15], // 15
        ['TheBlobThatAteEverythingElse', 'blobelse', 32], // 32
        ['TheCircleUndone', 'cirund', 10], // 10
        ['TheDreamEaters', 'dreeat', 12], // 12
        ['TheDunwichLegacy', 'dunleg', 1], //  1
        ['TheForgottenAge', 'forage', 5], //  5
        ['TheInnsmouthConspiracy', 'tic', 22], // 22
        ['TheLabyrinthsOfLunacy', 'lablun', 6], //  6
        ['ThePathToCarcosa', 'carcosa', 4], //  4
        ['TheScarletKeys', 'scarkey', 28], // 28
        ['TheScarletKeysInv', 'scarkeyi', 29], // 29
        ['WarOfTheOuterGods', 'cwotog', 23], // 23
        ['WinifredHabbamock', 'winhab', 19], // 19
        ['TheFeastOfHemlockVale', 'hemloc', 33], // 33
    ];

    return { basic: o.basicCollectionList, standard: o.standardCollectionList };
});
