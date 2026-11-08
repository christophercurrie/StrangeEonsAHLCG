// Legacy handler editor panels: titles, Concealed template, copyright, game
// text, portraits with template replacement, tint, collection and encounter
// set. Controls bind to <key><suffix> for the face given.
//
// Module: returns { title, title2, titleUnique, concealedStats, copyright,
// text, portraits, tint, collection, encounter, simpleEncounter }.
import UserImages from '../core/UserImages.mjs';
import FaceUtils from '../faces/FaceUtils.mjs';
import ImageFilters from './ImageFilters.mjs';
import Portraits from './Portraits.mjs';
import common from '../se/common.mjs';
import imageutils from '../se/imageutils.mjs';
import Java from '../se/java.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

const SwingConstants = Java.type('javax.swing.SwingConstants');
const FACE_FRONT = 0;
const FACE_BACK = 1;
// game text rows for card types with long rules
const LongRules = {
    Scenario: 18,
    Guide75: 40,
    GuideA4: 40,
    GuideLetter: 40,
};
const Guides = { Guide75: true, GuideA4: true, GuideLetter: true };

function string(key) {
    return strings.string(key);
}

function titled(key) {
    var panel = new ui.Grid();
    panel.setTitle(string(key));
    return panel;
}

// the front's title is the card's name
function bindTitle(card, diy, bindings, field, updateFaces, faceIndex) {
    if (faceIndex === FACE_FRONT) diy.setNameField(field);
    else bindings.add('Title' + card.suffix(faceIndex), field, updateFaces);
}

function placeSubtitle(card, bindings, panel, updateFaces, faceIndex) {
    var field = new ui.textField('', 30);
    bindings.add('Subtitle' + card.suffix(faceIndex), field, updateFaces);
    panel.place(
        string('AHLCG-Subtitle'),
        'align right',
        field,
        'wrap, pushx, growx'
    );
}

function title(card, diy, bindings, subtitle, updateFaces, faceIndex) {
    var panel = titled('AHLCG-Title');
    var field = new ui.textField('', 30);
    bindTitle(card, diy, bindings, field, updateFaces, faceIndex);
    panel.place(
        string('AHLCG-Title'),
        'align right',
        field,
        'wrap, pushx, growx'
    );
    if (subtitle) placeSubtitle(card, bindings, panel, updateFaces, faceIndex);
    return panel;
}

// a title of two lines
function title2(card, diy, bindings, updateFaces, faceIndex) {
    var panel = titled('AHLCG-Title');
    var area = new ui.textArea('', 2, 30);
    bindTitle(card, diy, bindings, area, updateFaces, faceIndex);
    panel.place(
        string('AHLCG-Title'),
        'align right',
        area,
        'wrap, pushx, growx'
    );
    return panel;
}

function titleUnique(card, diy, bindings, subtitle, updateFaces, faceIndex) {
    var ImageUtils = imageutils.ImageUtils;
    var panel = titled('AHLCG-Title');
    var field = new ui.textField('', 30);
    bindTitle(card, diy, bindings, field, updateFaces, faceIndex);
    var unique = new ui.toggleButton(
        '',
        ImageUtils.createIcon(
            ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-Unique.png'),
            12,
            12
        ),
        false
    );
    bindings.add('Unique' + card.suffix(faceIndex), unique, updateFaces);
    panel.place(
        string('AHLCG-Title'),
        'align right',
        unique,
        'split, wmax 35, hmin 25, hmax 25',
        field,
        'wrap, pushx, growx'
    );
    if (subtitle) placeSubtitle(card, bindings, panel, updateFaces, faceIndex);
    return panel;
}

function concealedStats(card, bindings, faceIndex) {
    var panel = titled('AHLCG-BasicData');
    var templates = new ui.comboBox(
        FaceUtils.plugin().comboConcealedTemplate,
        null
    );
    bindings.add('Template' + card.suffix(faceIndex), templates, [faceIndex]);
    panel.place(
        string('AHLCG-Template'),
        'align right, gapx 10',
        templates,
        'pushx, growx, sizegroup sp'
    );
    return panel;
}

// the copyright; selectFaces adds front and back toggles
function copyright(bindings, selectFaces, faces) {
    var panel = titled('AHLCG-CopyrightTitle');
    var field = new ui.textField('', selectFaces ? 20 : 30);
    bindings.add('Copyright', field, faces);
    if (!selectFaces) {
        panel.place(
            string('AHLCG-Copyright'),
            'align right',
            field,
            'pushx, growx',
            new ui.tipButton(string('AHLCG-CopyrightTip1')),
            'wrap, aligny top, gaptop 5'
        );
        return panel;
    }
    var front = new ui.checkBox(string('AHLCG-Front'), true, null);
    var back = new ui.checkBox(string('AHLCG-Back'), true, null);
    bindings.add('ShowCopyrightFront', front, [0]);
    bindings.add('ShowCopyrightBack', back, [1]);
    panel.place(
        string('AHLCG-Copyright'),
        'align right',
        field,
        'align left, split 3',
        front,
        'align right',
        back,
        'align right, gapx 10'
    );
    return panel;
}

// A field for each part, keyed <part><suffix><face suffix>, with its
// tips and a spacing spinner after all but the last.
function text(card, bindings, parts, suffix, faceIndex) {
    var panel = titled('AHLCG-Rules');
    var type = card.type(faceIndex);
    var faceSuffix = card.suffix(faceIndex);

    parts.forEach(function (base, index) {
        var key = base + suffix + faceSuffix;
        var field;
        var tipCount = 0;
        var horizontal = false;
        if (base === 'Traits') {
            field = new ui.textField('', 30);
            tipCount = 4;
            horizontal = true;
        } else if (base === 'Keywords') {
            field = new ui.textArea('', 6, 30);
            tipCount = 1;
        } else if (base === 'Rules') {
            field = new ui.textArea('', LongRules[type] || 6, 30);
            tipCount = Guides[type] ? 4 : 3;
        } else if (base === 'Header') {
            field = new ui.textArea('', 2, 30);
        } else if (base === 'Victory') {
            field = new ui.textArea('', 2, 30);
            tipCount = 1;
        } else field = new ui.textArea('', 6, 30);
        bindings.add(key, field, [faceIndex]);

        var label = string('AHLCG-' + base);
        if (tipCount === 0)
            panel.place(
                label,
                'aligny top, gaptop 5, align right',
                field,
                'wrap, pushx, growx'
            );
        else if (tipCount === 1)
            panel.place(
                label,
                'aligny top, gaptop 5, align right',
                field,
                'pushx, growx'
            );
        else if (!horizontal)
            panel.place(
                label,
                'spany ' + tipCount + ', aligny top, gaptop 5, align right',
                field,
                'spany ' + tipCount + ', pushx, growx'
            );
        else
            panel.place(
                label,
                'aligny top, gaptop 5, align right',
                field,
                'split' + tipCount + ', pushx, growx'
            );

        for (let tip = 1; tip <= tipCount; tip++) {
            if (string('AHLCG-' + base + 'Tip') == null) continue;
            panel.place(
                new ui.tipButton(string('AHLCG-' + base + 'Tip' + tip)),
                !horizontal || tip === tipCount
                    ? 'wrap, aligny top, gaptop 5'
                    : 'aligny top, gaptop 5'
            );
        }

        if (index + 1 < parts.length) {
            let spacing = new ui.spinner(0, 50, 1, 1);
            bindings.add(key + 'Spacing', spacing, [faceIndex]);
            panel.place(
                string('AHLCG-Spacing'),
                'align right',
                spacing,
                'wrap'
            );
        }
    });
    return panel;
}

function portraitOptions(
    card,
    bindings,
    faces,
    faceIndex,
    artist,
    mirror,
    share
) {
    var panel = titled('AHLCG-Options');
    if (share) {
        let shareBox = new ui.checkBox(
            string('AHLCG-SharePortrait'),
            true,
            null
        );
        bindings.add('PortraitShare', shareBox, faces);
        panel.place(shareBox, 'wrap, span 2');
    }
    if (artist) {
        let field = new ui.textField('', 30);
        bindings.add('Artist' + card.suffix(faceIndex), field, faces);
        panel.place(
            string('AHLCG-Artist'),
            'align right',
            field,
            'pushx, growx, sizegroup sp'
        );
    }
    if (mirror != null) panel.place(mirror, 'align right');
    return panel;
}

function replacementRow(bindings, panel, key, side, faces, placed) {
    var field = new ui.textField('', 30);
    bindings.add(key, field, faces);
    if (!placed) return;
    var select = new ui.button(string('AHLCG-Pref-Select'), null, function () {
        var filename = common.ResourceKit.showImageFileDialog(null);
        if (filename != null) field.setText(filename);
    });
    panel.place(
        string(side),
        'align right',
        field,
        'pushx, growx',
        select,
        'wrap'
    );
}

// The front and back portraits with their options, then the template
// replacement; returns [ tab, portrait panels..., replacement panel ].
function portraits(
    card,
    diy,
    bindings,
    front,
    back,
    mirror,
    share,
    backArtist
) {
    var tab = new ui.Grid();
    tab.editorTabScrolling = true;
    var result = [tab];
    var frontNeeded = front != null && front.length > 0;
    var backNeeded = back != null && back.length > 0;
    var portraitTitle = string('AHLCG-Portrait');

    function add(name, sideKey, faces, faceIndex, artist, shared, both) {
        var panel = new ui.portraitPanel(
            diy,
            card.portraitIndex(name),
            both ? portraitTitle + ' : ' + string(sideKey) : portraitTitle
        );
        var mirrorButton = mirror
            ? Portraits.mirrorButton(card, name, panel)
            : null;
        var options = portraitOptions(
            card,
            bindings,
            faces,
            faceIndex,
            artist,
            mirrorButton,
            shared
        );
        if (both)
            options.setTitle(string('AHLCG-Options') + ': ' + string(sideKey));
        tab.place(panel, 'wrap, pushx, growx');
        tab.place(options, 'wrap, pushx, growx');
        result.push(panel);
    }
    if (frontNeeded)
        add(front, 'AHLCG-Front', [0, 1], FACE_FRONT, true, false, backNeeded);
    if (backNeeded)
        add(back, 'AHLCG-Back', [1], FACE_BACK, backArtist, share, frontNeeded);

    var twoSided = String(diy.faceStyle) !== 'PLAIN_BACK';
    var replacement = titled('AHLCG-TemplateReplacement');
    replacementRow(
        bindings,
        replacement,
        'TemplateReplacement',
        'AHLCG-Front',
        [0],
        true
    );
    replacementRow(
        bindings,
        replacement,
        'TemplateReplacementBack',
        'AHLCG-Back',
        [1],
        twoSided
    );
    var bleed = new ui.checkBox(
        string('AHLCG-TemplateReplacementBleed'),
        false,
        null
    );
    bindings.add('TemplateReplacementBleed', bleed, twoSided ? [0, 1] : [0]);
    replacement.place(bleed, 'skip, span 2, wrap');
    tab.place(replacement, 'wrap, pushx, growx');
    result.push(replacement);
    return result;
}

function tint(bindings) {
    var tab = new ui.Grid();
    tab.editorTabScrolling = true;
    var panel = new ui.tintPanel();
    bindings.add('tint', panel);
    tab.place(panel, 'wrap, pushx, growx');
    return tab;
}

// A set list whose user sets fill the kind's portrait from the user's
// icon and lock its file field; also sets <kind>Type.
function setList(
    card,
    bindings,
    portraitPanel,
    kind,
    faces,
    faceIndex,
    choose
) {
    var o = FaceUtils.plugin();
    var list = new ui.comboBox(o['combo' + kind], null);
    bindings.add(kind + card.suffix(faceIndex), list, faces);
    var types = kind === 'Encounter' ? o.encounterTypes : o.collectionTypes;
    list.addActionListener(function () {
        try {
            let type = types[list.getSelectedIndex()];
            card.settings.set(kind + 'Type', type.toString());
            if (type > 0) {
                choose(
                    card.portrait(kind),
                    card.settings.get('AHLCG-User' + kind + 'Icon' + type)
                );
                portraitPanel.updatePanel();
                Portraits.setFileFieldEnabled(portraitPanel, false);
            } else Portraits.setFileFieldEnabled(portraitPanel, true);
        } catch (ex) {
            Error.handleUncaught(ex);
        }
    });
    return list;
}

function setSource(portrait, icon) {
    portrait.setSource(icon);
}

function numberField(columns) {
    var field = new ui.textField('', columns);
    field.setHorizontalAlignment(SwingConstants.RIGHT);
    return field;
}

function collection(
    card,
    bindings,
    portraitPanel,
    useSpinner,
    selectFaces,
    faces,
    faceIndex
) {
    var panel = titled('AHLCG-Collection');
    var suffix = card.suffix(faceIndex);
    var list = setList(
        card,
        bindings,
        portraitPanel,
        'Collection',
        faces,
        faceIndex,
        setSource
    );
    var number = useSpinner ? new ui.spinner(1, 999, 1, 1) : numberField(8);
    bindings.add('CollectionNumber' + suffix, number, faces);
    panel.place(
        string('AHLCG-Collection'),
        'align right',
        list,
        'wrap, pushx, growx, span 3'
    );

    if (selectFaces) {
        let front = new ui.checkBox(string('AHLCG-Front'), true, null);
        let back = new ui.checkBox(string('AHLCG-Back'), true, null);
        bindings.add('ShowCollectionNumberFront' + suffix, front, [0, 1]);
        bindings.add('ShowCollectionNumberBack' + suffix, back, [0, 1]);
        panel.place(
            string('AHLCG-CollectionNumber'),
            'align right',
            number,
            'align left',
            front,
            'align right',
            back,
            'align right, gapx 10'
        );
    } else
        panel.place(
            string('AHLCG-CollectionNumber'),
            'align right',
            number,
            'wrap'
        );

    var flip = new ui.checkBox('Flip A/B suffix', false, null);
    bindings.add('flipSuffix', flip, [false, true]);
    panel.place('Flip', 'align right', flip, 'wrap');
    return panel;
}

// An Ultimatum's user icons are inverted, as its plug-in icons are.
function encounter(
    card,
    bindings,
    portraitPanel,
    selectFaces,
    iconFaces,
    numberFaces,
    faceIndex
) {
    var panel = titled('AHLCG-EncounterSet');
    var suffix = card.suffix(faceIndex);
    var list = setList(
        card,
        bindings,
        portraitPanel,
        'Encounter',
        iconFaces,
        faceIndex,
        function (portrait, path) {
            var icon = UserImages.read(path);
            if (icon == null) return;
            if (card.type(0) === 'Ultimatum')
                icon = ImageFilters.inverted(icon);
            portrait.setImage(path, icon);
        }
    );
    var number = numberField(8);
    bindings.add('EncounterNumber' + suffix, number, numberFaces);
    var total = new ui.textField('', 4);
    bindings.add('EncounterTotal' + suffix, total, numberFaces);
    panel.place(
        string('AHLCG-Set'),
        'align right',
        list,
        'wrap, pushx, growx, span 3'
    );

    if (selectFaces) {
        let front = new ui.checkBox(string('AHLCG-Front'), true, null);
        let back = new ui.checkBox(string('AHLCG-Back'), true, null);
        bindings.add('ShowEncounterNumberFront' + suffix, front, [0, 1]);
        bindings.add('ShowEncounterNumberBack' + suffix, back, [0, 1]);
        panel.place(
            string('AHLCG-SetNumber'),
            'align right',
            number,
            'align left, split 3',
            ' / ',
            'align left',
            total,
            'align left',
            front,
            'align right',
            back,
            'align right, gapx 10'
        );
    } else
        panel.place(
            string('AHLCG-SetNumber'),
            'align right',
            number,
            'split',
            ' / ',
            'split',
            total,
            'split, wrap'
        );

    panel.place(
        'Invert',
        'align right',
        Portraits.invertButton(card, 'Encounter'),
        'align right'
    );
    return panel;
}

function simpleEncounter(card, bindings, portraitPanel, iconFaces, faceIndex) {
    var panel = titled('AHLCG-EncounterSet');
    var list = setList(
        card,
        bindings,
        portraitPanel,
        'Encounter',
        iconFaces,
        faceIndex,
        setSource
    );
    panel.place(string('AHLCG-Set'), 'align right', list, 'wrap, pushx, growx');
    return panel;
}

export default {
    title: title,
    title2: title2,
    titleUnique: titleUnique,
    concealedStats: concealedStats,
    copyright: copyright,
    text: text,
    portraits: portraits,
    tint: tint,
    collection: collection,
    encounter: encounter,
    simpleEncounter: simpleEncounter,
};
