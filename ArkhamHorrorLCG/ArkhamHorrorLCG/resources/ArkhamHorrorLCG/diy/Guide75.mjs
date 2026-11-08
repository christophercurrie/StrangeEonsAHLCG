// The Guide75 card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_FRONT,
    LegacyHandler,
    clearImage,
    createPortraits,
    drawGuideBody,
    drawGuidePortraits,
    drawGuideTemplate,
    drawName,
    drawPageNumber,
    getExpandedKey,
    initBodyTags,
    initGuideTags,
    layoutGuidePortraits,
    layoutGuideStats,
    layoutText,
    layoutTitleGuide,
    readPortraits,
    setupGuidePortrait,
    updateGuideBodyRegions,
    writePortraits,
} from './legacy/Adapter.mjs';
import { $, currentSettings, string } from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { FIT_NONE, markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';
import { spinner } from 'strange-eons/legacy/uicontrols';
import { Grid } from 'strange-eons/legacy/uilayout';

const CardTypes = ['Guide75'];
const BindingSuffixes = [''];

const PortraitTypeList = ['Portrait1-Front', 'Portrait2-Front'];

// a card's handler functions, with its own boxes and panels
function script() {
    let Body_box,
        Header_box,
        Label_box,
        Name_box,
        Page_box,
        portraitBodyRegions;

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
        currentSettings().set('PageType', 'Empty');

        currentSettings().set('Page', '1');

        currentSettings().set('RulesLeft', '');
        currentSettings().set('RulesRight', '');

        currentSettings().set('PositionPortrait1', 'TopLeftSmall');
        currentSettings().set('PositionPortrait2', 'BottomLarge');

        currentSettings().set('LineSpacingLeft', '100');
        currentSettings().set('LineSpacingRight', '100');
    }

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

        // do this first, we need the portrait panels for the title listener
        var PortraitTabArray = layoutGuidePortraits(
            diy,
            bindings,
            'Portrait1',
            'Portrait2',
            true
        );
        var PortraitTab = PortraitTabArray[0];
        PortraitTabArray.splice(0, 1);

        var TitlePanel = layoutTitleGuide(
            diy,
            bindings,
            [0],
            FACE_FRONT,
            PortraitTabArray
        );
        var StatPanel = layoutGuideStats(bindings, FACE_FRONT);
        StatPanel.setTitle(string('AHLCG-BasicData'));

        var StatisticsTab = new Grid();
        StatisticsTab.editorTabScrolling = true;
        StatisticsTab.place(
            TitlePanel,
            'wrap, pushx, growx',
            StatPanel,
            'wrap, pushx, growx'
        );
        StatisticsTab.addToEditor(editor, string('AHLCG-General'));

        PortraitTab.addToEditor(editor, string('AHLCG-Portraits'));

        //	var LeftTextTab = layoutText( bindings, [ 'Rules' ], 'Left', FACE_FRONT );
        var LeftTextPanel = layoutText(bindings, ['Rules'], 'Left', FACE_FRONT);
        //	LeftTextTab.editorTabScrolling = true;
        //	LeftTextTab.addToEditor( editor, string( 'AHLCG-Rules' ) + ': ' + string( 'AHLCG-Left' ) );

        var spacingLeftSpinner = new spinner(10, 300, 1, 100);
        bindings.add('LineSpacingLeft', spacingLeftSpinner, [0]);

        var LeftTextTab = new Grid();
        LeftTextTab.editorTabScrolling = true;
        LeftTextTab.place(
            LeftTextPanel,
            'wrap, pushx, growx',
            string('AHLCG-LineSpacing'),
            'align left, split',
            spacingLeftSpinner,
            'align left',
            '%',
            'pushx, growx, wrap, align left'
        );

        LeftTextTab.addToEditor(
            editor,
            string('AHLCG-Rules') + ': ' + string('AHLCG-Left')
        );

        //	var RightTextTab = layoutText( bindings, [ 'Rules' ], 'Right', FACE_FRONT );
        var RightTextPanel = layoutText(
            bindings,
            ['Rules'],
            'Right',
            FACE_FRONT
        );
        //	RightTextTab.editorTabScrolling = true;
        //	RightTextTab.addToEditor( editor, string( 'AHLCG-Rules' ) + ': ' + string( 'AHLCG-Right' ) );

        var spacingRightSpinner = new spinner(10, 300, 1, 100);
        bindings.add('LineSpacingRight', spacingRightSpinner, [0]);

        var RightTextTab = new Grid();
        RightTextTab.editorTabScrolling = true;
        RightTextTab.place(
            RightTextPanel,
            'wrap, pushx, growx',
            string('AHLCG-LineSpacing'),
            'align left, split',
            spacingRightSpinner,
            'align left',
            '%',
            'pushx, growx, wrap, align left'
        );

        RightTextTab.addToEditor(
            editor,
            string('AHLCG-Rules') + ': ' + string('AHLCG-Right')
        );

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

        Header_box = markupBox(sheet);
        Header_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'ResHeader-style'),
            null
        );
        Header_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Header-alignment')
        );

        Label_box = markupBox(sheet);
        Label_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Label-style'),
            null
        );
        Label_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Label-alignment')
        );

        Body_box = markupBox(sheet);
        Body_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Body-style'),
            null
        );
        Body_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Body-alignment')
        );
        Body_box.setTextFitting(FIT_NONE);
        initBodyTags(diy, Body_box);
        initGuideTags(diy, Body_box);

        Page_box = markupBox(sheet);
        Page_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Page-style'),
            null
        );
        Page_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Page-alignment')
        );

        setupGuidePortrait(diy, 0, $('PositionPortrait1'), false);
        setupGuidePortrait(diy, 1, $('PositionPortrait2'), false);
    }

    function createBackPainter(diy, sheet) {}

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        drawGuideTemplate(diy, g, sheet, Label_box);

        if ($('PageType') === 'Title') drawName(g, diy, sheet, Name_box);

        var bodyRegions = [
            diy.settings.getRegion(
                getExpandedKey(
                    FACE_FRONT,
                    'Body' + 'Left' + $('PageType') + '-region'
                )
            ),
            diy.settings.getRegion(
                getExpandedKey(
                    FACE_FRONT,
                    'Body' + 'Right' + $('PageType') + '-region'
                )
            ),
        ];

        drawGuidePortraits(g, diy, sheet);
        portraitBodyRegions = updateGuideBodyRegions(diy, bodyRegions);

        if ($('PageType') === 'Empty') drawPageNumber(g, diy, sheet, Page_box);

        drawGuideBody(
            g,
            diy,
            sheet,
            Body_box,
            Header_box,
            portraitBodyRegions[0],
            $('RulesLeft'),
            parseInt($('LineSpacingLeft'))
        );
        drawGuideBody(
            g,
            diy,
            sheet,
            Body_box,
            Header_box,
            portraitBodyRegions[1],
            $('RulesRight'),
            parseInt($('LineSpacingRight'))
        );
    }

    function paintBack(g, diy, sheet) {}

    function onClear() {
        setDefaults();
    }

    // These can be used to perform special processing during open/save.
    // For example, you can seamlessly upgrade from a previous version
    // of the script.
    function onRead(diy, oos) {
        if (diy.version < 6) {
            createPortraits(diy, PortraitTypeList);
        } else {
            readPortraits(diy, oos, PortraitTypeList, true);
        }

        if (diy.version < 16) {
            currentSettings().set('LineSpacingLeft', '100');
            currentSettings().set('LineSpacingRight', '100');
        }

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

export class Guide75Handler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
