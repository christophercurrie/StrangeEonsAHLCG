importClass( ca.cgjennings.graphics.ImageUtilities );
useLibrary('tints');

importClass( java.awt.RenderingHints );
importClass( java.awt.Rectangle );
importClass( java.awt.font.TextLayout );
importClass( java.awt.BasicStroke );
importClass( java.lang.System );
importClass( java.awt.Toolkit );

importClass( java.lang.reflect.Field );

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
