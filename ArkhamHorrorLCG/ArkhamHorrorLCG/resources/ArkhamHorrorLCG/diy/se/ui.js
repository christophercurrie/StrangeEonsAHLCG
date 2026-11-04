// Strange Eons ui library: layouts, controls and bindings.
//
// Module: returns { Bindings, Grid, button, checkBox, comboBox, portraitPanel, spinner,
// textArea, textField, tipButton, toggleButton }.
/* global
  useLibrary, Bindings, Grid, button, checkBox, comboBox, portraitPanel,
  spinner, textArea, textField, tipButton, toggleButton
 */
useLibrary('ui');

define(function () {
    return {
        Bindings: Bindings,
        Grid: Grid,
        button: button,
        checkBox: checkBox,
        comboBox: comboBox,
        portraitPanel: portraitPanel,
        spinner: spinner,
        textArea: textArea,
        textField: textField,
        tipButton: tipButton,
        toggleButton: toggleButton,
    };
});
