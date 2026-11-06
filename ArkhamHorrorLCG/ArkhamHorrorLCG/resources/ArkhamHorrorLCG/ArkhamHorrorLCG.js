/* global useLibrary, globalThis */
useLibrary('amd');
define.config({ baseUrl: 'res://ArkhamHorrorLCG/diy' });

define(['plugin/exportPlugin', 'plugin/Plugin'], function (
    exportPlugin,
    Plugin
) {
    exportPlugin(globalThis, Plugin);
});
