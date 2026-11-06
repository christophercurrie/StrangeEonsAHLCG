// Globals for the legacy card handlers, which hand their work to modules.
// A handler defines CardTypes and BindingSuffixes, a card type and binding
// suffix per face, and PortraitTypeList, its portraits as <name>-<faces>.
useLibrary( 'amd' );

const AHLCGModules = {};
define( [ 'faces/FaceUtils', 'guide/GuideBody', 'guide/GuidePage', 'guide/GuidePanels', 'handlers/CardVersion', 'legacy/Card', 'legacy/CollectorLine', 'legacy/ImageFilters', 'legacy/Panels', 'legacy/Portraits', 'legacy/Sets', 'legacy/Templates', 'legacy/Text' ],
	function ( FaceUtils, GuideBody, GuidePage, GuidePanels, CardVersion, Card, CollectorLine, ImageFilters, Panels, Portraits, Sets, Templates, Text ) {
		AHLCGModules.FaceUtils = FaceUtils;
		AHLCGModules.GuideBody = GuideBody;
		AHLCGModules.GuidePage = GuidePage;
		AHLCGModules.GuidePanels = GuidePanels;
		AHLCGModules.CardVersion = CardVersion;
		AHLCGModules.Card = Card;
		AHLCGModules.CollectorLine = CollectorLine;
		AHLCGModules.ImageFilters = ImageFilters;
		AHLCGModules.Panels = Panels;
		AHLCGModules.Portraits = Portraits;
		AHLCGModules.Sets = Sets;
		AHLCGModules.Templates = Templates;
		AHLCGModules.Text = Text;
	} );

const PortraitList = [];
var LegacyCard = null;

// the handler's card, from its CardTypes, BindingSuffixes and PortraitTypeList
function legacyCard() {
	if ( LegacyCard == null ) {
		LegacyCard = new AHLCGModules.Card( useLibrary.__$.getSettingProvider(), CardTypes, BindingSuffixes, PortraitTypeList, PortraitList );
	}
	return LegacyCard;
}

const FACE_FRONT = 0;
const FACE_BACK = 1;

// Version of every card handler; to add an upgrade, raise it in
// handlers/CardVersion and guard the upgrade with the new value in onRead.
const CARD_VERSION = AHLCGModules.CardVersion;

// readEncounter is for older WeaknessEnemy and WeaknessTreachery saves, which have no encounter portrait
function readPortraits( diy, oos, typeList, readEncounter ) {
	AHLCGModules.Portraits.read( legacyCard(), diy, oos, readEncounter );
}

function writePortraits( oos, typeList ) {
	AHLCGModules.Portraits.write( legacyCard(), oos );
}

function setDefaultEncounter( diy ) {
	AHLCGModules.Sets.setDefaultEncounter( legacyCard(), diy );
}

function setDefaultCollection( diy ) {
	AHLCGModules.Sets.setDefaultCollection( legacyCard(), diy );
}

function updateCollection( diy ) {
	AHLCGModules.Sets.updateCollection( legacyCard(), diy );
}

function updateEncounter( diy ) {
	AHLCGModules.Sets.updateEncounter( legacyCard(), diy );
}

function clearImage( g, sheet ) {
	AHLCGModules.Templates.clear( g, sheet );
}

function paintPortrait( g, diy, sheet, name ) {
	AHLCGModules.Portraits.paint( legacyCard(), g, diy, sheet, name );
}

function getExpandedKey( faceIndex, key, appendix ) {
	return legacyCard().key( faceIndex, key, appendix );
}

function initBodyTags( diy, textBox ) {
	AHLCGModules.FaceUtils.initBodyTags( diy, textBox );
}

function initCopyrightTags( diy, textBox ) {
	AHLCGModules.FaceUtils.initCopyrightTags( diy, textBox );
}

function initGuideTags( diy, textBox ) {
	AHLCGModules.GuidePage.initTags( diy, textBox );
}

function createPortraits( diy, portraitKeys ) {
	AHLCGModules.Portraits.create( legacyCard(), diy );
}

function updateGuideBodyRegions( diy, bodyRegions ) {
	return AHLCGModules.GuidePage.bodyRegions( legacyCard(), bodyRegions );
}

function getPortraitCount() {
	return PortraitList.length;
}

function getPortrait( index ) {
	if( index < 0 || index >= PortraitList.length ) {
		throw new Error( 'Invalid portrait index: ' + index);
	}
	return PortraitList[ index ];
}

function getPortraitIndex( portraitName ) {
	return legacyCard().portraitIndex( portraitName );
}

function createGreyscaleImage( source ) {
	return AHLCGModules.ImageFilters.greyscale( source );
}

function drawTemplate( g, sheet, className ) {
	AHLCGModules.Templates.paintFront( legacyCard(), g, sheet );
}

// backType is the selected back for cards that offer Player and Encounter backs
function drawBackTemplate( g, sheet, backType ) {
	AHLCGModules.Templates.paintBack( legacyCard(), g, sheet, backType );
}

function drawUltimatumTemplate( g, diy, sheet, ultimatum_type, subtitle ) {
	var subtype = subtitle.length == 0 ? 'Common' : 'Refraction';

	AHLCGModules.Templates.paintFullBleed( legacyCard(), g, sheet, AHLCGModules.Templates.templateKey( ultimatum_type + '-' + subtype ) );
}

function drawUltimatumSubtitle( g, diy, sheet, textBox, text ) {
	AHLCGModules.Text.singleLine( legacyCard(), g, diy, sheet, textBox, 'Subtitle', text );
}

function drawUltimatumTraits( g, diy, sheet, textBox, text ) {
	AHLCGModules.Text.singleLine( legacyCard(), g, diy, sheet, textBox, 'Trait', text );
}

function drawGuideTemplate( diy, g, sheet, labelBox ) {
	AHLCGModules.GuidePage.paintTemplate( legacyCard(), g, diy, sheet, labelBox );
}

function drawGuideTemplateA4( diy, g, sheet, labelBox ) {
	AHLCGModules.GuidePage.paintTemplate( legacyCard(), g, diy, sheet, labelBox );
}

function drawGuideTemplateLetter( diy, g, sheet, labelBox ) {
	AHLCGModules.GuidePage.paintTemplate( legacyCard(), g, diy, sheet, labelBox );
}

function drawGuidePortraits( g, diy, sheet ) {
	AHLCGModules.GuidePage.paintPortraits( legacyCard(), g, diy, sheet );
}

function drawName( g, diy, sheet, nameBox ) {
	AHLCGModules.Text.name( legacyCard(), g, diy, sheet, nameBox );
}

function draw2LineName( g, diy, sheet, nameBox ) {
	AHLCGModules.Text.twoLineName( legacyCard(), g, diy, sheet, nameBox );
}

function drawBody( g, diy, sheet, bodyBox, partsArray ) {
	AHLCGModules.Text.body( legacyCard(), g, diy, sheet, bodyBox, partsArray );
}

function drawGuideBody( g, diy, sheet, bodyBox, headerBox, bodyRegion, text, spacing ) {
	AHLCGModules.GuideBody.paint( legacyCard(), g, diy, sheet, bodyBox, headerBox, bodyRegion, text, spacing );
}

function drawArtist( g, diy, sheet, artistBox, forceFrontValue ) {
	AHLCGModules.CollectorLine.paintArtist( legacyCard(), g, diy, sheet, artistBox, forceFrontValue );
}

// collectionSuffix is unused; legacy handlers draw no side suffix
function drawCollectorInfo( g, diy, sheet, collectionNumberBox, collectionSuffix, collectionIcon, encounterNumberBox, encounterIcon, copyrightBox, artistBox ) {
	AHLCGModules.CollectorLine.paint( legacyCard(), g, diy, sheet, collectionNumberBox, collectionIcon, encounterNumberBox, encounterIcon, copyrightBox, artistBox );
}

function drawEncounterIcon( g, diy, sheet ) {
	AHLCGModules.CollectorLine.paintEncounterIcon( legacyCard(), g, diy, sheet );
}

function drawPageNumber( g, diy, sheet, pageBox ) {
	AHLCGModules.GuidePage.paintPageNumber( legacyCard(), g, diy, sheet, pageBox );
}

function drawWatermark( g, diy, sheet ) {
	AHLCGModules.CollectorLine.paintWatermark( legacyCard(), g, diy, sheet );
}

function layoutTitle( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.title( legacyCard(), diy, bindings, subtitle, updateFaces, bindingFaceIndex );
}

function layoutTitle2( diy, bindings, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.title2( legacyCard(), diy, bindings, updateFaces, bindingFaceIndex );
}

function layoutTitleUnique( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.titleUnique( legacyCard(), diy, bindings, subtitle, updateFaces, bindingFaceIndex );
}

function layoutTitleGuide( diy, bindings, updateFaces, bindingFaceIndex, portraitPanels ) {
	return AHLCGModules.GuidePanels.title( legacyCard(), diy, bindings, updateFaces, bindingFaceIndex, portraitPanels );
}

function layoutGuideStats( bindings, faceIndex ) {
	return AHLCGModules.GuidePanels.stats( legacyCard(), bindings, faceIndex );
}

function layoutConcealedStats( diy, bindings, faceIndex ) {
	return AHLCGModules.Panels.concealedStats( legacyCard(), bindings, faceIndex );
}

function layoutCopyright( bindings, selectFaces, faces, faceIndex ) {
	return AHLCGModules.Panels.copyright( bindings, selectFaces, faces );
}

function layoutText( bindings, parts, suffix, faceIndex ) {
	return AHLCGModules.Panels.text( legacyCard(), bindings, parts, suffix, faceIndex );
}

function setupGuidePortrait( diy, portraitIndex, positionOption, settingUp ) {
	AHLCGModules.GuidePage.setupPortrait( legacyCard(), diy, portraitIndex, positionOption, settingUp );
}

function layoutPortraits( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	return layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist )[0];
}

function layoutHSBPanel( diy, bindings ) {
	return AHLCGModules.Panels.tint( bindings );
}

function layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	return AHLCGModules.Panels.portraits( legacyCard(), diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist );
}

function layoutGuidePortraits( diy, bindings, leftPortrait, rightPortrait, mirror ) {
	return AHLCGModules.GuidePanels.portraits( legacyCard(), diy, bindings, leftPortrait, rightPortrait, mirror );
}

function layoutCollection( bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex ) {
	return AHLCGModules.Panels.collection( legacyCard(), bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex );
}

function layoutEncounter( bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.encounter( legacyCard(), bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex );
}

function layoutSimpleEncounter( bindings, portraitPanel, iconFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.simpleEncounter( legacyCard(), bindings, portraitPanel, iconFaces, bindingFaceIndex );
}
