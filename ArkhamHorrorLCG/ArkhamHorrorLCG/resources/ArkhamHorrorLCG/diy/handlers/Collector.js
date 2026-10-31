// The card's collection, encounter set and copyright: settings, the sets offered
// in the editor, and the controls that choose them. A set is stored by name with
//   <kind>      the set; a custom set uses the kind's portrait
//   <kind>Type  -1 custom, 0 from the plug-in, n the nth user set
//
// Module: returns Collector.
define([
    'faces/FaceUtils',
    'se/common',
    'se/imageutils',
    'se/strings',
    'se/ui',
], function (FaceUtils, common, imageutils, strings, ui) {
    const Kinds = {
        Collection: {
            combo: 'comboCollection',
            types: 'collectionTypes',
            basic: 'basicCollectionList',
            standard: 'standardCollectionList',
            usedIndex: 2,
            custom: 'CustomCollection',
            defaultSetting: 'AHLCG-DefaultCollection',
            title: 'AHLCG-Collection',
            customTitle: 'AHLCG-CustomCollection',
        },
        Encounter: {
            combo: 'comboEncounter',
            types: 'encounterTypes',
            basic: 'basicEncounterList',
            standard: 'standardEncounterList',
            usedIndex: 3,
            custom: 'CustomEncounterSet',
            defaultSetting: 'AHLCG-DefaultEncounterSet',
            title: 'AHLCG-EncounterSet',
            customTitle: 'AHLCG-CustomEncounterSet',
        },
    };
    const Sides = ['Front', 'Back'];

    function userValue(name) {
        return String(name).replace(/\W/g, '');
    }

    function iconItem(item) {
        var ImageUtils = imageutils.ImageUtils;
        return new arkham.diy.ListItem(
            item,
            strings.string('AHLCG-' + item),
            ImageUtils.createIcon(
                ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'),
                24,
                24
            )
        );
    }

    // rebuilds the sets offered for a kind after one is enabled
    function updateOffered(kindName) {
        var kind = Kinds[kindName];
        var o = FaceUtils.plugin();
        var settings = common.Settings.getUser();
        var combo = [];
        var types = [];

        o[kind.basic].forEach(function (item, index) {
            combo.push(iconItem(item));
            types.push(index === 0 ? -1 : 0);
        });
        o[kind.standard].forEach(function (entry) {
            if (FaceUtils.isUsed(kindName, entry[kind.usedIndex])) {
                combo.push(iconItem(entry[0]));
                types.push(0);
            }
        });

        var userCount = settings.getInt('AHLCG-User' + kindName + 'Count', 0);
        for (let n = 1; n <= userCount; n++) {
            if (!settings.getBoolean('AHLCG-UseUser' + kindName + n)) continue;
            let name = settings.get('AHLCG-User' + kindName + 'Name' + n, '');
            try {
                let image = imageutils.ImageUtils.read(
                    settings.get('AHLCG-User' + kindName + 'Icon' + n, '')
                );
                combo.push(
                    new arkham.diy.ListItem(
                        userValue(name),
                        name,
                        imageutils.ImageUtils.createIcon(image, 24, 24)
                    )
                );
                types.push(n);
            } catch (ex) {
                // an icon that can't be read leaves the set out of the list
                if (!(ex.javaException instanceof javax.imageio.IIOException))
                    throw ex;
            }
        }

        o[kind.combo] = combo;
        o[kind.types] = types;
    }

    function enableStandard(kindName, index) {
        var settings = common.Settings.getUser();
        var key = 'AHLCG-Use' + kindName + Math.floor(index / 40 + 1);
        var used = String(settings.get(key, ''));
        var i = index % 40;
        settings.set(key, used.substring(0, i) + '1' + used.substring(i + 1));
        updateOffered(kindName);
    }

    // Sets <kind>Type from the set's name, enabling the set if it is not
    // offered. A set that no longer exists becomes custom.
    function update(diy, kindName, portrait) {
        var kind = Kinds[kindName];
        var settings = diy.settings;
        var o = FaceUtils.plugin();
        var user = common.Settings.getUser();
        var typeKey = kindName + 'Type';

        var name = String(settings.get(kindName, ''));
        if (name === 'StrangeEonsLight') {
            name = 'StrangeEons';
            settings.set(kindName, name);
        }

        if (name === kind.custom) {
            settings.set(typeKey, '-1');
            return;
        }

        if (
            o[kind.basic].some(function (item) {
                return item === name;
            })
        ) {
            settings.set(typeKey, '0');
            return;
        }

        var standard = o[kind.standard].filter(function (entry) {
            return entry[0] === name;
        })[0];
        if (standard) {
            if (!FaceUtils.isUsed(kindName, standard[kind.usedIndex]))
                enableStandard(kindName, standard[kind.usedIndex]);
            settings.set(typeKey, '0');
            return;
        }

        var userCount = user.getInt('AHLCG-User' + kindName + 'Count', 0);
        var source = String(portrait.getSource());
        for (let n = 1; n <= userCount; n++) {
            let icon = String(
                user.get('AHLCG-User' + kindName + 'Icon' + n, '')
            );
            if (
                name !==
                userValue(user.get('AHLCG-User' + kindName + 'Name' + n, ''))
            )
                continue;
            if (source !== '' && source !== icon) continue;

            if (source === '') portrait.setSource(icon);
            if (!user.getBoolean('AHLCG-UseUser' + kindName + n)) {
                user.setBoolean('AHLCG-UseUser' + kindName + n, true);
                updateOffered(kindName);
            }
            settings.set(typeKey, String(n));
            return;
        }

        settings.set(kindName, kind.custom);
        settings.set(typeKey, '-1');
    }

    // sets what the component lacks
    function setDefaults(diy, kindName, portrait) {
        var settings = diy.settings;
        var user = common.Settings.getUser();
        function missing(key, value) {
            if (settings.getOverride(key) == null) settings.set(key, value);
        }

        missing(kindName, String(user.get(Kinds[kindName].defaultSetting, '')));
        missing(kindName + 'Number', '1');
        missing('Show' + kindName + 'NumberFront', '1');
        missing('Show' + kindName + 'NumberBack', '1');
        if (kindName === 'Encounter') missing('EncounterTotal', '1');
        if (kindName === 'Collection') missing('flipSuffix', '0');

        update(diy, kindName, portrait);
    }

    function setFileFieldEnabled(panel, enabled) {
        panel.getComponents().forEach(function (component) {
            if (/TextField/.test(component.getClass().getName()))
                component.setEnabled(enabled);
        });
    }

    function numberField(columns) {
        var field = new ui.textField('', columns);
        field.setHorizontalAlignment(javax.swing.JTextField.RIGHT);
        return field;
    }

    // Returns { panel, title, controls }, a tab choosing a kind of set.
    // showFaces: the sides that draw this kind, which get a toggle.
    function createTab(
        diy,
        bindings,
        kindName,
        portraitIndex,
        portrait,
        showFaces
    ) {
        var kind = Kinds[kindName];
        var o = FaceUtils.plugin();
        var controls = [];
        var title = strings.string(kind.title);

        function bind(key, control, faces) {
            bindings.add(key, control, faces);
            controls.push(control);
        }

        var imagePanel = new ui.portraitPanel(
            diy,
            portraitIndex,
            strings.string(kind.customTitle)
        );
        var panel = new ui.Grid();
        panel.setTitle(title);

        var list = new ui.comboBox(o[kind.combo], null);
        bind(kindName, list, [0, 1]);
        list.addActionListener(function selectSet(actionEvent) {
            try {
                let type = o[kind.types][list.getSelectedIndex()];
                diy.settings.set(kindName + 'Type', String(type));
                if (type > 0) {
                    portrait.setSource(
                        common.Settings.getUser().get(
                            'AHLCG-User' + kindName + 'Icon' + type,
                            ''
                        )
                    );
                    imagePanel.updatePanel();
                }
                setFileFieldEnabled(imagePanel, type <= 0);
            } catch (ex) {
                Error.handleUncaught(ex);
            }
        });
        panel.place(
            strings.string(
                kindName === 'Encounter' ? 'AHLCG-Set' : 'AHLCG-Collection'
            ),
            'align right',
            list,
            'wrap, pushx, growx, span 3'
        );

        var number = numberField(8);
        bind(kindName + 'Number', number, [0, 1]);
        var numberLabel = strings.string(
            kindName === 'Encounter'
                ? 'AHLCG-SetNumber'
                : 'AHLCG-CollectionNumber'
        );
        if (kindName === 'Encounter') {
            let total = new ui.textField('', 4);
            bind('EncounterTotal', total, [0, 1]);
            panel.place(
                numberLabel,
                'align right',
                number,
                'align left, split 3',
                ' / ',
                'align left',
                total,
                'align left'
            );
        } else panel.place(numberLabel, 'align right', number, 'align left');

        showFaces.forEach(function (faceIndex, i) {
            let box = new ui.checkBox(
                strings.string('AHLCG-' + Sides[faceIndex]),
                true,
                null
            );
            bind('Show' + kindName + 'Number' + Sides[faceIndex], box, [0, 1]);
            panel.place(box, i === 0 ? 'align right' : 'align right, gapx 10');
        });
        panel.place('', 'wrap');

        if (kindName === 'Collection') {
            let flip = new ui.checkBox(
                strings.string('AHLCG-FlipSuffix'),
                false,
                null
            );
            bind('flipSuffix', flip, [0, 1]);
            panel.place(
                strings.string('AHLCG-Flip'),
                'align right',
                flip,
                'wrap'
            );
        } else {
            let invert = new ui.button(
                strings.string('AHLCG-Invert'),
                null,
                function invertIcon(actionEvent) {
                    let scale = portrait.getScale();
                    let rotation = portrait.getRotation();
                    let panX = portrait.getPanX();
                    let panY = portrait.getPanY();
                    portrait.setImage(
                        portrait.getSource(),
                        imageutils.ImageUtils.invert(portrait.getImage())
                    );
                    portrait.setScale(scale);
                    portrait.setRotation(rotation);
                    portrait.setPanX(panX);
                    portrait.setPanY(panY);
                }
            );
            panel.place(
                strings.string('AHLCG-Invert'),
                'align right',
                invert,
                'align right'
            );
        }

        var tab = new ui.Grid();
        tab.place(
            panel,
            'wrap, pushx, growx',
            imagePanel,
            'wrap, pushx, growx'
        );
        return { panel: tab, title: title, controls: controls };
    }

    // with keep, only sets keys the component lacks
    function setCopyrightDefaults(diy, keep) {
        var values = {
            Copyright: '',
            ShowCopyrightFront: '1',
            ShowCopyrightBack: '1',
        };
        for (let key in values) {
            if (keep && diy.settings.getOverride(key) != null) continue;
            diy.settings.set(key, values[key]);
        }
    }

    // Returns { panel, controls }, the copyright text and a toggle for each side
    // in showFaces, those that draw it.
    function createCopyrightPanel(bindings, showFaces) {
        var panel = new ui.Grid();
        panel.setTitle(strings.string('AHLCG-CopyrightTitle'));
        var field = new ui.textField('', 20);
        var controls = [field];
        bindings.add('Copyright', field, [0, 1]);

        panel.place(
            strings.string('AHLCG-Copyright'),
            'align right',
            field,
            'pushx, growx',
            new ui.tipButton(strings.string('AHLCG-CopyrightTip1')),
            'aligny top, gaptop 5'
        );
        showFaces.forEach(function (faceIndex) {
            let box = new ui.checkBox(
                strings.string('AHLCG-' + Sides[faceIndex]),
                true,
                null
            );
            bindings.add('ShowCopyright' + Sides[faceIndex], box, [0, 1]);
            controls.push(box);
            panel.place(box, 'align right');
        });
        panel.place('', 'wrap');

        return { panel: panel, controls: controls };
    }

    return {
        setCopyrightDefaults: setCopyrightDefaults,
        createCopyrightPanel: createCopyrightPanel,
        setDefaults: setDefaults,
        update: update,
        createTab: createTab,
    };
});
