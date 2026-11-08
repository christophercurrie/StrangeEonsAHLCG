// The preferences' default fonts: a family, size and vertical offset for each
// kind of text, and the language option that turns act and agenda back titles.
// Settings are stored only once a control has changed.
//
// Settings: AHLCG-Default<kind>Font, -FontSize and -FontOffset;
// AHLCG-DefaultRotateTitle; AHLCG-FontsEdited marks an edit, so that a restart
// is asked for.
//
// Module: returns { create, layout, layoutLanguage, load, store }.
import FontUtils from '../se/fontutils.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

const Kinds = [
    'Title',
    'Subtitle',
    'CardType',
    'Body',
    'Trait',
    'Victory',
    'Flavor',
    'Story',
    'Collection',
];

function create() {
    var fonts = { changed: false, rows: {} };
    var families = FontUtils.availableFontFamilies();
    families.splice(0, 0, 'Default');
    function modified() {
        fonts.changed = true;
    }
    Kinds.forEach(function (kind) {
        fonts.rows[kind] = {
            family: ui.comboBox(families, modified),
            size: ui.spinner(1, 200, 1, 100, modified),
            offset: ui.spinner(-10, 10, 1, 0, modified),
        };
    });
    fonts.rotateTitle = ui.checkBox(
        strings.string('AHLCG-Pref-RotateTitle'),
        true,
        modified
    );
    return fonts;
}

function layout(pc, fonts) {
    pc.heading(strings.string('AHLCG-Pref-DefaultFonts'));
    pc.join();
    pc.addTip(strings.string('AHLCG-PrefDefaultFontsTip'));
    Kinds.forEach(function (kind) {
        var row = fonts.rows[kind];
        pc.label(strings.string('AHLCG-Pref-' + kind + 'Font'));
        pc.indent();
        pc.addUnmanagedControl(row.family);
        pc.join();
        pc.label(strings.string('AHLCG-Pref-Size'));
        pc.join();
        pc.addUnmanagedControl(row.size);
        pc.join();
        pc.label(strings.string('AHLCG-Pref-VerticalOffset'));
        pc.join();
        pc.addUnmanagedControl(row.offset);
        pc.unindent();
    });
}

function layoutLanguage(pc, fonts) {
    pc.heading(strings.string('AHLCG-Pref-LanguageOptions'));
    pc.indent();
    pc.addUnmanagedControl(fonts.rotateTitle);
    pc.join();
    pc.unindent();
}

function key(kind, part) {
    return 'AHLCG-Default' + kind + 'Font' + part;
}

// selects the family by name, or Default
function selectFamily(box, name) {
    var index = 0;
    for (let i = 0; i < box.getItemCount(); i++) {
        if (String(box.getItemAt(i)) === name) {
            index = i;
            break;
        }
    }
    box.setSelectedIndex(index);
}

function load(fonts, settings) {
    Kinds.forEach(function (kind) {
        var row = fonts.rows[kind];
        selectFamily(
            row.family,
            String(settings.get(key(kind, ''), 'Default'))
        );
    });
    Kinds.forEach(function (kind) {
        fonts.rows[kind].size.setValue(
            parseInt(String(settings.get(key(kind, 'Size'), '100')))
        );
    });
    Kinds.forEach(function (kind) {
        fonts.rows[kind].offset.setValue(
            parseInt(String(settings.get(key(kind, 'Offset'), '0')))
        );
    });
    fonts.rotateTitle.setSelected(
        settings.getBoolean('AHLCG-DefaultRotateTitle', true)
    );
    settings.reset('AHLCG-FontsEdited');
    fonts.changed = false;
}

function store(fonts, settings) {
    if (!fonts.changed) return;
    Kinds.forEach(function (kind) {
        var row = fonts.rows[kind];
        settings.set(key(kind, ''), String(row.family.getSelectedItem()));
        settings.set(key(kind, 'Size'), String(row.size.getValue()));
        settings.set(key(kind, 'Offset'), String(row.offset.getValue()));
    });
    settings.setBoolean(
        'AHLCG-DefaultRotateTitle',
        fonts.rotateTitle.isSelected()
    );
    // a reset key is needed to ask for a restart; the font keys can't be
    // used, as they would always report a change
    settings.setBoolean('AHLCG-FontsEdited', true);
}

export default {
    create: create,
    layout: layout,
    layoutLanguage: layoutLanguage,
    load: load,
    store: store,
};
