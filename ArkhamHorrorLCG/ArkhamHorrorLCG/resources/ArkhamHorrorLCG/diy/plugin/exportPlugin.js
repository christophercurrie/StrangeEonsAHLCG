// Exports a plug-in object as the script functions Strange Eons calls for a
// plug-in. Strange Eons looks each function up by name when it calls it, so
// the exported functions forward to the object's methods.
//
// Module: returns exportPlugin( scope, plugin ), where scope is the plug-in
// script's global scope.
define([], function () {
    // the plug-in script functions
    const PluginMethods = [
        'getName',
        'getDescription',
        'getVersion',
        'getPluginType',
        'initialize',
        'unload',
        'run',
        'isShowing',
        'isUsable',
        'getDefaultAcceleratorKey',
        'showWithoutEditor',
    ];

    return function exportPlugin(scope, plugin) {
        PluginMethods.forEach(function (name) {
            if (typeof plugin[name] !== 'function') return;
            scope[name] = function () {
                return plugin[name].apply(plugin, arguments);
            };
        });
    };
});
