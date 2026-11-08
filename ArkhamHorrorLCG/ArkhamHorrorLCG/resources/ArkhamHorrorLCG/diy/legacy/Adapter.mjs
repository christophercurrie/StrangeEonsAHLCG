// Functions for the legacy card handlers, which hand their work to modules.
// A handler gives its CardTypes and BindingSuffixes, a card type and binding
// suffix per face, and PortraitTypeList, its portraits as <name>-<faces>, to
// attach before it calls the others.
import { useSettings } from 'strange-eons/legacy/common';
import FaceUtils from '../faces/FaceUtils.mjs';
import GuideBody from '../guide/GuideBody.mjs';
import GuidePage from '../guide/GuidePage.mjs';
import GuidePanels from '../guide/GuidePanels.mjs';
import CardVersion from '../handlers/CardVersion.mjs';
import Card from '../legacy/Card.mjs';
import CollectorLine from '../legacy/CollectorLine.mjs';
import ImageFilters from '../legacy/ImageFilters.mjs';
import Panels from '../legacy/Panels.mjs';
import Portraits from '../legacy/Portraits.mjs';
import Sets from '../legacy/Sets.mjs';
import Templates from '../legacy/Templates.mjs';
import Text from '../legacy/Text.mjs';

// The portraits and card of the handler being called. Cards of a plug-in
// share its modules, so LegacyHandler sets these before each call.
export let PortraitList = [];
let LegacyCard = null;

// the handler's card, given by attach
function legacyCard() {
    return LegacyCard;
}

// A card handler from a legacy handler's functions: script holds create,
// createInterface, createFrontPainter, createBackPainter, paintFront,
// paintBack, onClear, onRead and onWrite, each optional, with the arguments
// of the legacy handler functions. Each call first attaches the handler's
// card, from its settings, CardTypes, BindingSuffixes and PortraitTypeList.
export class LegacyHandler {
    constructor(cardTypes, bindingSuffixes, portraitTypeList, script) {
        this.cardTypes = cardTypes;
        this.bindingSuffixes = bindingSuffixes;
        this.portraitTypeList = portraitTypeList;
        this.script = script;
        this.portraits = [];
        this.card = null;
    }

    attach(diy) {
        useSettings(diy.settings);
        if (this.card == null) {
            this.card = new Card(
                diy.settings,
                this.cardTypes,
                this.bindingSuffixes,
                this.portraitTypeList,
                this.portraits
            );
        }
        LegacyCard = this.card;
        PortraitList = this.portraits;
    }

    call(diy, name, ...args) {
        this.attach(diy);
        const fn = this.script[name];
        if (fn != null) fn(...args);
    }

    create(diy) {
        this.call(diy, 'create', diy);
    }

    createInterface(diy, editor) {
        this.call(diy, 'createInterface', diy, editor);
    }

    createFrontPainter(diy, sheet) {
        this.call(diy, 'createFrontPainter', diy, sheet);
    }

    createBackPainter(diy, sheet) {
        this.call(diy, 'createBackPainter', diy, sheet);
    }

    paintFront(g, diy, sheet) {
        this.call(diy, 'paintFront', g, diy, sheet);
    }

    paintBack(g, diy, sheet) {
        this.call(diy, 'paintBack', g, diy, sheet);
    }

    onClear(diy) {
        this.call(diy, 'onClear');
    }

    onRead(diy, ois) {
        this.call(diy, 'onRead', diy, ois);
    }

    onWrite(diy, oos) {
        this.call(diy, 'onWrite', diy, oos);
    }

    getPortraitCount() {
        return this.portraits.length;
    }

    getPortrait(index) {
        if (index < 0 || index >= this.portraits.length) {
            throw new Error('Invalid portrait index: ' + index);
        }
        return this.portraits[index];
    }
}

export const FACE_FRONT = 0;
export const FACE_BACK = 1;

// Version of every card handler; to add an upgrade, raise it in
// handlers/CardVersion and guard the upgrade with the new value in onRead.
export const CARD_VERSION = CardVersion;

// readEncounter is for older WeaknessEnemy and WeaknessTreachery saves, which have no encounter portrait
export function readPortraits(diy, oos, typeList, readEncounter) {
    Portraits.read(legacyCard(), diy, oos, readEncounter);
}

export function writePortraits(oos, typeList) {
    Portraits.write(legacyCard(), oos);
}

export function setDefaultEncounter(diy) {
    Sets.setDefaultEncounter(legacyCard(), diy);
}

export function setDefaultCollection(diy) {
    Sets.setDefaultCollection(legacyCard(), diy);
}

export function updateCollection(diy) {
    Sets.updateCollection(legacyCard(), diy);
}

export function updateEncounter(diy) {
    Sets.updateEncounter(legacyCard(), diy);
}

export function clearImage(g, sheet) {
    Templates.clear(g, sheet);
}

export function paintPortrait(g, diy, sheet, name) {
    Portraits.paint(legacyCard(), g, diy, sheet, name);
}

export function getExpandedKey(faceIndex, key, appendix) {
    return legacyCard().key(faceIndex, key, appendix);
}

export function initBodyTags(diy, textBox) {
    FaceUtils.initBodyTags(diy, textBox);
}

export function initCopyrightTags(diy, textBox) {
    FaceUtils.initCopyrightTags(diy, textBox);
}

export function initGuideTags(diy, textBox) {
    GuidePage.initTags(diy, textBox);
}

export function createPortraits(diy, portraitKeys) {
    Portraits.create(legacyCard(), diy);
}

export function updateGuideBodyRegions(diy, bodyRegions) {
    return GuidePage.bodyRegions(legacyCard(), bodyRegions);
}

export function getPortraitCount() {
    return PortraitList.length;
}

export function getPortrait(index) {
    if (index < 0 || index >= PortraitList.length) {
        throw new Error('Invalid portrait index: ' + index);
    }
    return PortraitList[index];
}

export function getPortraitIndex(portraitName) {
    return legacyCard().portraitIndex(portraitName);
}

export function createGreyscaleImage(source) {
    return ImageFilters.greyscale(source);
}

export function drawTemplate(g, sheet, className) {
    Templates.paintFront(legacyCard(), g, sheet);
}

// backType is the selected back for cards that offer Player and Encounter backs
export function drawBackTemplate(g, sheet, backType) {
    Templates.paintBack(legacyCard(), g, sheet, backType);
}

export function drawUltimatumTemplate(g, diy, sheet, ultimatum_type, subtitle) {
    var subtype = subtitle.length === 0 ? 'Common' : 'Refraction';

    Templates.paintFullBleed(
        legacyCard(),
        g,
        sheet,
        Templates.templateKey(ultimatum_type + '-' + subtype)
    );
}

export function drawUltimatumSubtitle(g, diy, sheet, textBox, text) {
    Text.singleLine(legacyCard(), g, diy, sheet, textBox, 'Subtitle', text);
}

export function drawUltimatumTraits(g, diy, sheet, textBox, text) {
    Text.singleLine(legacyCard(), g, diy, sheet, textBox, 'Trait', text);
}

export function drawGuideTemplate(diy, g, sheet, labelBox) {
    GuidePage.paintTemplate(legacyCard(), g, diy, sheet, labelBox);
}

export function drawGuideTemplateA4(diy, g, sheet, labelBox) {
    GuidePage.paintTemplate(legacyCard(), g, diy, sheet, labelBox);
}

export function drawGuideTemplateLetter(diy, g, sheet, labelBox) {
    GuidePage.paintTemplate(legacyCard(), g, diy, sheet, labelBox);
}

export function drawGuidePortraits(g, diy, sheet) {
    GuidePage.paintPortraits(legacyCard(), g, diy, sheet);
}

export function drawName(g, diy, sheet, nameBox) {
    Text.name(legacyCard(), g, diy, sheet, nameBox);
}

export function draw2LineName(g, diy, sheet, nameBox) {
    Text.twoLineName(legacyCard(), g, diy, sheet, nameBox);
}

export function drawBody(g, diy, sheet, bodyBox, partsArray) {
    Text.body(legacyCard(), g, diy, sheet, bodyBox, partsArray);
}

export function drawGuideBody(
    g,
    diy,
    sheet,
    bodyBox,
    headerBox,
    bodyRegion,
    text,
    spacing
) {
    GuideBody.paint(
        legacyCard(),
        g,
        diy,
        sheet,
        bodyBox,
        headerBox,
        bodyRegion,
        text,
        spacing
    );
}

export function drawArtist(g, diy, sheet, artistBox, forceFrontValue) {
    CollectorLine.paintArtist(
        legacyCard(),
        g,
        diy,
        sheet,
        artistBox,
        forceFrontValue
    );
}

// collectionSuffix is unused; legacy handlers draw no side suffix
export function drawCollectorInfo(
    g,
    diy,
    sheet,
    collectionNumberBox,
    collectionSuffix,
    collectionIcon,
    encounterNumberBox,
    encounterIcon,
    copyrightBox,
    artistBox
) {
    CollectorLine.paint(
        legacyCard(),
        g,
        diy,
        sheet,
        collectionNumberBox,
        collectionIcon,
        encounterNumberBox,
        encounterIcon,
        copyrightBox,
        artistBox
    );
}

export function drawEncounterIcon(g, diy, sheet) {
    CollectorLine.paintEncounterIcon(legacyCard(), g, diy, sheet);
}

export function drawPageNumber(g, diy, sheet, pageBox) {
    GuidePage.paintPageNumber(legacyCard(), g, diy, sheet, pageBox);
}

export function drawWatermark(g, diy, sheet) {
    CollectorLine.paintWatermark(legacyCard(), g, diy, sheet);
}

export function layoutTitle(
    diy,
    bindings,
    subtitle,
    updateFaces,
    bindingFaceIndex
) {
    return Panels.title(
        legacyCard(),
        diy,
        bindings,
        subtitle,
        updateFaces,
        bindingFaceIndex
    );
}

export function layoutTitle2(diy, bindings, updateFaces, bindingFaceIndex) {
    return Panels.title2(
        legacyCard(),
        diy,
        bindings,
        updateFaces,
        bindingFaceIndex
    );
}

export function layoutTitleUnique(
    diy,
    bindings,
    subtitle,
    updateFaces,
    bindingFaceIndex
) {
    return Panels.titleUnique(
        legacyCard(),
        diy,
        bindings,
        subtitle,
        updateFaces,
        bindingFaceIndex
    );
}

export function layoutTitleGuide(
    diy,
    bindings,
    updateFaces,
    bindingFaceIndex,
    portraitPanels
) {
    return GuidePanels.title(
        legacyCard(),
        diy,
        bindings,
        updateFaces,
        bindingFaceIndex,
        portraitPanels
    );
}

export function layoutGuideStats(bindings, faceIndex) {
    return GuidePanels.stats(legacyCard(), bindings, faceIndex);
}

export function layoutConcealedStats(diy, bindings, faceIndex) {
    return Panels.concealedStats(legacyCard(), bindings, faceIndex);
}

export function layoutCopyright(bindings, selectFaces, faces, faceIndex) {
    return Panels.copyright(bindings, selectFaces, faces);
}

export function layoutText(bindings, parts, suffix, faceIndex) {
    return Panels.text(legacyCard(), bindings, parts, suffix, faceIndex);
}

export function setupGuidePortrait(
    diy,
    portraitIndex,
    positionOption,
    settingUp
) {
    GuidePage.setupPortrait(
        legacyCard(),
        diy,
        portraitIndex,
        positionOption,
        settingUp
    );
}

export function layoutPortraits(
    diy,
    bindings,
    frontPortrait,
    backPortrait,
    mirror,
    share,
    backArtist
) {
    return layoutPortraitsWithPanels(
        diy,
        bindings,
        frontPortrait,
        backPortrait,
        mirror,
        share,
        backArtist
    )[0];
}

export function layoutHSBPanel(diy, bindings) {
    return Panels.tint(bindings);
}

export function layoutPortraitsWithPanels(
    diy,
    bindings,
    frontPortrait,
    backPortrait,
    mirror,
    share,
    backArtist
) {
    return Panels.portraits(
        legacyCard(),
        diy,
        bindings,
        frontPortrait,
        backPortrait,
        mirror,
        share,
        backArtist
    );
}

export function layoutGuidePortraits(
    diy,
    bindings,
    leftPortrait,
    rightPortrait,
    mirror
) {
    return GuidePanels.portraits(
        legacyCard(),
        diy,
        bindings,
        leftPortrait,
        rightPortrait,
        mirror
    );
}

export function layoutCollection(
    bindings,
    portraitPanel,
    useSpinner,
    selectFaces,
    faces,
    bindingFaceIndex
) {
    return Panels.collection(
        legacyCard(),
        bindings,
        portraitPanel,
        useSpinner,
        selectFaces,
        faces,
        bindingFaceIndex
    );
}

export function layoutEncounter(
    bindings,
    portraitPanel,
    selectFaces,
    iconFaces,
    numberFaces,
    bindingFaceIndex
) {
    return Panels.encounter(
        legacyCard(),
        bindings,
        portraitPanel,
        selectFaces,
        iconFaces,
        numberFaces,
        bindingFaceIndex
    );
}

export function layoutSimpleEncounter(
    bindings,
    portraitPanel,
    iconFaces,
    bindingFaceIndex
) {
    return Panels.simpleEncounter(
        legacyCard(),
        bindings,
        portraitPanel,
        iconFaces,
        bindingFaceIndex
    );
}
