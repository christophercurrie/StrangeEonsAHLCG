// The MiniInvestigator card, from the legacy handler functions.
import {
    CARD_VERSION,
    FACE_BACK,
    FACE_FRONT,
    LegacyHandler,
    PortraitList,
    clearImage,
    createGreyscaleImage,
    createPortraits,
    drawArtist,
    drawTemplate,
    getExpandedKey,
    getPortraitIndex,
    layoutPortraits,
    paintPortrait,
    readPortraits,
    writePortraits,
} from './legacy/Adapter.mjs';
import { string } from 'strange-eons/legacy/common';
import { FaceStyle } from 'strange-eons/legacy/diy';
import { markupBox } from 'strange-eons/legacy/markup';
import { Bindings } from 'strange-eons/legacy/uibindings';

const AffineTransform = Java.type('java.awt.geom.AffineTransform');

const CardTypes = ['MiniInvestigator', 'MiniInvestigator'];
const BindingSuffixes = ['', 'Back'];

const PortraitTypeList = ['Portrait-Both'];

// a card's handler functions, with its own boxes and panels
function script() {
    let Artist_box, PortraitTab;

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

    function setDefaults() {}

    function createInterface(diy, editor) {
        var bindings = new Bindings(editor, diy);

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
        Artist_box = markupBox(sheet);
        Artist_box.defaultStyle = diy.settings.getTextStyle(
            getExpandedKey(FACE_FRONT, 'Artist-style'),
            null
        );
        Artist_box.alignment = diy.settings.getTextAlignment(
            getExpandedKey(FACE_FRONT, 'Artist-alignment')
        );
    }

    function createBackPainter(diy, sheet) {}

    function paintFront(g, diy, sheet) {
        clearImage(g, sheet);

        drawTemplate(g, sheet, '');

        paintPortrait(g, diy, sheet, 'Portrait');
        drawArtist(g, diy, sheet, Artist_box, false);
    }

    function paintBack(g, diy, sheet) {
        clearImage(g, sheet);

        drawTemplate(g, sheet, '');

        var imageTinted = PortraitList[getPortraitIndex('Portrait')].getImage();
        var imagePanX = PortraitList[getPortraitIndex('Portrait')].getPanX();
        var imagePanY = PortraitList[getPortraitIndex('Portrait')].getPanY();
        var imageRotation =
            PortraitList[getPortraitIndex('Portrait')].getRotation();
        var imageScale = PortraitList[getPortraitIndex('Portrait')].getScale();

        imageTinted = createGreyscaleImage(imageTinted);

        var region = diy.settings.getRegion(
            getExpandedKey(FACE_FRONT, 'Portrait-portrait-clip-region')
        );

        var AT = AffineTransform;
        var transform = AT.getTranslateInstance(
            region.x +
                region.width / 2 +
                imagePanX -
                (imageTinted.width * imageScale) / 2,
            region.y +
                region.height / 2 +
                imagePanY -
                (imageTinted.height * imageScale) / 2
        );
        transform.concatenate(AT.getScaleInstance(imageScale, imageScale));
        transform.concatenate(
            AT.getRotateInstance(
                (-imageRotation * Math.PI) / 180,
                imageTinted.width / 2,
                imageTinted.height / 2
            )
        );

        g.drawImage(imageTinted, transform, null);
    }

    function onClear() {
        setDefaults();
    }

    // These can be used to perform special processing during open/save.
    // For example, you can seamlessly upgrade from a previous version
    // of the script.
    function onRead(diy, oos) {
        readPortraits(diy, oos, PortraitTypeList, true);

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

export class MiniInvestigatorHandler extends LegacyHandler {
    constructor() {
        super(CardTypes, BindingSuffixes, PortraitTypeList, script());
    }
}
