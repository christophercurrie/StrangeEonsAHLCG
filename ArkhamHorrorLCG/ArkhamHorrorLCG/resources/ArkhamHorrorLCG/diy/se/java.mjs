// Java classes by name. Application classes come from the script library's
// facades; other classes from Java.type, which allows only some packages.
// Java subclasses with script methods, from Java.extend.
//
// Module: exports { type, extend }.
import {
    FillInPreferenceCategory,
    Preferences,
    Region2D,
} from 'strange-eons/legacy/common';
import { DefaultPortrait, ListItem } from 'strange-eons/legacy/diy';
import { PageShape } from 'strange-eons/legacy/markup';

const Facades = {
    'ca.cgjennings.apps.arkham.component.DefaultPortrait': DefaultPortrait,
    'ca.cgjennings.apps.arkham.diy.ListItem': ListItem,
    'ca.cgjennings.apps.arkham.dialog.prefs.FillInPreferenceCategory':
        FillInPreferenceCategory,
    'ca.cgjennings.apps.arkham.dialog.prefs.Preferences': Preferences,
    'ca.cgjennings.layout.PageShape$CompoundShape': PageShape.CompoundShape,
    'ca.cgjennings.layout.PageShape$CupShape': PageShape.CupShape,
    'ca.cgjennings.layout.PageShape$GeometricShape': PageShape.GeometricShape,
    'ca.cgjennings.layout.PageShape$InsetShape': PageShape.InsetShape,
    'ca.cgjennings.layout.PageShape$MergedShape': PageShape.MergedShape,
    'resources.Settings$Region2D': Region2D,
};

const types = {};

function type(name) {
    if (types[name] == null) {
        types[name] = Facades[name] ?? Java.type(name);
    }
    return types[name];
}

// a new instance of a subclass of the named class or interface whose
// methods are those given; args are the constructor's
function extend(name, methods, args) {
    const Sub = Java.extend(type(name), methods);
    return new Sub(...(args || []));
}

export default { type, extend };
