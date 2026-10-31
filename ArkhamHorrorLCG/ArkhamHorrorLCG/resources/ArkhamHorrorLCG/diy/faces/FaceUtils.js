// Helpers shared by faces.
//
// Module: returns FaceUtils.
define(['se/common', 'se/strings', 'se/ui'], function (common, strings, ui) {
    const POINTS_PER_INCH = 72;
    const IconSizes = { s: '0.14in', m: '0.35in', l: '0.60in' };

    // the plug-in's shared state: fonts, offsets and icon lists
    function plugin() {
        return common.Eons.namedObjects.AHLCGObject;
    }

    function bleedPixels(sheet) {
        return Math.round(
            (sheet.getBleedMargin() / POINTS_PER_INCH) *
                sheet.getTemplateResolution()
        );
    }

    // card regions are relative to the trim edge
    function translateToTrim(g, sheet) {
        var bleed = bleedPixels(sheet);
        g.translate(bleed, bleed);
    }

    // whether an encounter set or collection is offered; sets not yet
    // recorded in the user's choices are
    function isUsed(type, index) {
        var used = String(
            common.Settings.getUser().get(
                'AHLCG-Use' + type + Math.floor(index / 40 + 1),
                ''
            )
        );
        var i = index % 40;
        return used.length < i + 1 || used.charAt(i) === '1';
    }

    function setIconTags(box, tag, image) {
        for (let size in IconSizes) {
            box.setReplacementForTag(
                tag + size,
                '<image ' + image + ' ' + IconSizes[size] + ' baseline>'
            );
        }
    }

    function setUserIconTags(box, type) {
        var settings = common.Settings.getUser();
        var count = settings.getInt('AHLCG-User' + type + 'Count', 0);
        for (let i = 1; i <= count; i++) {
            if (!settings.getBoolean('AHLCG-UseUser' + type + i, true))
                continue;
            let tag = String(
                settings.get('AHLCG-User' + type + 'Tag' + i)
            ).toLowerCase();
            setIconTags(
                box,
                tag,
                '"' + settings.get('AHLCG-User' + type + 'Icon' + i) + '"'
            );
        }
    }

    // tags for card text: symbols, styles, encounter and collection icons
    function initBodyTags(diy, box) {
        var settings = diy.settings;
        var o = plugin();

        for (let i = 0; i < o.TagList.length; i++) {
            let item = o.TagList[i];
            let replacement = settings.get(item + '-tag-replacement');
            if (replacement != null && replacement.startsWith('#')) {
                replacement = strings.gstring(replacement.substring(1));
            }
            box.setReplacementForTag(settings.get(item + '-tag'), replacement);
        }

        for (let i = 0; i < o.StyleList.length; i++) {
            let item = o.StyleList[i];
            box.setStyleForTag(
                settings.get(item + '-tag'),
                settings.getTextStyle(item + '-style', null)
            );
        }

        box.setReplacementForTag('bultab', '     ');

        for (let i = 0; i < o.standardEncounterList.length; i++) {
            let entry = o.standardEncounterList[i];
            if (isUsed('Encounter', entry[3])) {
                setIconTags(
                    box,
                    entry[2],
                    'res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png'
                );
            }
        }
        setUserIconTags(box, 'Encounter');

        for (let i = 0; i < o.standardCollectionList.length; i++) {
            let entry = o.standardCollectionList[i];
            if (isUsed('Collection', entry[2])) {
                setIconTags(
                    box,
                    entry[1],
                    'res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png'
                );
            }
        }
        setUserIconTags(box, 'Collection');

        for (let i = 0; i < o.locationIcons.length; i++) {
            let item = o.locationIcons[i];
            box.setReplacementForTag(
                settings.get('Loc' + item + '-tag'),
                '<image res://ArkhamHorrorLCG/icons/AHLCG-Loc' +
                    item +
                    '.png 0.14in center>'
            );
        }
    }

    function initCopyrightTags(diy, box) {
        plugin().CopyrightTagList.forEach(function (item) {
            box.setReplacementForTag(
                diy.settings.get(item + '-tag'),
                diy.settings.get(item + '-tag-replacement')
            );
        });
    }

    // Game text fields for parts (Traits, Header, Rules or another name),
    // keyed <part><partSuffix> and bound by face, with spacing spinners between
    // them.
    function createTextPanel(
        face,
        bindings,
        faceIndex,
        parts,
        partSuffix,
        rulesRows
    ) {
        var panel = new ui.Grid();
        panel.setTitle(strings.string('AHLCG-Rules'));

        for (let i = 0; i < parts.length; i++) {
            let base = parts[i];
            let key = base + partSuffix;
            let label = strings.string('AHLCG-' + base);
            let field;
            let tipCount = 0;
            let inlineTips = false;

            switch (base) {
                case 'Traits':
                    field = new ui.textField('', 30);
                    tipCount = 4;
                    inlineTips = true;
                    break;
                case 'Header':
                    field = new ui.textArea('', 2, 30);
                    break;
                case 'Rules':
                    field = new ui.textArea('', rulesRows, 30);
                    tipCount = 3;
                    break;
                default:
                    field = new ui.textArea('', 6, 30);
                    break;
            }
            face.bind(bindings, faceIndex, key, field);

            if (tipCount === 0) {
                panel.place(
                    label,
                    'aligny top, gaptop 5, align right',
                    field,
                    'wrap, pushx, growx'
                );
            } else if (inlineTips) {
                panel.place(
                    label,
                    'aligny top, gaptop 5, align right',
                    field,
                    'split' + tipCount + ', pushx, growx'
                );
            } else {
                panel.place(
                    label,
                    'spany ' + tipCount + ', aligny top, gaptop 5, align right',
                    field,
                    'spany ' + tipCount + ', pushx, growx'
                );
            }

            for (let tip = 1; tip <= tipCount; tip++) {
                let button = new ui.tipButton(
                    strings.string('AHLCG-' + base + 'Tip' + tip)
                );
                let wrap = !inlineTips || tip === tipCount;
                panel.place(
                    button,
                    (wrap ? 'wrap, ' : '') + 'aligny top, gaptop 5'
                );
            }

            if (i + 1 < parts.length) {
                let spacing = new ui.spinner(0, 50, 1, 1);
                face.bind(bindings, faceIndex, key + 'Spacing', spacing);
                panel.place(
                    strings.string('AHLCG-Spacing'),
                    'align right',
                    spacing,
                    'wrap'
                );
            }
        }

        return panel;
    }

    return {
        createTextPanel: createTextPanel,
        plugin: plugin,
        isUsed: isUsed,
        bleedPixels: bleedPixels,
        translateToTrim: translateToTrim,
        initBodyTags: initBodyTags,
        initCopyrightTags: initCopyrightTags,
    };
});
