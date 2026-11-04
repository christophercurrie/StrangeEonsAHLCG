// Card handler that dispatches to a front and back face (diy/faces).
// Subclasses pass their configuration and faces to the constructor and export
// an instance with handlers/exportHandler.
//
// diy.version is handlers/CardVersion, written on create and read.
//
// config:
//   templateKeys  [ front, back ] template keys of the component; each face's
//                 template settings are copied to them, since the component's
//                 template keys can't change after create
//
// Subclasses may override setCardDefaults( diy ) for extra card-level
// defaults, upgrade( diy ) for version steps when reading older saves, before
// the portraits are read and while diy.version is the saved version, and
// createGeneralPanels( diy, editor, bindings ).
//
// Module: returns FaceHandler.
define([
    'handlers/CardVersion',
    'handlers/Collector',
    'handlers/TemplateReplacement',
    'se/diy',
    'se/imageutils',
    'se/strings',
    'se/ui',
    'ui/Bindings',
], function (
    CardVersion,
    Collector,
    TemplateReplacement,
    diyLibrary,
    imageutils,
    strings,
    ui,
    Bindings
) {
    const FACE_FRONT = 0;
    const FACE_BACK = 1;
    const GeneralHint = 'wrap, pushx, growx';

    function FaceHandler(config, front, back) {
        this.version = CardVersion;
        this.templateKeys = config.templateKeys;

        this.faces = [front, back];
        this.boxes = [null, null];
        // each side's art portraits, in the order of its face's portraits
        this.art = [[], []];
        // the kinds of set the faces draw, and a portrait for each custom icon
        this.portraitKinds = [];
        this.portraits = [];

        // the open editor: its bindings, General tab panel and tab, and what
        // each side added to them
        this.editor = null;
        this.bindings = null;
        this.generalPanel = null;
        this.generalTab = null;
        this.sideInterfaces = [null, null];
        this.collectorTabs = [];
        this.copyright = null;
        this.templatePanel = null;
    }

    FaceHandler.prototype.setFace = function (faceIndex, face) {
        this.faces[faceIndex] = face;
        this.boxes[faceIndex] = null;
    };

    FaceHandler.prototype.setCardDefaults = function (diy) {};

    FaceHandler.prototype.upgrade = function (diy) {};

    FaceHandler.prototype.setFaceTemplates = function (diy) {
        for (let i = 0; i < this.faces.length; i++) {
            let face = this.faces[i];
            let key = this.templateKeys[i];
            diy.settings.set(
                key + '-template',
                diy.settings.get(face.template + '-template')
            );
            diy.settings.set(key + '-bleed-margin', String(face.bleedMargin));
            if (face.dpi != null)
                diy.settings.set(key + '-dpi', String(face.dpi));
            else diy.settings.reset(key + '-dpi');
        }
    };

    // panels placed first on the General tab
    FaceHandler.prototype.createGeneralPanels = function (
        diy,
        editor,
        bindings
    ) {
        return [];
    };

    FaceHandler.prototype.usesKind = function (faceIndex, kind) {
        return kind === 'Collection'
            ? this.faces[faceIndex].usesCollection
            : this.faces[faceIndex].usesEncounter;
    };

    FaceHandler.prototype.createArtPortrait = function (diy, key, faceIndex) {
        var portrait = new arkham.component.DefaultPortrait(diy, key, true);
        // the back's also updates the front, as the portrait panel needs
        portrait.facesToUpdate =
            faceIndex === FACE_FRONT ? [FACE_FRONT] : [FACE_FRONT, FACE_BACK];
        portrait.backgroundFilled = true;
        portrait.installDefault();
        return portrait;
    };

    // Matches the art portraits to what the faces draw. Portraits still in
    // use are kept.
    FaceHandler.prototype.updateArt = function (diy) {
        this.art = this.faces.map(function (face, faceIndex) {
            var current = this.art[faceIndex];
            return face.portraits.map(function (name) {
                let key = face.portraitKey(faceIndex, name);
                let kept = current.filter(function (portrait) {
                    return String(portrait.getBaseKey()) === key;
                });
                return kept.length > 0
                    ? kept[0]
                    : this.createArtPortrait(diy, key, faceIndex);
            }, this);
        }, this);
    };

    // art portraits first, front then back, then those of the sets
    FaceHandler.prototype.allPortraits = function () {
        return this.art[FACE_FRONT].concat(this.art[FACE_BACK], this.portraits);
    };

    // the portrait of a kind of set, or null
    FaceHandler.prototype.findPortrait = function (kind) {
        var index = this.portraitKinds.indexOf(kind);
        return index < 0 ? null : this.portraits[index];
    };

    FaceHandler.prototype.createPortrait = function (diy, kind) {
        var portrait = new arkham.component.DefaultPortrait(
            diy,
            'AHLCG-Face-' + kind,
            true
        );
        portrait.facesToUpdate = [FACE_FRONT, FACE_BACK];
        portrait.backgroundFilled = false;
        portrait.installDefault();
        return portrait;
    };

    // Matches the portraits and set settings to what the faces draw. Portraits
    // still in use are kept.
    FaceHandler.prototype.updateCollector = function (diy) {
        this.updateArt(diy);
        var kinds = ['Collection', 'Encounter'].filter(function (kind) {
            return (
                this.usesKind(FACE_FRONT, kind) ||
                this.usesKind(FACE_BACK, kind)
            );
        }, this);
        var portraits = kinds.map(function (kind) {
            return this.findPortrait(kind) || this.createPortrait(diy, kind);
        }, this);

        this.portraitKinds = kinds;
        this.portraits = portraits;
        kinds.forEach(function (kind, i) {
            Collector.setDefaults(diy, kind, portraits[i]);
        });
        if (this.copyrightFaces().length > 0) {
            Collector.setCopyrightDefaults(diy, true);
        }
        if (this.templateReplacementFaces().length > 0) {
            TemplateReplacement.setDefaults(diy, true);
        }
    };

    // the sides that offer an image to replace the template
    FaceHandler.prototype.templateReplacementFaces = function () {
        return [FACE_FRONT, FACE_BACK].filter(function (faceIndex) {
            return this.faces[faceIndex].usesTemplateReplacement;
        }, this);
    };

    // the sides that draw the card's copyright
    FaceHandler.prototype.copyrightFaces = function () {
        return [FACE_FRONT, FACE_BACK].filter(function (faceIndex) {
            return this.faces[faceIndex].usesCopyright;
        }, this);
    };

    // Adds a tab for each kind of set a face draws, after the sides' tabs, and
    // the copyright and template replacement panels, after the sides' panels,
    // if a face uses them.
    FaceHandler.prototype.addCollectorInterface = function (diy) {
        var tabPane = this.editor.getTabbedPane();
        var index =
            tabPane.indexOfComponent(this.generalTab) +
            1 +
            this.sideInterfaces[FACE_FRONT].tabs.length +
            this.sideInterfaces[FACE_BACK].tabs.length;

        this.portraitKinds.forEach(function (kind, i) {
            let faces = [FACE_FRONT, FACE_BACK].filter(function (faceIndex) {
                return this.usesKind(faceIndex, kind);
            }, this);
            let tab = Collector.createTab(
                diy,
                this.bindings,
                kind,
                this.art[FACE_FRONT].length + this.art[FACE_BACK].length + i,
                this.portraits[i],
                faces
            );
            tab.panel.editorTabScrolling = true;
            tab.panel.addToEditor(
                this.editor,
                tab.title,
                null,
                null,
                index + i
            );
            this.collectorTabs.push({
                component: tabPane.getComponentAt(index + i),
                controls: tab.controls,
            });
        }, this);

        var copyrightFaces = this.copyrightFaces();
        if (copyrightFaces.length > 0) {
            let copyright = Collector.createCopyrightPanel(
                this.bindings,
                copyrightFaces
            );
            let panel = copyright.panel.realize();
            this.generalPanel['add(java.awt.Component,java.lang.Object)'](
                panel,
                GeneralHint
            );
            this.copyright = { component: panel, controls: copyright.controls };
        }

        var templateFaces = this.templateReplacementFaces();
        if (templateFaces.length > 0) {
            let template = TemplateReplacement.createPanel(
                this.bindings,
                templateFaces
            );
            let panel = template.panel.realize();
            this.generalPanel['add(java.awt.Component,java.lang.Object)'](
                panel,
                GeneralHint
            );
            this.templatePanel = {
                component: panel,
                controls: template.controls,
            };
        }
    };

    FaceHandler.prototype.removeCollectorInterface = function () {
        var tabPane = this.editor.getTabbedPane();
        this.collectorTabs.forEach(function (tab) {
            tab.controls.forEach(function (control) {
                this.bindings.remove(control);
            }, this);
            tabPane.remove(tab.component);
        }, this);
        this.collectorTabs = [];

        [this.copyright, this.templatePanel].forEach(function (panel) {
            if (panel == null) return;
            panel.controls.forEach(function (control) {
                this.bindings.remove(control);
            }, this);
            this.generalPanel.remove(panel.component);
        }, this);
        this.copyright = null;
        this.templatePanel = null;
    };

    FaceHandler.prototype.getPortraitCount = function () {
        return this.allPortraits().length;
    };

    FaceHandler.prototype.getPortrait = function (index) {
        var portraits = this.allPortraits();
        if (index < 0 || index >= portraits.length) {
            throw new Error('Invalid portrait index: ' + index);
        }
        return portraits[index];
    };

    FaceHandler.prototype.create = function (diy) {
        this.setFaceTemplates(diy);
        diy.frontTemplateKey = this.templateKeys[FACE_FRONT];
        diy.backTemplateKey = this.templateKeys[FACE_BACK];

        diy.faceStyle = diyLibrary.FaceStyle.TWO_FACES;
        diy.customPortraitHandling = true;

        diy.name = '';

        this.setDefaults(diy);

        diy.setCornerRadius(8);
        diy.version = this.version;
    };

    FaceHandler.prototype.setDefaults = function (diy) {
        for (let i = 0; i < this.faces.length; i++) {
            this.faces[i].setDefaults(diy, i, false);
        }

        this.setCardDefaults(diy);
        if (this.copyrightFaces().length > 0) {
            Collector.setCopyrightDefaults(diy, false);
        }
        if (this.templateReplacementFaces().length > 0) {
            TemplateReplacement.setDefaults(diy, false);
        }
        this.updateCollector(diy);
    };

    FaceHandler.prototype.createInterface = function (diy, editor) {
        var tabPane = editor.getTabbedPane();

        this.editor = editor;
        this.bindings = new Bindings(editor, diy);

        var GeneralTab = new ui.Grid();
        GeneralTab.editorTabScrolling = true;
        var general = this.createGeneralPanels(diy, editor, this.bindings);
        for (let i = 0; i < general.length; i++) {
            GeneralTab.place(general[i], GeneralHint);
        }
        this.generalPanel = GeneralTab.addToEditor(
            editor,
            strings.string('AHLCG-General')
        );
        // added before the last tab
        this.generalTab = tabPane.getComponentAt(tabPane.getTabCount() - 2);

        for (let faceIndex = 0; faceIndex < this.faces.length; faceIndex++) {
            this.addFaceInterface(diy, faceIndex);
        }
        this.addCollectorInterface(diy);

        this.bindings.bind();
    };

    // Adds a side's panels to the General tab and its tabs after the General
    // tab, before those of the back.
    FaceHandler.prototype.addFaceInterface = function (diy, faceIndex) {
        var tabPane = this.editor.getTabbedPane();
        var faceUi = this.faces[faceIndex].createInterface(
            diy,
            this.bindings,
            faceIndex
        );
        if (this.art[faceIndex].length > 0)
            faceUi.tabs.push(this.createArtTab(diy, faceIndex));
        var side = { general: [], tabs: [] };
        var sideName = strings.string(
            faceIndex === FACE_FRONT ? 'AHLCG-Front' : 'AHLCG-Back'
        );
        var back =
            faceIndex === FACE_FRONT ? this.sideInterfaces[FACE_BACK] : null;

        var generalIndex =
            this.generalPanel.getComponentCount() -
            (back ? back.general.length : 0);
        for (let j = 0; j < faceUi.general.length; j++) {
            faceUi.general[j].panel.setTitle(
                faceUi.general[j].title + ': ' + sideName
            );
            let panel = faceUi.general[j].panel.realize();
            this.generalPanel['add(java.awt.Component,java.lang.Object,int)'](
                panel,
                GeneralHint,
                generalIndex + j
            );
            side.general.push(panel);
        }

        var tabIndex = tabPane.indexOfComponent(this.generalTab) + 1;
        if (faceIndex !== FACE_FRONT)
            tabIndex += this.sideInterfaces[FACE_FRONT].tabs.length;
        for (let j = 0; j < faceUi.tabs.length; j++) {
            faceUi.tabs[j].panel.editorTabScrolling = true;
            faceUi.tabs[j].panel.addToEditor(
                this.editor,
                faceUi.tabs[j].title + ': ' + sideName,
                null,
                null,
                tabIndex + j
            );
            side.tabs.push(tabPane.getComponentAt(tabIndex + j));
        }

        this.sideInterfaces[faceIndex] = side;
        this.generalPanel.revalidate();
        this.generalPanel.repaint();
    };

    // mirrors the portrait's image left to right, keeping its placement
    function mirrorPortrait(portrait) {
        var scale = portrait.getScale();
        var rotation = portrait.getRotation();
        var panX = portrait.getPanX();
        var panY = portrait.getPanY();
        portrait.setImage(
            portrait.getSource(),
            imageutils.ImageUtils.mirror(portrait.getImage(), true, false)
        );
        portrait.setScale(scale);
        portrait.setRotation(rotation);
        portrait.setPanX(panX);
        portrait.setPanY(panY);
    }

    // A side's art portraits, a mirror button for each, and the face's
    // $Artist<suffix>.
    FaceHandler.prototype.createArtTab = function (diy, faceIndex) {
        var face = this.faces[faceIndex];
        var first = faceIndex === FACE_FRONT ? 0 : this.art[FACE_FRONT].length;
        var panel = new ui.Grid();
        var options = new ui.Grid();
        options.setTitle(strings.string('AHLCG-Options'));

        var artistField = new ui.textField('', 30);
        face.bind(this.bindings, faceIndex, 'Artist', artistField);
        options.place(
            strings.string('AHLCG-Artist'),
            'align right',
            artistField,
            'pushx, growx'
        );

        this.art[faceIndex].forEach(function (portrait, j) {
            let imagePanel = new ui.portraitPanel(
                diy,
                first + j,
                strings.string('AHLCG-Portrait')
            );
            panel.place(imagePanel, 'wrap, pushx, growx');
            options.place(
                new ui.button(
                    strings.string('AHLCG-Mirror'),
                    null,
                    function mirror() {
                        try {
                            mirrorPortrait(portrait);
                            imagePanel.updatePanel();
                        } catch (ex) {
                            Error.handleUncaught(ex);
                        }
                    }
                ),
                'align right'
            );
        });
        panel.place(options, 'wrap, pushx, growx');

        return { panel: panel, title: strings.string('AHLCG-Portraits') };
    };

    FaceHandler.prototype.removeFaceInterface = function (diy, faceIndex) {
        var tabPane = this.editor.getTabbedPane();
        var side = this.sideInterfaces[faceIndex];

        this.faces[faceIndex].removeInterface(diy, this.bindings, faceIndex);
        for (let j = 0; j < side.general.length; j++) {
            this.generalPanel.remove(side.general[j]);
        }
        for (let j = 0; j < side.tabs.length; j++) {
            tabPane.remove(side.tabs[j]);
        }
        this.sideInterfaces[faceIndex] = null;
    };

    // Calls change, which replaces the face on a side, updating the open editor
    // in place: the side's controls, and new sheets, since templates can differ.
    FaceHandler.prototype.changeFace = function (diy, faceIndex, change) {
        this.bindings.flush();
        this.removeCollectorInterface();
        this.removeFaceInterface(diy, faceIndex);
        change();
        this.addFaceInterface(diy, faceIndex);
        this.addCollectorInterface(diy);
        this.editor.setGameComponent(diy);
        diy.markChanged(faceIndex);
    };

    FaceHandler.prototype.createFacePainter = function (diy, sheet, faceIndex) {
        this.boxes[faceIndex] = this.faces[faceIndex].createPainter(
            diy,
            sheet,
            faceIndex
        );
    };

    FaceHandler.prototype.createFrontPainter = function (diy, sheet) {
        this.createFacePainter(diy, sheet, FACE_FRONT);
    };

    FaceHandler.prototype.createBackPainter = function (diy, sheet) {
        this.createFacePainter(diy, sheet, FACE_BACK);
    };

    FaceHandler.prototype.paintFace = function (g, diy, sheet) {
        var faceIndex = sheet.getSheetIndex();
        var bothShow =
            String(diy.settings.get('ShowCollectionNumberFront', '1')) ===
                '1' &&
            String(diy.settings.get('ShowCollectionNumberBack', '1')) === '1';
        var face = this.faces[faceIndex];
        var art = {};
        face.portraits.forEach(function (name, j) {
            art[name] = this.art[faceIndex][j];
        }, this);
        face.paint(
            g,
            diy,
            sheet,
            this.boxes[faceIndex],
            {
                collection: this.findPortrait('Collection'),
                encounter: this.findPortrait('Encounter'),
                suffix:
                    bothShow &&
                    this.usesKind(FACE_FRONT, 'Collection') &&
                    this.usesKind(FACE_BACK, 'Collection'),
            },
            art
        );
    };

    FaceHandler.prototype.paintFront = function (g, diy, sheet) {
        this.paintFace(g, diy, sheet);
    };

    FaceHandler.prototype.paintBack = function (g, diy, sheet) {
        this.paintFace(g, diy, sheet);
    };

    FaceHandler.prototype.onClear = function (diy) {
        this.setDefaults(diy);
    };

    // A portrait saved by a legacy handler, under its own key, moved to the
    // face key; its image, pan and scale are kept.
    FaceHandler.prototype.adoptPortrait = function (kind, portrait) {
        var key = 'AHLCG-Face-' + kind;
        if (String(portrait.getBaseKey()) === key) return portrait;

        var adopted = new arkham.component.DefaultPortrait(key, portrait);
        adopted.facesToUpdate = [FACE_FRONT, FACE_BACK];
        adopted.backgroundFilled = false;
        return adopted;
    };

    FaceHandler.prototype.onRead = function (diy, ois) {
        this.upgrade(diy);

        this.updateCollector(diy);
        // the art, then the sets, each kept as created if the save ends first
        this.art.forEach(function (portraits) {
            for (let j = 0; j < portraits.length; j++) {
                try {
                    portraits[j] = ois.readObject();
                } catch (ex) {
                    return;
                }
            }
        });
        this.portraitKinds.forEach(function (kind, i) {
            // a save from before the faces used this set has no portrait
            try {
                this.portraits[i] = this.adoptPortrait(kind, ois.readObject());
            } catch (ex) {
                return;
            }
            Collector.update(diy, kind, this.portraits[i]);
        }, this);

        diy.setCornerRadius(8);
        diy.version = this.version;
    };

    FaceHandler.prototype.onWrite = function (diy, oos) {
        this.allPortraits().forEach(function (portrait) {
            oos.writeObject(portrait);
        });
    };

    return FaceHandler;
});
