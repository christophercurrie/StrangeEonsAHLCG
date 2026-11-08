// Editor panel and defaults for images that replace a face's template.
//
// Module: returns { setDefaults, createPanel }.
import common from '../se/common.mjs';
import strings from '../se/strings.mjs';
import ui from '../se/ui.mjs';

const Sides = ['Front', 'Back'];
const Suffixes = ['', 'Back'];

function setDefaults(diy, keep) {
    if (keep && diy.settings.getOverride('TemplateReplacementBleed') != null)
        return;
    diy.settings.set('TemplateReplacementBleed', '0');
}

// a row for each side in faces; returns { panel, controls }
function createPanel(bindings, faces) {
    var panel = new ui.Grid();
    panel.setTitle(strings.string('AHLCG-TemplateReplacement'));
    var controls = [];

    faces.forEach(function (faceIndex) {
        let field = new ui.textField('', 30);
        bindings.add('TemplateReplacement' + Suffixes[faceIndex], field, [
            faceIndex,
        ]);
        controls.push(field);
        panel.place(
            strings.string('AHLCG-' + Sides[faceIndex]),
            'align right',
            field,
            'pushx, growx',
            new ui.button(
                strings.string('AHLCG-Pref-Select'),
                null,
                function () {
                    var file = common.ResourceKit.showImageFileDialog(null);
                    if (file != null) field.setText(file);
                }
            ),
            'wrap'
        );
    });

    var bleedBox = new ui.checkBox(
        strings.string('AHLCG-TemplateReplacementBleed'),
        false,
        null
    );
    bindings.add('TemplateReplacementBleed', bleedBox, faces);
    controls.push(bleedBox);
    panel.place(bleedBox, 'skip, span 2, wrap');

    return { panel: panel, controls: controls };
}

export default { setDefaults: setDefaults, createPanel: createPanel };
