// Card handler whose faces are chosen in the editor, from a list per side.
// Each side's choice is stored by id in its setting; a side with one choice
// has no control.
//
// config, as for FaceHandler, and:
//   settings  [ front, back ] setting names that hold the chosen ids; null
//             for a side with one choice
//   choices   [ front, back ] lists of { id, label, face }, in menu order,
//             label being a string key and face a face constructor
//   defaults  [ front, back ] ids of the faces of a new card; the first
//             choice if left out
//   title     string key of the General panel that offers the choices
//   upgradeChoices
//             in place of overriding it
//
// Module: returns FaceChoiceHandler.
import FaceHandler from './FaceHandler.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';
import Java from '../se/java.mjs';

const ListItem = Java.type('ca.cgjennings.apps.arkham.diy.ListItem');
class FaceChoiceHandler extends FaceHandler {
    constructor(config) {
        var defaults = config.choices.map(function (list, faceIndex) {
            return config.defaults ? config.defaults[faceIndex] : list[0].id;
        });
        var defaultFace = function (faceIndex) {
            return config.choices[faceIndex].find(function (choice) {
                return choice.id === defaults[faceIndex];
            }).face;
        };

        super(config, new (defaultFace(0))(), new (defaultFace(1))());

        this.choices = config.choices;
        this.faceSettings = config.settings;
        this.panelTitle = config.title;
        this.defaults = defaults;
        this.faceIds = this.defaults.slice();
        // the component, for entry points that are not passed one
        this.component = null;
    }

    // the choice with the id, or null
    findChoice(faceIndex, id) {
        var list = this.choices[faceIndex];
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) return list[i];
        }
        return null;
    }

    // the chosen id, or the default if the setting holds another
    getFaceSetting(diy, faceIndex) {
        if (this.faceSettings[faceIndex] == null)
            return this.defaults[faceIndex];
        var id = String(
            diy.settings.get(
                this.faceSettings[faceIndex],
                this.defaults[faceIndex]
            )
        );
        return this.findChoice(faceIndex, id) != null
            ? id
            : this.defaults[faceIndex];
    }

    // Applies the chosen faces: faces, missing defaults and templates.
    applyFaceSettings(diy) {
        for (let i = 0; i < this.faces.length; i++) {
            let id = this.getFaceSetting(diy, i);
            if (this.faceIds[i] !== id) {
                this.faces[i].clearType(diy, i);
                this.setFace(i, new (this.findChoice(i, id).face)());
                this.faceIds[i] = id;
            }
            this.faces[i].setDefaults(diy, i, true);
        }
        this.setFaceTemplates(diy);
        this.updateCollector(diy);
    }

    // brings the faces in line with the settings after they change outside
    // the editor
    syncFaces() {
        if (this.component == null) return;

        for (let i = 0; i < this.faces.length; i++) {
            if (this.faceIds[i] !== this.getFaceSetting(this.component, i)) {
                this.applyFaceSettings(this.component);
                return;
            }
        }
    }

    createGeneralPanels(diy, editor, bindings) {
        var handler = this;
        var panel = new ui.Grid();
        panel.setTitle(strings.string(this.panelTitle));

        var labels = [
            strings.string('AHLCG-Front'),
            strings.string('AHLCG-Back'),
        ];
        var offered = 0;
        for (let i = 0; i < this.faceSettings.length; i++) {
            let faceIndex = i;
            let list = this.choices[faceIndex];
            if (list.length < 2) continue;
            offered++;

            let items = list.map(function (choice) {
                return new ListItem(choice.id, strings.string(choice.label));
            });
            let combo = new ui.comboBox(items, null);
            combo.setSelectedIndex(
                list.indexOf(
                    this.findChoice(faceIndex, this.faceIds[faceIndex])
                )
            );
            combo.addActionListener(function selectFace(actionEvent) {
                try {
                    let id = String(combo.getSelectedItem());
                    if (id === handler.faceIds[faceIndex]) return;

                    handler.changeFace(diy, faceIndex, function () {
                        diy.settings.set(handler.faceSettings[faceIndex], id);
                        handler.applyFaceSettings(diy);
                    });
                } catch (ex) {
                    Error.handleUncaught(ex);
                }
            });

            panel.place(
                labels[faceIndex],
                'align right',
                combo,
                'wrap, pushx, growx'
            );
        }

        return offered > 0 ? [panel] : [];
    }

    create(diy) {
        this.component = diy;

        for (let i = 0; i < this.faceSettings.length; i++) {
            if (this.faceSettings[i] != null)
                diy.settings.set(this.faceSettings[i], this.defaults[i]);
        }
        this.applyFaceSettings(diy);

        super.create(diy);
    }

    // An older save's choices are upgraded before its faces are applied; the
    // other upgrades see those faces.
    onRead(diy, ois) {
        this.component = diy;
        if (diy.version < this.version) this.upgradeChoices(diy);
        this.applyFaceSettings(diy);

        super.onRead(diy, ois);
    }

    // Subclasses may override upgradeChoices( diy ) to set the face settings
    // of an older save.
    upgradeChoices(diy) {
        if (this.config.upgradeChoices) this.config.upgradeChoices(diy);
    }

    getPortraitCount() {
        this.syncFaces();
        return super.getPortraitCount();
    }

    createInterface(diy, editor) {
        this.syncFaces();
        super.createInterface(diy, editor);
    }

    createFacePainter(diy, sheet, faceIndex) {
        this.syncFaces();
        super.createFacePainter(diy, sheet, faceIndex);
    }

    paintFace(g, diy, sheet) {
        this.syncFaces();
        super.paintFace(g, diy, sheet);
    }
}

// the entry points below first apply face settings changed outside the
// editor

export default FaceChoiceHandler;
