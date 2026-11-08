// The Divider card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_BACK,
    FACE_FRONT,
    LegacyHandler,
    clearImage,
    createPortraits,
    drawEncounterIcon,
    drawName,
    drawTemplate,
    drawWatermark,
    getExpandedKey,
    getPortraitIndex,
    initBodyTags,
    layoutSimpleEncounter,
    layoutTitle,
    readPortraits,
    setDefaultEncounter,
    updateEncounter,
    writePortraits,
} from './legacy/Adapter.mjs';
import { string } from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';
import { portraitPanel } from 'strange-eons/legacy/uicontrols';
import { Grid } from 'strange-eons/legacy/uilayout';

const CardTypes = ['Divider', 'Divider'];
const BindingSuffixes = ['', 'Back'];

const PortraitTypeList = ['Encounter-Both'];

// a card's handler functions, with its own boxes and panels
function script() {
    let BackName_box, Name_box;

    function create(diy) {
        diy.frontTemplateKey = getExpandedKey(
            FACE_FRONT,
            'Default',
            '-template'
        ); // not used, set card size
        diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

        diy.faceStyle = FaceStyle.TWO_FACES;

        diy.name = '';

        setDefaults();
        createPortraits(diy, PortraitTypeList);
        setDefaultEncounter(diy);

        diy.version = CARD_VERSION;
    }

    function setDefaults() {}

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

        var TitlePanel = layoutTitle(diy, bindings, false, [0, 1], FACE_FRONT);

        var StatisticsTab = new Grid();
        StatisticsTab.editorTabScrolling = true;
        StatisticsTab.place(TitlePanel, 'wrap, pushx, growx');
        StatisticsTab.addToEditor(editor, string('AHLCG-General'));

        var EncounterImagePanel = portraitPanel(
            diy,
            getPortraitIndex('Encounter'),
            string('AHLCG-CustomEncounterSet')
        );
        var EncounterPanel = layoutSimpleEncounter(
            bindings,
            EncounterImagePanel,
            [0, 1],
            FACE_FRONT
        );

        var EncounterTab = new Grid();
        EncounterTab.editorTabScrolling = true;
        EncounterTab.place(
            EncounterPanel,
            'wrap, pushx, growx',
            EncounterImagePanel,
            'wrap, pushx, growx'
        );
        EncounterTab.addToEditor(editor, string('AHLCG-EncounterSet'));

        bindings.bind();
    }

    function createFrontPainter(diy, sheet) {
        Name_box = markupBox(sheet);
        Name_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Name-style'),
            null
        );
        Name_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Name-alignment')
        );
        initBodyTags(diy, Name_box);
    }

    function createBackPainter(diy, sheet) {
        BackName_box = markupBox(sheet);
        BackName_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Name-style'),
            null
        );
        BackName_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Name-alignment')
        );
        initBodyTags(diy, BackName_box);
    }

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        drawTemplate(g, sheet, '');

        if (diy.name !== '') drawName(g, diy, sheet, Name_box);

        drawEncounterIcon(g, diy, sheet);

        drawWatermark(g, diy, sheet);
    }

    function paintBack(g, diy, sheet) {
        clearImage(g, sheet);

        drawTemplate(g, sheet, '');

        if (diy.name !== '') drawName(g, diy, sheet, Name_box);

        drawEncounterIcon(g, diy, sheet);

        drawWatermark(g, diy, sheet);
    }

    function onClear() {
        setDefaults();
    }

    // These can be used to perform special processing during open/save.
    // For example, you can seamlessly upgrade from a previous version
    // of the script.
    function onRead(diy, oos) {
        readPortraits(diy, oos, PortraitTypeList, true);

        updateEncounter(diy);

        diy.version = CARD_VERSION;
    }

    function onWrite(diy, oos) {
        writePortraits(oos, PortraitTypeList);
    }

    return {
        create,
        createInterface,
        createFrontPainter,
        createBackPainter,
        paintFront,
        paintBack,
        onClear,
        onRead,
        onWrite,
    };
}

export class DividerHandler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
