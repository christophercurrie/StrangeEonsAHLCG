// Java classes by name, as GraalJS's Java.type gives them: from Java.type
// where the script engine has it, otherwise from Rhino's Packages. Java
// subclasses with script methods, from Java.extend or Rhino's JavaAdapter.
//
// Module: returns { type, extend }.
/* global Java, Packages, JavaAdapter */
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

    // a new instance of a subclass of the named class or interface whose
    // methods are those given; args are the constructor's, at most two
    function extend(name, methods, args) {
        var base = type(name);
        var a = args || [];
        if (a.length > 2) throw new Error('too many constructor arguments');
        if (typeof Java !== 'undefined' && Java.extend) {
            let Sub = Java.extend(base, methods);
            if (a.length === 2) return new Sub(a[0], a[1]);
            if (a.length === 1) return new Sub(a[0]);
            return new Sub();
        }
        if (a.length === 2) return new JavaAdapter(base, methods, a[0], a[1]);
        if (a.length === 1) return new JavaAdapter(base, methods, a[0]);
        return new JavaAdapter(base, methods);
    }

    return { type: type, extend: extend };
});
