// The Ultimatum card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_BACK,
    FACE_FRONT,
    LegacyHandler,
    clearImage,
    createPortraits,
    drawBackTemplate,
    drawBody,
    drawCollectorInfo,
    drawName,
    drawUltimatumSubtitle,
    drawUltimatumTemplate,
    drawUltimatumTraits,
    getExpandedKey,
    getPortraitIndex,
    initBodyTags,
    initCopyrightTags,
    layoutCollection,
    layoutCopyright,
    layoutEncounter,
    layoutPortraits,
    layoutText,
    layoutTitleUnique,
    paintPortrait,
    readPortraits,
    setDefaultCollection,
    setDefaultEncounter,
    updateCollection,
    updateEncounter,
    writePortraits,
} from './legacy/Adapter.mjs';
import { $, currentSettings, string } from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';
import { portraitPanel } from 'strange-eons/legacy/uicontrols';
import { Grid } from 'strange-eons/legacy/uilayout';

const CardTypes = ['Ultimatum', 'UltimatumBack'];
const BindingSuffixes = ['', 'Back'];

const PortraitTypeList = ['Portrait', 'Collection', 'Encounter'];

// a card's handler functions, with its own boxes and panels
function script() {
    let Artist_box,
        Body_box,
        Collection_box,
        Copyright_box,
        Encounter_box,
        Label_box,
        Name_box,
        PortraitTab,
        Subtitle_box,
        Trait_box;

    function create(diy) {
        diy.frontTemplateKey = getExpandedKey(
            FACE_FRONT,
            'Default',
            '-template'
        );
        diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

        diy.faceStyle = FaceStyle.TWO_FACES;

        diy.name = '';

        setDefaults();
        createPortraits(diy, PortraitTypeList);
        setDefaultEncounter(diy);
        setDefaultCollection(diy);

        diy.setCornerRadius(8);
        diy.version = CARD_VERSION;
    }

    function setDefaults() {
        currentSettings().set('Subtitle', '');

        currentSettings().set('BackTypeBack', 'Boon');

        currentSettings().set('Traits', '');
        currentSettings().set('Rules', '');

        currentSettings().set('TraitsSpacing', '0');
        currentSettings().set('RulesSpacing', '0');

        currentSettings().set('Artist', '');
        currentSettings().set('Copyright', '');
    }

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

        var TitlePanel = layoutTitleUnique(
            diy,
            bindings,
            true,
            [0],
            FACE_FRONT
        );
        var CopyrightPanel = layoutCopyright(bindings, false, [0], FACE_FRONT);

        var StatisticsTab = new Grid();
        StatisticsTab.editorTabScrolling = true;
        StatisticsTab.place(
            TitlePanel,
            'wrap, pushx, growx',
            CopyrightPanel,
            'wrap, pushx, growx'
        );
        StatisticsTab.addToEditor(editor, string('AHLCG-General'));

        var TextTab = layoutText(bindings, ['Traits', 'Rules'], '', FACE_FRONT);
        TextTab.editorTabScrolling = true;
        TextTab.addToEditor(editor, string('AHLCG-Rules'));

        PortraitTab = layoutPortraits(
            diy,
            bindings,
            'Portrait',
            null,
            false,
            false,
            false
        );
        PortraitTab.addToEditor(editor, string('AHLCG-Portraits'));

        var CollectionImagePanel = portraitPanel(
            diy,
            getPortraitIndex('Collection'),
            string('AHLCG-CustomCollection')
        );
        var CollectionPanel = layoutCollection(
            bindings,
            CollectionImagePanel,
            false,
            false,
            [0],
            FACE_FRONT
        );

        var CollectionTab = new Grid();
        CollectionTab.editorTabScrolling = true;
        CollectionTab.place(
            CollectionPanel,
            'wrap, pushx, growx',
            CollectionImagePanel,
            'wrap, pushx, growx'
        );
        CollectionTab.addToEditor(editor, string('AHLCG-Collection'));

        var EncounterImagePanel = portraitPanel(
            diy,
            getPortraitIndex('Encounter'),
            string('AHLCG-CustomEncounterSet')
        );
        var EncounterPanel = layoutEncounter(
            bindings,
            EncounterImagePanel,
            false,
            [0],
            [0],
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
        Label_box = markupBox(sheet);
        Label_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Label-style'),
            null
        );
        Label_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Label-alignment')
        );

        Name_box = markupBox(sheet);
        Name_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Name-style'),
            null
        );
        Name_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Name-alignment')
        );

        initBodyTags(diy, Name_box);

        Subtitle_box = markupBox(sheet);
        Subtitle_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Subtitle-style'),
            null
        );
        Subtitle_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Subtitle-alignment')
        );

        Trait_box = markupBox(sheet);
        Trait_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Trait-style'),
            null
        );
        Trait_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Trait-alignment')
        );

        Body_box = markupBox(sheet);
        Body_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Body-style'),
            null
        );
        Body_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Body-alignment')
        );

        initBodyTags(diy, Body_box);

        Artist_box = markupBox(sheet);
        Artist_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Artist-style'),
            null
        );
        Artist_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Artist-alignment')
        );

        Copyright_box = markupBox(sheet);
        Copyright_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Copyright-style'),
            null
        );
        Copyright_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Copyright-alignment')
        );

        initCopyrightTags(diy, Copyright_box);

        Collection_box = markupBox(sheet);
        Collection_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'CollectionNumber-style'),
            null
        );
        Collection_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'CollectionNumber-alignment')
        );

        Encounter_box = markupBox(sheet);
        Encounter_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'EncounterNumber-style'),
            null
        );
        Encounter_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'EncounterNumber-alignment')
        );
    }

    function createBackPainter(diy, sheet) {}

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        paintPortrait(g, diy, sheet, 'Portrait');

        var card_type = $('Traits').indexOf('Boon') > -1 ? 'Boon' : 'Ultimatum';
        drawUltimatumTemplate(g, diy, sheet, card_type, $('Subtitle'));
        drawName(g, diy, sheet, Name_box);
        drawUltimatumSubtitle(g, diy, sheet, Subtitle_box, $('Subtitle'));
        drawUltimatumTraits(g, diy, sheet, Trait_box, $('Traits'));

        drawBody(g, diy, sheet, Body_box, new Array('Rules'));

        drawCollectorInfo(
            g,
            diy,
            sheet,
            Collection_box,
            false,
            true,
            Encounter_box,
            true,
            Copyright_box,
            Artist_box
        );
    }

    function paintBack(g, diy, sheet) {
        clearImage(g, sheet);
        drawBackTemplate(g, sheet);
    }

    function onClear() {
        setDefaults();
    }

    // These can be used to perform special processing during open/save.
    // For example, you can seamlessly upgrade from a previous version
    // of the script.
    function onRead(diy, oos) {
        readPortraits(diy, oos, PortraitTypeList, true);

        updateCollection(diy);
        updateEncounter(diy);

        diy.setCornerRadius(8);
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

export class UltimatumHandler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
