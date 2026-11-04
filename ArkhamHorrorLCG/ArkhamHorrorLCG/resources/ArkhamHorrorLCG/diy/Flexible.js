/* global useLibrary, sourcefile, testDIYScript, globalThis */
useLibrary('amd');

if (String(sourcefile) === 'Quickscript') {
    define.config({
        baseUrl: 'project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy',
    });
}

// A card whose faces are chosen in the editor. $FrontFace and $BackFace hold
// the chosen face ids; any face can be used on either side.
define([
    'handlers/exportHandler',
    'handlers/FaceHandler',
    'se/strings',
    'se/ui',
    'faces/PlayerBackFace',
    'faces/EncounterBackFace',
    'faces/EnemyFace',
    'faces/ScenarioRulesFace',
    'faces/StoryFace',
    'faces/TokenRulesFace',
], function (
    exportHandler,
    FaceHandler,
    strings,
    ui,
    PlayerBackFace,
    EncounterBackFace,
    EnemyFace,
    ScenarioRulesFace,
    StoryFace,
    TokenRulesFace
) {
    // face ids, in menu order, and their faces
    const FaceChoices = [
        'playerBack',
        'encounterBack',
        'enemy',
        'scenarioRules',
        'story',
        'tokenRules',
    ];
    const FaceConstructors = {
        playerBack: PlayerBackFace,
        encounterBack: EncounterBackFace,
        enemy: EnemyFace,
        scenarioRules: ScenarioRulesFace,
        story: StoryFace,
        tokenRules: TokenRulesFace,
    };

    const DefaultFaces = ['playerBack', 'encounterBack'];
    const FaceSettings = ['FrontFace', 'BackFace'];

    function FlexibleHandler() {
        FaceHandler.call(
            this,
            {
                templateKeys: [
                    'AHLCG-FlexibleHandler-Front',
                    'AHLCG-FlexibleHandler-Back',
                ],
            },
            new FaceConstructors[DefaultFaces[0]](),
            new FaceConstructors[DefaultFaces[1]]()
        );

        this.faceIds = DefaultFaces.slice();
        // the component, for entry points that are not passed one
        this.component = null;
    }

    FlexibleHandler.prototype = Object.create(FaceHandler.prototype);
    FlexibleHandler.prototype.constructor = FlexibleHandler;

    FlexibleHandler.prototype.getFaceSetting = function (diy, faceIndex) {
        return String(
            diy.settings.get(FaceSettings[faceIndex], DefaultFaces[faceIndex])
        );
    };

    // Applies $FrontFace and $BackFace: faces, missing defaults and templates.
    FlexibleHandler.prototype.applyFaceSettings = function (diy) {
        for (let i = 0; i < this.faces.length; i++) {
            let id = this.getFaceSetting(diy, i);
            if (this.faceIds[i] !== id) {
                this.faces[i].clearType(diy, i);
                this.setFace(i, new FaceConstructors[id]());
                this.faceIds[i] = id;
            }
            this.faces[i].setDefaults(diy, i, true);
        }
        this.setFaceTemplates(diy);
        this.updateCollector(diy);
    };

    // brings the faces in line with the settings after they change outside the editor
    FlexibleHandler.prototype.syncFaces = function () {
        if (this.component == null) return;

        for (let i = 0; i < this.faces.length; i++) {
            if (this.faceIds[i] !== this.getFaceSetting(this.component, i)) {
                this.applyFaceSettings(this.component);
                return;
            }
        }
    };

    FlexibleHandler.prototype.createGeneralPanels = function (
        diy,
        editor,
        bindings
    ) {
        var handler = this;
        var panel = new ui.Grid();
        panel.setTitle(strings.string('AHLCG-Faces'));

        var labels = [
            strings.string('AHLCG-Front'),
            strings.string('AHLCG-Back'),
        ];
        var items = FaceChoices.map(function (id) {
            return new arkham.diy.ListItem(
                id,
                strings.string('AHLCG-Face-' + id)
            );
        });
        for (let i = 0; i < FaceSettings.length; i++) {
            let faceIndex = i;
            let list = new ui.comboBox(items, null);
            list.setSelectedIndex(FaceChoices.indexOf(this.faceIds[faceIndex]));
            list.addActionListener(function selectFace(actionEvent) {
                try {
                    let id = String(list.getSelectedItem());
                    if (id === handler.faceIds[faceIndex]) return;

                    handler.changeFace(diy, faceIndex, function () {
                        diy.settings.set(FaceSettings[faceIndex], id);
                        handler.applyFaceSettings(diy);
                    });
                } catch (ex) {
                    Error.handleUncaught(ex);
                }
            });

            panel.place(
                labels[faceIndex],
                'align right',
                list,
                'wrap, pushx, growx'
            );
        }

        return [panel];
    };

    FlexibleHandler.prototype.create = function (diy) {
        this.component = diy;

        diy.settings.set(FaceSettings[0], DefaultFaces[0]);
        diy.settings.set(FaceSettings[1], DefaultFaces[1]);
        this.applyFaceSettings(diy);

        FaceHandler.prototype.create.call(this, diy);
    };

    FlexibleHandler.prototype.onRead = function (diy, ois) {
        this.component = diy;
        this.applyFaceSettings(diy);

        FaceHandler.prototype.onRead.call(this, diy, ois);
    };

    // the entry points below first apply face settings changed outside the editor

    FlexibleHandler.prototype.getPortraitCount = function () {
        this.syncFaces();
        return FaceHandler.prototype.getPortraitCount.call(this);
    };

    FlexibleHandler.prototype.createInterface = function (diy, editor) {
        this.syncFaces();
        FaceHandler.prototype.createInterface.call(this, diy, editor);
    };

    FlexibleHandler.prototype.createFacePainter = function (
        diy,
        sheet,
        faceIndex
    ) {
        this.syncFaces();
        FaceHandler.prototype.createFacePainter.call(
            this,
            diy,
            sheet,
            faceIndex
        );
    };

    FlexibleHandler.prototype.paintFace = function (g, diy, sheet) {
        this.syncFaces();
        FaceHandler.prototype.paintFace.call(this, g, diy, sheet);
    };

    exportHandler(globalThis, new FlexibleHandler());
});

// Running this script directly (Quickscript) creates a test editor for the
// component; saving and loading it won't work correctly.
if (String(sourcefile) === 'Quickscript') {
    useLibrary('diy');
    testDIYScript();
}
