// Bindings whose controls can also be removed after binding, for editors
// that add and remove controls in place. bind() hands the editor functions
// over the bindings and activeBindings lists themselves, so changes to the
// lists take effect in the bound editor. Controls that come and go with the
// component's settings can rebuild themselves from a populate listener.
//
// Module: returns Bindings.
import ui from '../se/ui.mjs';
import Java from '../se/java.mjs';

const JScrollPane = Java.type('javax.swing.JScrollPane');
class Bindings extends ui.Bindings {
    constructor(editor, gameComponent) {
        super(editor, gameComponent);
        this.populateListeners = [];
    }

    // Removes the bindings for control, a control passed to add.
    remove(control) {
        // as add binds the view of a scroll pane
        if (control instanceof JScrollPane)
            control = control.getViewport().getView();

        [this.bindings, this.activeBindings].forEach(function (list) {
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].control === control) list.splice(i, 1);
            }
        });
    }

    // Adds a function called when the editor populates its controls, before the
    // bindings copy the settings to theirs.
    addPopulateListener(listener) {
        this.populateListeners.push(listener);
    }

    removePopulateListener(listener) {
        var index = this.populateListeners.indexOf(listener);
        if (index >= 0) this.populateListeners.splice(index, 1);
    }

    createPopulateFunction() {
        var listeners = this.populateListeners;
        var populate = super.createPopulateFunction();
        return function populateFunction() {
            for (let i = 0; i < listeners.length; ++i) {
                try {
                    listeners[i]();
                } catch (ex) {
                    Error.handleUncaught(ex);
                }
            }
            populate();
        };
    }

    // Updates every binding; the inherited function stops updating at the
    // first binding that changes (changed = changed || update()).
    createUpdateFunction() {
        var bindings = this.bindings;
        return function updateFunction() {
            let changed = false;
            for (let i = 0; i < bindings.length; ++i) {
                try {
                    if (bindings[i].update()) changed = true;
                } catch (ex) {
                    Error.handleUncaught(ex);
                }
            }
            return changed;
        };
    }

    // Copies edits not yet copied by the editor's heartbeat to the settings.
    flush() {
        return this.createUpdateFunction()();
    }
}

export default Bindings;
