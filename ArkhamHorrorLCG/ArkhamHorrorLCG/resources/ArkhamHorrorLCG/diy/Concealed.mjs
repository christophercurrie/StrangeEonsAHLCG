// The Concealed card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_BACK,
    FACE_FRONT,
    LegacyHandler,
    clearImage,
    createPortraits,
    draw2LineName,
    drawBackTemplate,
    drawTemplate,
    getExpandedKey,
    initBodyTags,
    layoutConcealedStats,
    layoutPortraits,
    layoutTitle2,
    paintPortrait,
    readPortraits,
    updateCollection,
    writePortraits,
} from './legacy/Adapter.mjs';
import { $, currentSettings, string } from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';
import { Grid } from 'strange-eons/legacy/uilayout';

const CardTypes = ['Concealed', 'ConcealedBack'];
const BindingSuffixes = ['', 'Back'];

const PortraitTypeList = ['Portrait-Front'];

// a card's handler functions, with its own boxes and panels
function script() {
    let Name_box, PortraitTab;

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

        diy.setCornerRadius(8);
        diy.version = CARD_VERSION;
    }

    function setDefaults() {
        currentSettings().set('Copyright', '');
        currentSettings().set('Template', 'Standard');

        currentSettings().set('BackTypeBack', 'Concealed');

        currentSettings().set('TemplateReplacement', '');
        currentSettings().set('TemplateReplacementBack', '');
    }

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

        //	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
        var TitlePanel = layoutTitle2(diy, bindings, [0], FACE_FRONT);
        var StatPanel = layoutConcealedStats(diy, bindings, FACE_FRONT);
        StatPanel.setTitle(
            string('AHLCG-BasicData') + ': ' + string('AHLCG-Front')
        );

        var StatisticsTab = new Grid();
        StatisticsTab.editorTabScrolling = true;
        StatisticsTab.place(
            TitlePanel,
            'wrap, pushx, growx',
            StatPanel,
            'wrap, pushx, growx'
        );
        StatisticsTab.addToEditor(editor, string('AHLCG-General'));

        PortraitTab = layoutPortraits(
            diy,
            bindings,
            'Portrait',
            null,
            true,
            false,
            false
        );
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
        /*
	Subtype_box = markupBox(sheet);
	Subtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtype-style'), null);
	Subtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtype-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );
	setTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );

	initBodyTags( diy, Body_box );

	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Artist-alignment'));

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Copyright-alignment'));

	initCopyrightTags( diy, Copyright_box );

	Collection_box = markupBox(sheet);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'CollectionNumber-style'), null);
	Collection_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'CollectionNumber-alignment'));
*/
    }

    function createBackPainter(diy, sheet) {}

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        paintPortrait(g, diy, sheet, 'Portrait');

        drawTemplate(g, sheet, '');

        //	drawName( g, diy, sheet, Name_box );
        draw2LineName(g, diy, sheet, Name_box);
        /*
	var subtypeRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Subtype-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) subtypeRegion.y -= 2;

	if ($( 'CardClass' ) == 'Weakness' ) {
		drawSubtype( g, diy, sheet, Subtype_box, gstring( 'AHLCG-Label-Weakness' ) );
	}
	else if ($( 'CardClass' ) == 'BasicWeakness' ) {
		drawSubtype( g, diy, sheet, Subtype_box, gstring( 'AHLCG-Label-BasicWeakness' ) );

		drawOverlay( g, diy, sheet, 'BasicWeaknessEvent' );
		drawBasicWeaknessIcon( g, diy, sheet );
	}
	else {
		drawLevel( g, diy, sheet, $( 'CardClass' ) );
	}

	drawCost( g, diy, sheet );

	drawSkillIcons( g, diy, sheet, $( 'CardClass' ) );

	var regionName = 'Body';
	if ( $( 'CardClass' ) == 'Weakness' || $( 'CardClass' ) == 'BasicWeakness') regionName = 'WeaknessBody';
	drawBodyWithRegionName( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ), regionName );

//	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
	drawCollectorInfo( g, diy, sheet, Collection_box, false, true, null, false, Copyright_box, Artist_box );
*/
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

        if (diy.version < 9) {
            currentSettings().set('Skill5', 'None');
        }
        if (diy.version < 12) {
            currentSettings().set('BackTypeBack', 'Player');
        } else if (diy.version < 17) {
            if ($('BackTypeundefined')) {
                // fix for bug causing undefined binding suffix
                currentSettings().set('BackTypeBack', $('BackTypeundefined'));
                diy.settings.reset('BackTypeundefined');
            }

            if ($('BackTypeBack') == null)
                currentSettings().set('BackTypeBack', 'Player'); // some cards created during testing might have both as null
        }

        if (diy.version < 15) {
            currentSettings().set('CardClass2', 'None');
            currentSettings().set('CardClass3', 'None');
            currentSettings().set('TemplateReplacement', '');
            currentSettings().set('TemplateReplacementBack', '');
        }
        if (diy.version < 18) {
            if ($('Copyright') == null) currentSettings().set('Copyright', '');
        }
        if (diy.version < 16) {
            diy.faceStyle = FaceStyle.TWO_FACES; // change was in v15, but I forgot to add this
        }

        updateCollection(diy);

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

export class ConcealedHandler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
