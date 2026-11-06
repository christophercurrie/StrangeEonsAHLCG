// Campaign guide editor panels: the page type and title, the page number,
// and the two portraits with their positions. Changing the page type or a
// position places the portraits again.
//
// Module: returns { title, stats, portraits }.
define([
    'faces/FaceUtils',
    'guide/GuidePage',
    'legacy/Portraits',
    'se/java',
    'se/strings',
    'se/ui',
], function (FaceUtils, GuidePage, Portraits, Java, strings, ui) {
    const Point2D = Java.type('java.awt.geom.Point2D');
    const ImageUtilities = Java.type('ca.cgjennings.graphics.ImageUtilities');
    const FACE_FRONT = 0;

    function string(key) {
        return strings.string(key);
    }

    // The page type and title; a new page type places each portrait panel's
    // portrait in its position's region, or at the origin.
    function title(
        card,
        diy,
        bindings,
        updateFaces,
        faceIndex,
        portraitPanels
    ) {
        var panel = new ui.Grid();
        panel.setTitle(string('AHLCG-Title'));
        var key = 'PageType' + card.suffix(faceIndex);

        var types = new ui.comboBox(FaceUtils.plugin().comboGuide, null);
        bindings.add(key, types, updateFaces);
        types.addActionListener(function () {
            try {
                let selected = String(types.getSelectedItem());
                // unchanged while loading
                if (selected !== String(card.get(key))) {
                    // the regions below depend on it
                    diy.settings.set(key, selected);
                    portraitPanels.forEach(function (portraitPanel, i) {
                        let region = GuidePage.portraitRegion(
                            card,
                            diy,
                            card.get('PositionPortrait' + (i + 1))
                        );
                        let portrait = portraitPanel.portrait;
                        if (region == null) {
                            portrait.pan = new Point2D.Float(0, 0);
                            portrait.scale = 1.0;
                        } else {
                            let image = portrait.image;
                            let clip = portrait.getClipDimensions();
                            portrait.pan = new Point2D.Float(
                                region.x + (region.width - clip.width) / 2,
                                region.y + (region.height - clip.height) / 2
                            );
                            portrait.scale =
                                ImageUtilities.idealCoveringScaleForImage(
                                    region.width,
                                    region.height,
                                    image.getWidth(),
                                    image.getHeight()
                                );
                        }
                        portraitPanel.portrait = portrait;
                    });
                }
                [1, 2].forEach(function (n) {
                    GuidePage.setStencil(
                        card,
                        diy,
                        card.portraits[n - 1],
                        card.get('PositionPortrait' + n),
                        selected
                    );
                });
            } catch (ex) {
                Error.handleUncaught(ex);
            }
        });
        panel.place(
            string('AHLCG-Type'),
            'align right',
            types,
            'wrap, wmin 100'
        );

        var titleField = new ui.textField('', 30);
        if (faceIndex === FACE_FRONT) diy.setNameField(titleField);
        else
            bindings.add(
                'Title' + card.suffix(faceIndex),
                titleField,
                updateFaces
            );
        panel.place(
            string('AHLCG-Title'),
            'align right',
            titleField,
            'wrap, pushx, growx'
        );
        return panel;
    }

    function stats(card, bindings, faceIndex) {
        var panel = new ui.Grid();
        panel.setTitle(string('AHLCG-BasicData'));
        var page = new ui.spinner(0, 100, 1, 1);
        bindings.add('Page' + card.suffix(faceIndex), page, [0]);
        panel.place(string('AHLCG-Page'), 'align right, gapx 10', page, 'wrap');
        return panel;
    }

    // a portrait's position list; choosing a new position, or any position
    // for a portrait not yet placed, places it
    function options(
        card,
        diy,
        bindings,
        faces,
        faceIndex,
        name,
        portraitPanel,
        list,
        mirror
    ) {
        var panel = new ui.Grid();
        panel.setTitle(string('AHLCG-Options'));
        var positions = new ui.comboBox(list, null);
        bindings.add(
            'Position' + name + card.suffix(faceIndex),
            positions,
            faces
        );

        var index = card.portraitIndex(name);
        var portrait = card.portraits[index];
        positions.addActionListener(function () {
            var selected = String(positions.getSelectedItem());
            var unplaced =
                portrait.getPanX() === 0.0 && portrait.getPanY() === 0.0;
            if (
                unplaced ||
                selected !== String(card.get('PositionPortrait' + (index + 1)))
            ) {
                GuidePage.setupPortrait(card, diy, index, selected, true);
                portraitPanel.portrait = portrait;
            }
        });
        panel.place(
            string('AHLCG-Position'),
            'align right',
            positions,
            'pushx, growx, sizegroup sp'
        );
        if (mirror != null) panel.place(mirror, 'align right');
        return panel;
    }

    // The left or top and right or bottom portraits, each with its options;
    // returns [ tab, left panel, right panel ].
    function portraits(card, diy, bindings, left, right, mirror) {
        var o = FaceUtils.plugin();
        var tab = new ui.Grid();
        tab.editorTabScrolling = true;
        var leftNeeded = left != null && left.length > 0;
        var rightNeeded = right != null && right.length > 0;
        var leftPanel = null;
        var rightPanel = null;
        var portraitTitle = string('AHLCG-Portrait');

        function add(name, portraitPanel, list, side, titled) {
            var mirrorButton = mirror
                ? Portraits.mirrorButton(card, name, portraitPanel)
                : null;
            var optionPanel = options(
                card,
                diy,
                bindings,
                [0],
                FACE_FRONT,
                name,
                portraitPanel,
                list,
                mirrorButton
            );
            if (titled)
                optionPanel.setTitle(
                    string('AHLCG-Options') + ': ' + string(side)
                );
            tab.place(portraitPanel, 'wrap, pushx, growx');
            tab.place(optionPanel, 'wrap, pushx, growx');
        }

        if (leftNeeded) {
            leftPanel = new ui.portraitPanel(
                diy,
                card.portraitIndex(left),
                rightNeeded
                    ? portraitTitle + ' : ' + string('AHLCG-LeftTop')
                    : portraitTitle
            );
            add(
                left,
                leftPanel,
                o.comboPortraitPosition1,
                'AHLCG-LeftTop',
                rightNeeded
            );
        }
        if (rightNeeded) {
            rightPanel = new ui.portraitPanel(
                diy,
                card.portraitIndex(right),
                portraitTitle
            );
            add(
                right,
                rightPanel,
                o.comboPortraitPosition2,
                'AHLCG-RightBottom',
                leftNeeded
            );
        }
        return [tab, leftPanel, rightPanel];
    }

    return { title: title, stats: stats, portraits: portraits };
});
