// The PackCover card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_FRONT,
    LegacyHandler,
    PortraitList,
    clearImage,
    createPortraits,
    drawBackTemplate,
    drawName,
    getExpandedKey,
    initBodyTags,
    layoutHSBPanel,
    layoutPortraitsWithPanels,
    layoutTitle2,
    readPortraits,
    writePortraits,
} from './legacy/Adapter.mjs';
import {
    $,
    Settings,
    currentSettings,
    string,
} from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { ImageUtils } from 'strange-eons/legacy/imageutils';
import { markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';
import { Grid } from 'strange-eons/legacy/uilayout';

const CardTypes = ['PackCover'];
const BindingSuffixes = [''];

const PortraitTypeList = ['Portrait-Front'];

// a card's handler functions, with its own boxes and panels
function script() {
    let Name_box;

    function create(diy) {
        diy.frontTemplateKey = getExpandedKey(
            FACE_FRONT,
            'Default',
            '-template'
        ); // not used, set card size

        diy.faceStyle = FaceStyle.ONE_FACE;
        diy.name = '';

        setDefaults();
        createPortraits(diy, PortraitTypeList);

        diy.version = CARD_VERSION;
    }

    function setDefaults() {
        currentSettings().set('tint', '0,1,1');
    }

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

        // do this first, we need the portrait panels for the title listener
        var PortraitTabArray = layoutPortraitsWithPanels(
            diy,
            bindings,
            'Portrait',
            null,
            true,
            false,
            false
        );
        var PortraitTab = PortraitTabArray[0];
        PortraitTabArray.splice(0, 1);

        var HSBPanel = layoutHSBPanel(diy, bindings);
        HSBPanel.addToEditor(editor, 'Tint');

        var TitlePanel = layoutTitle2(diy, bindings, [0], FACE_FRONT);
        TitlePanel.setTitle(
            string('AHLCG-Title') + ': ' + string('AHLCG-Front')
        );

        var StatisticsTab = new Grid();
        StatisticsTab.editorTabScrolling = true;
        StatisticsTab.place(TitlePanel, 'wrap, pushx, growx');
        StatisticsTab.addToEditor(editor, string('AHLCG-General'));

        PortraitTab.addToEditor(editor, string('AHLCG-Portraits'));

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

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        PortraitList[0].paint(g, sheet.getRenderTarget());

        var hsb = Settings.tint($('tint'));
        var tintable_image = ImageUtils.get(
            'ArkhamHorrorLCG/templates/AHLCG-PackCoverTintable.png'
        );
        let tinted_image = ImageUtils.tint(tintable_image, hsb);
        sheet.paintImage(
            g,
            tinted_image,
            diy.settings.getRegion('AHLCG-PackCover-Tint-region')
        );

        drawBackTemplate(g, sheet, '');

        drawName(g, diy, sheet, Name_box);
    }

    function onClear() {
        setDefaults();
    }

    // These can be used to perform special processing during open/save.
    // For example, you can seamlessly upgrade from a previous version
    // of the script.
    function onRead(diy, oos) {
        readPortraits(diy, oos, PortraitTypeList, true);
        diy.version = CARD_VERSION;
    }

    function onWrite(diy, oos) {
        writePortraits(oos, PortraitTypeList);
    }

    return {
        create,
        createInterface,
        createFrontPainter,
        paintFront,
        onClear,
        onRead,
        onWrite,
    };
}

export class PackCoverHandler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
