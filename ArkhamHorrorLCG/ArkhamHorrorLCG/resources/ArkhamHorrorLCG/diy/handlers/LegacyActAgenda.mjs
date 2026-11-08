// Act and agenda saves: the back's story text in parts (see
// handlers/LegacyStoryText), the back's text scale as $ScaleModifier, and
// the art's clip region set on the card for its orientation.
//
// Module: returns { upgrade }.
import LegacyStoryText from './LegacyStoryText.mjs';

// type: Act or Agenda
function upgrade(diy, type) {
    var settings = diy.settings;
    if (diy.version < 2) {
        // the back's text was a single part
        ['AccentedStory', 'Rules'].forEach(function (field) {
            let text = settings.get(field + 'Back');
            if (text != null) settings.set(field + 'ABack', text);
            settings.reset(field + 'Back');
        });
        let spacing = settings.get('AccentedStoryBackSpacing');
        if (spacing != null) settings.set('AccentedStoryABackSpacing', spacing);
        settings.reset('AccentedStoryBackSpacing');
    }
    LegacyStoryText.upgrade(settings, 'Back');
    var scale = settings.get('ScaleModifier');
    if (scale != null) {
        settings.set('ScaleModifierBack', scale);
        settings.reset('ScaleModifier');
    }
    settings.reset('AHLCG-' + type + '-Portrait-portrait-clip-region');
}

export default { upgrade: upgrade };
