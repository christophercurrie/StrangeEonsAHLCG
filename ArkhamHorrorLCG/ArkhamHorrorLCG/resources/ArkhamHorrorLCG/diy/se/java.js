// Java classes by name, as GraalJS's Java.type gives them: from Java.type
// where the script engine has it, otherwise from Rhino's Packages.
//
// Module: returns { type }.
/* global Java, Packages */
define(function () {
    const types = {};

    function type(name) {
        if (types[name] == null) {
            if (typeof Java !== 'undefined' && Java.type) {
                types[name] = Java.type(name);
            } else {
                types[name] = name.split('.').reduce(function (p, part) {
                    return p[part];
                }, Packages);
            }
        }
        return types[name];
    }

    return { type: type };
});
