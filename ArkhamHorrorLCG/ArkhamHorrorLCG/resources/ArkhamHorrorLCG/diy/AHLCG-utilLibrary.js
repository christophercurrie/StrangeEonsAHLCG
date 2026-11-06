importClass( ca.cgjennings.ui.JUtilities );
importClass( arkham.diy.ListItem );
importClass( java.awt.geom.Point2D );
importClass( java.awt.AlphaComposite );
importClass( java.awt.Dimension );

// the modules this library hands its work to
useLibrary( 'amd' );
const AHLCGModules = {};
define( [ 'core/PluginInfo', 'faces/FaceUtils', 'guide/GuideBody', 'guide/GuidePage', 'guide/GuidePanels', 'legacy/Card', 'legacy/CollectorLine', 'legacy/ImageFilters', 'legacy/Portraits', 'legacy/Sets', 'legacy/Templates', 'legacy/Text' ],
	function ( PluginInfo, FaceUtils, GuideBody, GuidePage, GuidePanels, Card, CollectorLine, ImageFilters, Portraits, Sets, Templates, Text ) {
		AHLCGModules.PluginInfo = PluginInfo;
		AHLCGModules.FaceUtils = FaceUtils;
		AHLCGModules.GuideBody = GuideBody;
		AHLCGModules.GuidePage = GuidePage;
		AHLCGModules.GuidePanels = GuidePanels;
		AHLCGModules.Card = Card;
		AHLCGModules.CollectorLine = CollectorLine;
		AHLCGModules.ImageFilters = ImageFilters;
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

function getName() {
	return AHLCGModules.PluginInfo.name();
}

function getDescription() {
	return AHLCGModules.PluginInfo.description();
}

function getVersion() {
	return AHLCGModules.PluginInfo.version();
}

function getLocale() {
	return AHLCGModules.PluginInfo.locale();
}

// This function is a convenient shortcut for getting this plug-in's images
function image( resource, folder, ext ) {
	return AHLCGModules.PluginInfo.image( resource, folder, ext );
}

// readEncounter is for older WeaknessEnemy and WeaknessTreachery saves, which have no encounter portrait
function readPortraits( diy, oos, typeList, readEncounter ) {
	AHLCGModules.Portraits.read( legacyCard(), diy, oos, readEncounter );
}

// Version of every card handler; to add an upgrade, raise it and guard the
// upgrade with the new value in onRead.
const CARD_VERSION = 31;

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

function setPortraitPanelFileFieldEnabled( panel, enabled ) {
	AHLCGModules.Portraits.setFileFieldEnabled( panel, enabled );
}

function createPortraitMirrorButton( portraitName, portraitPanel ) {
	return AHLCGModules.Portraits.mirrorButton( legacyCard(), portraitName, portraitPanel );
}

function createPortraitInvertButton( portraitName ) {
	return AHLCGModules.Portraits.invertButton( legacyCard(), portraitName );
}

function createGreyscaleImage( source ) {
	return AHLCGModules.ImageFilters.greyscale( source );
}

function createInvertedImage( source ) {
	return AHLCGModules.ImageFilters.inverted( source );
}
