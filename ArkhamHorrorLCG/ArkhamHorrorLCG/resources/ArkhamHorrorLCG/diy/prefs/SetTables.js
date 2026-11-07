// The preferences' encounter set and collection tables: for each kind, the
// standard sets with their use flags and the user's own sets, the buttons that
// check, uncheck and delete them, and the panel that adds a user set.
//
// Settings: AHLCG-Use<kind><n> holds the standard use flags, 40 to a key;
// AHLCG-User<kind>Count, AHLCG-User<kind>Name<n>, -Icon<n> and -Tag<n> the
// user's sets, and AHLCG-UseUser<kind><n> whether each is used.
//
// Module: returns { Encounter, Collection, create, layout, load, store,
// addChecked }.
define([
    'core/SetCatalog',
    'core/UserImages',
    'se/common',
    'se/java',
    'se/strings',
], function (SetCatalog, UserImages, common, Java, strings) {
    const ListItem = Java.type('ca.cgjennings.apps.arkham.diy.ListItem');
    const JBoolean = Java.type('java.lang.Boolean');
    const JString = Java.type('java.lang.String');
    const JResizableTable = Java.type('ca.cgjennings.ui.table.JResizableTable');
    const JScrollPane = Java.type('javax.swing.JScrollPane');
    const JPanel = Java.type('javax.swing.JPanel');
    const JLabel = Java.type('javax.swing.JLabel');
    const JTextField = Java.type('javax.swing.JTextField');
    const JButton = Java.type('javax.swing.JButton');
    const JComponent = Java.type('javax.swing.JComponent');
    const Box = Java.type('javax.swing.Box');
    const BoxLayout = Java.type('javax.swing.BoxLayout');
    const BorderFactory = Java.type('javax.swing.BorderFactory');
    const Dimension = Java.type('java.awt.Dimension');
    const Color = Java.type('java.awt.Color');

    function string(key) {
        return strings.string(key);
    }

    function collectionFor(o, id) {
        var list = o.standardCollectionList;
        for (let i = 0; i < list.length; i++)
            if (list[i][2] === id) return list[i];
        return null;
    }

    const Encounter = {
        key: 'Encounter',
        standardList: function (o) {
            return o.standardEncounterList;
        },
        basicList: function (o) {
            return o.basicEncounterList;
        },
        flag: 3,
        standardTag: 3,
        standardColumns: ['AHLCG-Pref-Cycle', 'AHLCG-Pref-Tag'],
        standardWidths: [20, 250, 200, 70],
        standardRow: function (o, entry) {
            return [
                string('AHLCG-' + entry[0]),
                string('AHLCG-' + collectionFor(o, entry[1])[0]),
                entry[2],
            ];
        },
        labels: {
            heading: 'AHLCG-Pref-EncounterSets',
            tip: 'AHLCG-PrefEncounterTip',
            standard: 'AHLCG-Pref-StandardSets',
            user: 'AHLCG-Pref-UserSets',
            check: 'AHLCG-Pref-CheckSets',
            uncheck: 'AHLCG-Pref-UncheckSets',
            remove: 'AHLCG-Pref-DeleteSets',
            removePrompt: 'AHLCG-Pref-PermanentlyRemoveSets',
            removeTitle: 'AHLCG-Pref-RemoveSets',
            addPanel: 'AHLCG-Pref-AddCustomSet',
            add: 'AHLCG-Pref-AddSet',
        },
        messages: {
            name: 'Please enter an encounter set name',
            icon: 'Please enter an encounter set icon filename',
            tag: 'Please enter an encounter set tag',
            nameUsed: 'Encounter set name is already being used.',
            tagUsed: 'Encounter set tag is already being used.',
        },
    };

    const Collection = {
        key: 'Collection',
        standardList: function (o) {
            return o.standardCollectionList;
        },
        basicList: function (o) {
            return o.basicCollectionList;
        },
        flag: 2,
        standardTag: 2,
        standardColumns: ['AHLCG-Pref-Tag'],
        standardWidths: [20, 450, 70],
        standardRow: function (o, entry) {
            return [string('AHLCG-' + entry[0]), entry[1]];
        },
        labels: {
            heading: 'AHLCG-Pref-Collections',
            tip: 'AHLCG-PrefCollectionTip',
            standard: 'AHLCG-Pref-StandardCollections',
            user: 'AHLCG-Pref-UserCollections',
            check: 'AHLCG-Pref-CheckCollections',
            uncheck: 'AHLCG-Pref-UncheckCollections',
            remove: 'AHLCG-Pref-DeleteCollections',
            removePrompt: 'AHLCG-Pref-PermanentlyRemoveCollections',
            removeTitle: 'AHLCG-Pref-RemoveCollections',
            addPanel: 'AHLCG-Pref-AddCustomCollection',
            add: 'AHLCG-Pref-AddCollection',
        },
        messages: {
            name: 'Please enter a collection name',
            icon: 'Please enter a collection icon filename',
            tag: 'Please enter a collection tag',
            nameUsed: 'Collection name is already being used.',
            tagUsed: 'Collection tag is already being used.',
        },
    };

    const UserColumns = ['AHLCG-Pref-Icon', 'AHLCG-Pref-Tag'];
    const UserWidths = [20, 150, 300, 70];
    const UserTag = 3;

    // a table model whose first column is an editable check box
    function model(columns) {
        var m = Java.extend('javax.swing.table.DefaultTableModel', {
            getColumnClass: function (index) {
                return index === 0 ? JBoolean : JString;
            },
            getColumnCount: function () {
                return columns.length + 2;
            },
            isCellEditable: function (row, column) {
                return column === 0;
            },
        });
        m.setColumnIdentifiers(
            ['', string('AHLCG-Pref-Name')].concat(columns.map(string))
        );
        return m;
    }

    function table(m, widths) {
        var t = new JResizableTable(m);
        widths.forEach(function (w, i) {
            t.getColumnModel().getColumn(i).setPreferredWidth(w);
        });
        t.setAutoCreateRowSorter(true);
        return t;
    }

    function scrollPane(t) {
        var pane = new JScrollPane(t);
        pane.setPreferredSize(new Dimension(520, 175));
        pane.getViewport().setBackground(Color.white);
        return pane;
    }

    function isChecked(m, row) {
        return String(m.getValueAt(row, 0)) === 'true';
    }

    function isUnchecked(m, row) {
        return String(m.getValueAt(row, 0)) === 'false';
    }

    // the kind's standard and user tables
    function create(kind) {
        var standard = model(kind.standardColumns);
        var user = model(UserColumns);
        return {
            kind: kind,
            standard: standard,
            user: user,
            standardTable: table(standard, kind.standardWidths),
            userTable: table(user, UserWidths),
        };
    }

    // adds the checked sets to a list of sets: standard, then user
    function addChecked(o, tables, box) {
        var list = tables.kind.standardList(o);
        var standard = tables.standard;
        for (
            let row = 0;
            row < list.length && row < standard.getRowCount();
            row++
        ) {
            if (!isChecked(standard, row)) continue;
            let name = list[row][0];
            box.addItem(new ListItem(name, string('AHLCG-' + name)));
        }
        var user = tables.user;
        for (let row = 0; row < user.getRowCount(); row++) {
            if (!isChecked(user, row)) continue;
            let name = String(user.getValueAt(row, 1));
            box.addItem(
                new ListItem(SetCatalog.createUserSettingValue(name), name)
            );
        }
    }

    function selectedModelRows(t) {
        var selected = t.getSelectedRows();
        var rows = [];
        for (let i = 0; i < selected.length; i++)
            rows.push(t.convertRowIndexToModel(selected[i]));
        return rows;
    }

    function setChecked(t, checked) {
        var rows = selectedModelRows(t);
        if (rows.length === 0) return;
        var m = t.getModel();
        rows.forEach(function (row) {
            m.setValueAt(checked, row, 0);
        });
        m.fireTableDataChanged();
    }

    function removeSelected(t, prompt, title) {
        var rows = selectedModelRows(t);
        if (rows.length === 0 || !common.confirm(prompt, title)) return;
        var m = t.getModel();
        rows.sort(function (a, b) {
            return a - b;
        });
        for (let i = rows.length - 1; i >= 0; i--) m.removeRow(rows[i]);
        m.fireTableDataChanged();
    }

    function same(a, b) {
        return String(a) === String(b);
    }

    // whether a new user set is complete and its name and tag are free
    function verify(tables, name, icon, tag) {
        var messages = tables.kind.messages;
        function fail(message) {
            common.alert(message);
            return false;
        }
        if (name.length === 0) return fail(messages.name);
        if (icon.length === 0) return fail(messages.icon);
        if (tag.length === 0) return fail(messages.tag);

        if (!UserImages.exists(icon)) return fail('Could not open icon image');

        var key = SetCatalog.createUserSettingValue(name);
        var nameUsed = false;
        var tagUsed = false;
        [
            [tables.standard, tables.kind.standardTag],
            [tables.user, UserTag],
        ].forEach(function (pair) {
            var m = pair[0];
            for (let row = 0; row < m.getRowCount(); row++) {
                let other = m.getValueAt(row, 1);
                if (same(name, other)) nameUsed = true;
                if (key === SetCatalog.createUserSettingValue(other))
                    nameUsed = true;
                if (same(tag, m.getValueAt(row, pair[1]))) tagUsed = true;
            }
        });
        if (nameUsed) return fail(messages.nameUsed);
        if (tagUsed) return fail(messages.tagUsed);
        return true;
    }

    function row(panel, top, bottom, children) {
        var p = new JPanel();
        p.setLayout(new BoxLayout(p, BoxLayout.LINE_AXIS));
        p.setBackground(Color.white);
        p.setBorder(BorderFactory.createEmptyBorder(top, 10, bottom, 10));
        children.forEach(function (c) {
            p.add(
                typeof c === 'number'
                    ? Box.createRigidArea(new Dimension(c, 0))
                    : c
            );
        });
        panel.add(p);
    }

    // the name, tag and image fields and the button that adds a user set
    function addPanel(tables) {
        var nameLabel = new JLabel(string('AHLCG-Pref-Name'));
        nameLabel.setAlignmentX(JComponent.LEFT_ALIGNMENT);
        var name = new JTextField(20);
        var tag = new JTextField(5);
        var icon = new JTextField(30);

        var select = new JButton(string('AHLCG-Pref-Select'));
        select.addActionListener(function () {
            var filename = common.ResourceKit.showImageFileDialog(null);
            if (filename != null) icon.setText(filename);
        });

        var add = new JButton(string(tables.kind.labels.add));
        add.addActionListener(function () {
            var n = String(name.getText());
            var i = String(icon.getText());
            var t = String(tag.getText());
            if (!verify(tables, n, i, t)) return;
            tables.user.addRow([true, n, i, t]);
            tables.user.fireTableDataChanged();
            name.setText('');
            icon.setText('');
            tag.setText('');
        });

        var outer = new JPanel();
        outer.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        outer.setLayout(new BoxLayout(outer, BoxLayout.PAGE_AXIS));
        var white = new JPanel();
        white.setLayout(new BoxLayout(white, BoxLayout.PAGE_AXIS));
        white.setBackground(Color.white);
        row(white, 10, 0, [
            nameLabel,
            5,
            name,
            10,
            new JLabel(string('AHLCG-Pref-Tag')),
            5,
            tag,
        ]);
        row(white, 10, 10, [
            new JLabel(string('AHLCG-Pref-Image')),
            5,
            icon,
            5,
            select,
        ]);
        row(white, 0, 10, [add]);
        outer.add(white);
        return outer;
    }

    // the kind's section of the preferences category
    function layout(pc, tables) {
        var labels = tables.kind.labels;
        function checkButtons(t) {
            pc.addButton(string(labels.check), function () {
                setChecked(t, true);
            });
            pc.join();
            pc.addButton(string(labels.uncheck), function () {
                setChecked(t, false);
            });
        }

        pc.heading(string(labels.heading));
        pc.join();
        pc.addTip(string(labels.tip));
        pc.indent();

        pc.label(string(labels.standard));
        pc.addUnmanagedControl(scrollPane(tables.standardTable));
        checkButtons(tables.standardTable);

        pc.label(string(labels.user));
        pc.addUnmanagedControl(scrollPane(tables.userTable));
        checkButtons(tables.userTable);
        pc.join();
        pc.addButton(string(labels.remove), function () {
            removeSelected(
                tables.userTable,
                string(labels.removePrompt),
                string(labels.removeTitle)
            );
        });

        pc.label(string(labels.addPanel));
        pc.addUnmanagedControl(addPanel(tables));
    }

    function userKey(kind, part, n) {
        return 'AHLCG-User' + kind.key + part + n;
    }

    // fills the tables from settings
    function load(o, tables, settings) {
        var kind = tables.kind;
        tables.standard.setRowCount(0);
        tables.user.setRowCount(0);
        kind.standardList(o).forEach(function (entry) {
            var used = SetCatalog.loadUsedValue(kind.key, entry[kind.flag]);
            tables.standard.addRow([used].concat(kind.standardRow(o, entry)));
        });

        var count = settings.getInt('AHLCG-User' + kind.key + 'Count', 0);
        for (let n = 1; n <= count; n++) {
            tables.user.addRow([
                settings.getBoolean('AHLCG-UseUser' + kind.key + n, true),
                String(settings.get(userKey(kind, 'Name', n), '')),
                String(settings.get(userKey(kind, 'Icon', n), '')),
                String(settings.get(userKey(kind, 'Tag', n), '')),
            ]);
        }
    }

    // writes the tables to settings, removing user sets past the last
    function store(o, tables, settings) {
        var kind = tables.kind;
        var list = kind.standardList(o);
        var flags = '';
        var n = 1;
        for (let index = 0; index < list.length; index++) {
            // the row whose use flag is at this index
            let row = -1;
            for (let i = 0; i < list.length; i++) {
                if (list[i][kind.flag] === index) {
                    row = i;
                    break;
                }
            }
            if (row < 0) continue;
            flags += isUnchecked(tables.standard, row) ? '0' : '1';
            if (flags.length >= 40) {
                settings.set('AHLCG-Use' + kind.key + n, flags);
                n++;
                flags = '';
            }
        }
        if (flags.length > 0) settings.set('AHLCG-Use' + kind.key + n, flags);

        var user = tables.user;
        var count = user.getRowCount();
        settings.setInt('AHLCG-User' + kind.key + 'Count', count);
        for (let r = 0; r < count; r++) {
            settings.set(
                userKey(kind, 'Name', r + 1),
                String(user.getValueAt(r, 1))
            );
            settings.set(
                userKey(kind, 'Icon', r + 1),
                String(user.getValueAt(r, 2))
            );
            settings.set(
                userKey(kind, 'Tag', r + 1),
                String(user.getValueAt(r, 3))
            );
            settings.setBoolean(
                'AHLCG-UseUser' + kind.key + (r + 1),
                !isUnchecked(user, r)
            );
        }
        for (
            let stale = count + 1;
            settings.get(userKey(kind, 'Name', stale)) != null;
            stale++
        ) {
            ['Name', 'Icon', 'Tag'].forEach(function (part) {
                settings.reset(userKey(kind, part, stale));
            });
            settings.reset('AHLCG-UseUser' + kind.key + stale);
        }
    }

    return {
        Encounter: Encounter,
        Collection: Collection,
        create: create,
        layout: layout,
        load: load,
        store: store,
        addChecked: addChecked,
    };
});
