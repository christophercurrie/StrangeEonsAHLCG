// Story card: title, an optional tracking box and game text blocks.
//
// Module: returns StoryFace.
define( [ 'faces/FaceUtils', 'faces/TextBlocksFace', 'se/strings' ],
function ( FaceUtils, TextBlocksFace, strings ) {
	function StoryFace() {
		TextBlocksFace.call( this );
	}

	StoryFace.prototype = Object.create( TextBlocksFace.prototype );
	StoryFace.prototype.constructor = StoryFace;
	StoryFace.prototype.template = 'AHLCG-StoryFace';

	StoryFace.prototype.createPainter = function( diy, sheet, faceIndex ) {
		var boxes = TextBlocksFace.prototype.createPainter.call( this, diy, sheet, faceIndex );
		boxes.label = this.createBox( diy, sheet, 'Label' );
		return boxes;
	};

	StoryFace.prototype.paint = function( g, diy, sheet, boxes ) {
		var faceIndex = sheet.getSheetIndex();

		this.paintTemplate( g, sheet );
		FaceUtils.translateToTrim( g, sheet );

		this.paintLabel( g, diy, boxes.label );
		this.paintTitle( g, diy, boxes.name, this.getTitle( diy, faceIndex ) );
		this.paintText( g, diy, sheet, boxes, 0 );
	};

	StoryFace.prototype.paintLabel = function( g, diy, box ) {
		var region = diy.settings.getRegion( this.key( diy.settings, 'Label-region' ) );
		region.y += parseInt( FaceUtils.plugin().typeFontOffset );

		box.markupText = String( strings.gstring( 'AHLCG-Label-Story' ) ).toUpperCase();
		box.drawAsSingleLine( g, region );
	};

	return StoryFace;
} );
