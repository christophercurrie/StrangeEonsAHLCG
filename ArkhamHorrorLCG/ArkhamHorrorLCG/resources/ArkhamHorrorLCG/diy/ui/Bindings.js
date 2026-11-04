// Bindings whose controls can also be removed after binding, for editors
// that add and remove controls in place. bind() hands the editor functions
// over the bindings and activeBindings lists themselves, so changes to the
// lists take effect in the bound editor. Controls that come and go with the
// component's settings can rebuild themselves from a populate listener.
//
// Module: returns Bindings.
define(['se/ui', 'se/java'], function (ui, Java) {
    const JScrollPane = Java.type('javax.swing.JScrollPane');
    function Bindings(editor, gameComponent) {
        ui.Bindings.call(this, editor, gameComponent);
        this.populateListeners = [];
    }

    Bindings.prototype = Object.create(ui.Bindings.prototype);
    Bindings.prototype.constructor = Bindings;

    // Removes the bindings for control, a control passed to add.
    Bindings.prototype.remove = function (control) {
        // as add binds the view of a scroll pane
        if (control instanceof JScrollPane)
            control = control.getViewport().getView();

        [this.bindings, this.activeBindings].forEach(function (list) {
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].control.equals(control)) list.splice(i, 1);
            }
        });
    };

    // Adds a function called when the editor populates its controls, before the
    // bindings copy the settings to theirs.
    Bindings.prototype.addPopulateListener = function (listener) {
        this.populateListeners.push(listener);
    };

    Bindings.prototype.removePopulateListener = function (listener) {
        var index = this.populateListeners.indexOf(listener);
        if (index >= 0) this.populateListeners.splice(index, 1);
    };

    Bindings.prototype.createPopulateFunction = function () {
        var listeners = this.populateListeners;
        var populate = ui.Bindings.prototype.createPopulateFunction.call(this);
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
    };

    // Updates every binding; the inherited function stops updating at the
    // first binding that changes (changed = changed || update()).
    Bindings.prototype.createUpdateFunction = function () {
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
    };

    // Copies edits not yet copied by the editor's heartbeat to the settings.
    Bindings.prototype.flush = function () {
        return this.createUpdateFunction()();
    };

    return Bindings;
});
