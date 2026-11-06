importClass( ca.cgjennings.ui.JUtilities );
importClass( arkham.diy.ListItem );
importClass( java.awt.geom.Point2D );
importClass( java.awt.AlphaComposite );
importClass( java.awt.Dimension );

// the modules this library hands its work to
useLibrary( 'amd' );
const AHLCGModules = {};
define( [ 'core/PluginInfo', 'faces/FaceUtils', 'legacy/Card', 'legacy/ImageFilters', 'legacy/Portraits', 'legacy/Sets', 'legacy/Templates' ],
	function ( PluginInfo, FaceUtils, Card, ImageFilters, Portraits, Sets, Templates ) {
		AHLCGModules.PluginInfo = PluginInfo;
		AHLCGModules.FaceUtils = FaceUtils;
		AHLCGModules.Card = Card;
		AHLCGModules.ImageFilters = ImageFilters;
		AHLCGModules.Portraits = Portraits;
		AHLCGModules.Sets = Sets;
		AHLCGModules.Templates = Templates;
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

function getBleedPixels( sheet ) {
	return AHLCGModules.FaceUtils.bleedPixels( sheet );
}

function paintPortrait( g, diy, sheet, name ) {
	AHLCGModules.Portraits.paint( legacyCard(), g, diy, sheet, name );
}

function getForceDisplay( key ) {
	var forceDisplay = false;

	switch ( key ) {
		case 'DeckOptions':
		case 'DeckRequirements':
			forceDisplay = true;
			break;
	}

	return forceDisplay;
}

function addSpacing( faceIndex, text, key, diy ) {
	var forceDisplay = getForceDisplay( key );

	var sectionText = $( key + BindingSuffixes[faceIndex] );
	var sectionSpacing = $( key + BindingSuffixes[faceIndex] + 'Spacing' );

	if (sectionSpacing == null) return text;

	var spacing = 0;

	if ( forceDisplay || sectionText != '' ) {
		if (key == 'Traits') spacing = 0.5;
		else spacing = 1.5;

		if (sectionSpacing != null && sectionSpacing > 0) spacing += parseInt(sectionSpacing);

		text = text + '\n<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt ' + spacing + 'pt>';
	}
	else if ( sectionSpacing != null && sectionSpacing > 0 ) {
		spacing = sectionSpacing;

		text = text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt ' + spacing + 'pt>';
	}

	return text;
}

function addTextPart( faceIndex, text, key, diy ) {
	var forceDisplay = getForceDisplay( key );

	if (forceDisplay == true || diy.settings.get( key + BindingSuffixes[faceIndex], '' ) != '') {
		if ( text != '' ) {
			text = text + '\n';
		}

		var format = '';
		var formatEnd = '';
		var alignment = '';
		var entryText = $( key + BindingSuffixes[faceIndex] );

		switch( key ) {
			case 'Traits':
				format = diy.settings.get( 'AHLCG-Traits-format', '<ts>' );
				formatEnd = diy.settings.get( 'AHLCG-Traits-formatEnd', '</ts>' );
				alignment = diy.settings.get( 'AHLCG-Traits-alignment', '<center>' );
				break;
			case 'Keywords':
				format = diy.settings.get('AHLCG-Keywords-format','');
				formatEnd = diy.settings.get('AHLCG-Keywords-formatEnd','');
				alignment = diy.settings.get('AHLCG-Keywords-alignment','<left>');
				break;
			case 'Rules':
				format = diy.settings.get('AHLCG-Rules-format','');
				formatEnd = diy.settings.get('AHLCG-Rules-formatEnd','');
				alignment = diy.settings.get('AHLCG-Rules-alignment','<left>');
				break;
			case 'Victory':
				format = diy.settings.get('AHLCG-Victory-format','<vic>');
				formatEnd = diy.settings.get('AHLCG-Victory-formatEnd','</vic>');
				alignment = diy.settings.get('AHLCG-Victory-alignment','<center>');
				break;
			case 'Story':
				format = diy.settings.get('AHLCG-Story-format','<i>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</i>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'ActStory':
				format = diy.settings.get('AHLCG-Story-format','<css>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</css>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'AgendaStory':
				format = diy.settings.get('AHLCG-Story-format','<gss>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</gss>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'Flavor':
				format = diy.settings.get('AHLCG-Flavor-format','<fs>');
				formatEnd = diy.settings.get('AHLCG-Flavor-formatEnd','</fs>');
				alignment = '<' + diy.settings.get('AHLCG-Flavor-alignment','center') +'>';
				break;
			case 'InvStory':
				format = diy.settings.get('AHLCG-SmallStory-format','<iss>');
				formatEnd = diy.settings.get('AHLCG-SmallStory-formatEnd','</iss>');
				alignment = '<' + diy.settings.get('AHLCG-SmallStory-alignment','left') + '>';
				break;
			case 'Text1':
			case 'Text2':
			case 'Text3':
			case 'Text4':
			case 'Text5':
			case 'Text6':
			case 'Text7':
			case 'Text8':
				format = '<hdr>' + $(key + 'NameBack') + '</hdr>: ';
				formatEnd = '';
				alignment = '<left>';
				break;
			case 'CustText1':
			case 'CustText2':
			case 'CustText3':
			case 'CustText4':
			case 'CustText5':
			case 'CustText6':
			case 'CustText7':
			case 'CustText8':
			case 'CustText9':
			case 'CustText10':
				var xpBox = '⧠';
				// I do not know why this is necessary for Times New Roman
				var xpStart = '<family>';
				var xpEnd = '</family>';

				if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Arno Pro' ) {
					xpBox = '☐';
					xpStart = '';
					xpEnd = '';
				}

				format = xpStart;

				let index = key.match(/\d+/);
				let costStr = $( 'CustCost' + index[0] );
				if ( costStr ) cost = parseInt(costStr);

				for ( let i = 0; i < cost; i++ ) {
					format = format + xpBox;
				}
				format = format + xpEnd + ' <hdr>' + $( 'CustName' + index[0] ) + '.</hdr> ';
				formatEnd = '';
				alignment = '<left>';
				break;
			}

		return text + alignment + format + entryText + formatEnd;
	}
	else {
		return text;
	}
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
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for( let index = 0; index < AHLCGObject.GuideStyleList.length; index++ ){
		let item = AHLCGObject.GuideStyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function createPortraits( diy, portraitKeys ) {
	AHLCGModules.Portraits.create( legacyCard(), diy );
}

function getGuidePortraitRegion( diy, position ) {
	var region = null;
	var pageWidth = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).width;
	var pageHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).height;
	var bodyHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'BodyLeft' + $PageType + '-region') ).height;
	var pageOffset = pageHeight - bodyHeight;

	var divisions = 3;
	if ( $PageType == 'Title' ) divisions = 2;

	var boxWidth = pageWidth / 2;
	var boxHeight = bodyHeight / divisions;

	switch ( position ) {
		case 'TopLeftSmall':
			region = new Region( 0, pageOffset, boxWidth, boxHeight );
			break;
		case 'TopLeftMedium':
			region = new Region( 0, pageOffset, boxWidth, bodyHeight/2 );
			break;
		case 'BottomLeftSmall':
			region = new Region( 0, pageHeight - boxHeight, boxWidth, boxHeight );
			break;
		case 'BottomLeftMedium':
			region = new Region( 0, pageHeight - bodyHeight/2, boxWidth, bodyHeight/2 );
			break;
		case 'TopRightSmall':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, boxHeight );
			break;
		case 'TopRightMedium':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, bodyHeight/2 );
			break;
		case 'BottomRightSmall':
			region = new Region( pageWidth - boxWidth, pageHeight - boxHeight, boxWidth, boxHeight );
			break;
		case 'BottomRightMedium':
			region = new Region( pageWidth - boxWidth, pageHeight - bodyHeight/2, boxWidth, bodyHeight/2 );
			break;
		case 'TopLarge':
			region = new Region( 0, pageOffset, pageWidth, boxHeight );
			break;
		case 'TopHalf':
			region = new Region( 0, pageOffset, pageWidth, bodyHeight/2 );
			break;
		case 'BottomLarge':
			region = new Region( 0, pageHeight - boxHeight, pageWidth, boxHeight );
			break;
		case 'BottomHalf':
			region = new Region( 0, pageHeight - bodyHeight/2, pageWidth, bodyHeight/2 );
			break;
		case 'LeftLarge':
			region = new Region( 0, pageOffset, boxWidth, bodyHeight );
			break;
		case 'RightLarge':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, bodyHeight );
			break;
		case 'TopLeftCorner':
			region = new Region( 0, pageOffset, pageWidth, boxHeight*2 );
			break;
		case 'BottomLeftCorner':
			region = new Region( 0, pageHeight - boxHeight*2, pageWidth, boxHeight*2 );
			break;
		case 'TopRightCorner':
			region = new Region( 0, pageOffset, pageWidth, boxHeight*2 );
			break;
		case 'BottomRightCorner':
			region = new Region( 0, pageHeight - boxHeight*2, pageWidth, boxHeight*2 );
			break;
		case 'FullPage':
			region = new Region( 0, pageOffset, pageWidth, bodyHeight );
			break;
	}

	return region;
}

function createPortraitStencil( diy, portrait, position, pageType ) {
	var offset = 30;	// blurring is clipped otherwise
	var pageOffset = 0;
	var bodyWidth = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).width;
	var pageHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).height;
	var bodyHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'BodyLeft' + pageType + '-region') ).height;
	var divisions = 3;
	if ( pageType == 'Title' ) {
//		if ( CardTypes[0] == 'Guide75' ) pageOffset = 307;
		if ( CardTypes[0] == 'Guide75' ) pageOffset = 313;
		else pageOffset = 352;

		divisions = 2;
	}

	var boxWidth = bodyWidth / 2;
	var boxHeight = bodyHeight / divisions;
	var stencil = ImageUtils.create( bodyWidth, pageHeight, true );
	var g = stencil.getGraphics();
	g.setColor( new Color( 0, 0, 0, 1.0 ) );
	g.fillRect(0, 0, bodyWidth, pageHeight);
	g.setComposite(AlphaComposite.Src);
	g.setColor( new Color( 0, 0, 0, 0.0 ) );

	switch ( position ) {
		case 'TopLeftSmall':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopLeftMedium':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomLeftSmall':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomLeftMedium':
			g.fillRoundRect(offset, pageHeight - bodyHeight/2 + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'TopRightSmall':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopRightMedium':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomRightSmall':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - boxHeight + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomRightMedium':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - bodyHeight/2 + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'TopLarge':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopHalf':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomLarge':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomHalf':
			g.fillRoundRect(offset, pageHeight - bodyHeight/2 + offset, bodyWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'LeftLarge':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
		case 'RightLarge':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
		case 'TopLeftCorner':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'BottomLeftCorner':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(offset, pageHeight - boxHeight*2 + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'TopRightCorner':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'BottomRightCorner':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - boxHeight*2 + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'FullPage':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
	}

	g.dispose();

	stencil = createBlurredImage( stencil );

	portrait.setClipStencil( stencil );
}

function updateGuideBodyRegions( diy, bodyRegions ) {
	// use portrait options to modify text regions
	var pageOffset = 0;
	var bodyHeight = 995;
	var pageHeight = 995;
//??	var bodyHeight = 947;
//??	var pageHeight = 947;
//	var bodyHeight = 1196;
//	var pageHeight = 1196;
	var divisions = 3;
	var spacer = 15;

	if ( $PageType == 'Title' ) {
		pageOffset = 313;
		bodyHeight = 682;
//		bodyHeight = 640;

		if ( CardTypes[0] == 'GuideA4' ) {
			pageOffset = 352;
			bodyHeight = 1272;
			spacer = -15;
		}

		divisions = 2;
	}
	else if ( CardTypes[0] == 'GuideA4' ) {
		bodyHeight = 1559;
		pageHeight = 1559;
		spacer = -15;
	}

	var boxHeight = bodyHeight / divisions;

	var leftDown = 0;
	var rightDown = 0;
	var leftUp = 0;
	var rightUp = 0;

	for ( let index = 1; index <= 2; index++ ) {
		switch ( (String)($( 'PositionPortrait' + index )) ) {
			case 'TopLeftSmall':
				leftDown = Math.max( leftDown, boxHeight );
				break;
			case 'TopLeftMedium':
				leftDown = Math.max( leftDown, bodyHeight/2 );
				break;
			case 'BottomLeftSmall':
				leftUp = Math.max( leftUp, boxHeight );
				break;
			case 'BottomLeftMedium':
				leftUp = Math.max( leftUp, bodyHeight/2 );
				break;
			case 'TopRightSmall':
				rightDown = Math.max( rightDown, boxHeight );
				break;
			case 'TopRightMedium':
				rightDown = Math.max( rightDown, bodyHeight/2 );
				break;
			case 'BottomRightSmall':
				rightUp = Math.max( rightUp, boxHeight );
				break;
			case 'BottomRightMedium':
				rightUp = Math.max( rightUp, bodyHeight/2 );
				break;
			case 'TopLarge':
				leftDown = Math.max( leftDown, boxHeight );
				rightDown = Math.max( rightDown, boxHeight );
				break;
			case 'TopHalf':
				leftDown = Math.max( leftDown, bodyHeight/2 );
				rightDown = Math.max( rightDown, bodyHeight/2 );
				break;
			case 'BottomLarge':
				leftUp = Math.max( leftUp, boxHeight );
				rightUp = Math.max( rightUp, boxHeight );
				break;
			case 'BottomHalf':
				leftUp = Math.max( leftUp, bodyHeight/2 );
				rightUp = Math.max( rightUp, bodyHeight/2 );
				break;
			case 'TopLeftCorner':
				rightDown = Math.max( rightDown, boxHeight );
				leftDown = Math.max( leftDown, boxHeight*2 );
				break;
			case 'BottomLeftCorner':
				rightUp = Math.max( rightUp, boxHeight );
				leftUp = Math.max( leftUp, boxHeight*2 );
				break;
			case 'TopRightCorner':
				leftDown = Math.max( leftDown, boxHeight );
				rightDown = Math.max( rightDown, boxHeight*2 );
				break;
			case 'BottomRightCorner':
				leftUp = Math.max( leftUp, boxHeight );
				rightUp = Math.max( rightUp, boxHeight*2 );
				break;
			case 'Full':
				leftDown = Math.max( leftDown, bodyHeight );
				rightDown = Math.max( rightDown, bodyHeight );
				break;
		}
	}

	if (leftDown > spacer) bodyRegions[0].y += leftDown - spacer;
	if (leftDown > spacer) bodyRegions[0].height -= leftDown - spacer;
	if (leftUp > spacer) bodyRegions[0].height -= leftUp - spacer - 30;	// -30 is to give a little extra room to avoid unnecessary red boxes
	if (rightDown > spacer) bodyRegions[1].y += rightDown - spacer;
	if (rightDown > spacer) bodyRegions[1].height -= rightDown - spacer;
	if (rightUp > spacer) bodyRegions[1].height -= rightUp - spacer - 30;

	return bodyRegions;
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

function getClassInitial( className ) {
	var initial;

	switch ( className ) {
		case 'Guardian':
			initial = 'G';
			break;
		case 'ParallelGuardian':
			initial = 'GP';
			break;
		case 'Seeker':
			initial = 'K';
			break;
		case 'ParallelSeeker':
			initial = 'KP';
			break;
		case 'Rogue':
			initial = 'R';
			break;
		case 'ParallelRogue':
			initial = 'RP';
			break;
		case 'Mystic':
			initial = 'M';
			break;
		case 'ParallelMystic':
			initial = 'MP';
			break;
		case 'Survivor':
			initial = 'V';
			break;
		case 'ParallelSurvivor':
			initial = 'VP';
			break;
		case 'Weakness':
		case 'BasicWeakness':
			initial = 'W';
			break;
		case 'Encounter':
			initial = 'E';
			break;
		case 'Neutral':
			initial = 'N';
			break;
		case 'Specialist':
			initial = 'P';
			break;
		case 'ParallelNeutral':
			initial = 'NP';
			break;
		case 'Story':
			initial = 'S';
			break;
		case 'StoryWeakness':
			initial = 'SW';
			break;
		case 'Dual':
			initial = 'D';
			break;
		case 'Test':
			initial = 'T';
			break;
		default:
			initial = '';
			break;
	}

	return initial;
}

function getSkillInitial( skillName )
{
	var initial;

	switch (skillName) {
		case 'Willpower':
			initial = 'W';
			break;
		case 'Intellect':
			initial = 'I';
			break;
		case 'Combat':
			initial = 'C';
			break;
		case 'Agility':
			initial = 'A';
			break;
		default:
			initial = 'D';
			break;
	}

	return initial;
}

function getClassArray( cardClass, cardClass2, cardClass3 ) {
	// return an array of classes
	var classes = [ cardClass ];

	if ( cardClass2 == null ) cardClass2 = 'None';
	if ( cardClass3 == null ) cardClass3 = 'None';

	if ( cardClass2 == 'None' && cardClass3 == 'None' ) return classes;

	let classInitial = getClassInitial( cardClass );

	// if not basic class, only return the first class
	if ( classInitial != 'G' && classInitial != 'K' && classInitial != 'R' && classInitial != 'M' && classInitial != 'V' ) return classes;

	// not dual class if the first class isn't a valid one or if the classes match
	if ( cardClass2 !== cardClass && cardClass2 !== 'None' ) classes.push( cardClass2 );
	if ( cardClass3 !== cardClass && cardClass3 !== cardClass2 && cardClass3 !== 'None' ) classes.push( cardClass3 );

	return classes;
}

function getClassCount( cardClass, cardClass2, cardClass3 ) {
	return getClassArray( cardClass, cardClass2, cardClass3 ).length;
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

// orientation belongs to the act/agenda front; other faces never reverse
function isReversed( faceIndex ) {
	return faceIndex == FACE_FRONT && $Orientation == 'Reversed';
}

function reverseRegion( region ) {
	region.x = 525 - ( region.x + region.width );

	return region;
}

function shiftRegion( region, cardType ) {
	// default shift right
	var offset = 209;

	if ( cardType == 'Agenda' ) {
		// shift left
		offset = -209;
	}

	region.x = region.x + offset;

	return region;
}

function createGreyscaleImage( source ) {
	return AHLCGModules.ImageFilters.greyscale( source );
}

function createInvertedImage( source ) {
	return AHLCGModules.ImageFilters.inverted( source );
}

function createBlurredImage( source ) {
	return AHLCGModules.ImageFilters.blurred( source );
}

function createAlphaInvertedImage( source ) {
	return AHLCGModules.ImageFilters.alphaInverted( source );
}

function createReturnToImage( iconImage )
{
	var icon = ImageUtils.resize( iconImage, 28, 28 );
	var base = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-ReturnToBase.png');

	var destImage = ImageUtils.create( 36, 33, true );
	var g = destImage.createGraphics();
	g.drawImage( base, 0, 0, null );
	g.setComposite( java.awt.AlphaComposite.DstOut );
	g.drawImage(icon, 4, 4, null);
	g.dispose();

	return destImage;
}
