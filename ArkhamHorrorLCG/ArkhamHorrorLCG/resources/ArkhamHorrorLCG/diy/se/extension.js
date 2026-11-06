// Strange Eons extension library: game registration and the extension
// plug-in type.
//
// Module: returns { Game, ClassMap, getPluginType }.
/* global useLibrary, Game, ClassMap, getPluginType */
useLibrary('extension');

define(function () {
    return {
        Game: Game,
        ClassMap: ClassMap,
        getPluginType: getPluginType,
    };
});
