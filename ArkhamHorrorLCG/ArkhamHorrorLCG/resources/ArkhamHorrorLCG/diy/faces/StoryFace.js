// Story card: title, an optional tracking box and game text blocks.
//
// Module: returns StoryFace.
define( [ 'faces/Face', 'faces/FaceUtils', 'faces/TextBlocks', 'se/common', 'se/imageutils', 'se/strings', 'se/ui' ],
function ( Face, FaceUtils, TextBlocks, common, imageutils, strings, ui ) {
	function StoryFace() {
		Face.call( this );
	}

	StoryFace.prototype = Object.create( Face.prototype );
	StoryFace.prototype.constructor = StoryFace;
	StoryFace.prototype.template = 'AHLCG-StoryFace';

	StoryFace.prototype.setDefaults = function( diy, faceIndex, keep ) {
		var suffix = this.suffix( faceIndex );
		var values = TextBlocks.defaults( suffix );
		values['ScaleModifier' + suffix] = '100';
		values['TrackerBox' + suffix] = '';
		values['TrackerHeight' + suffix] = '100';
		// the front's title is the component name
		if ( faceIndex !== 0 ) values['Title' + suffix] = '';

		this.setSettings( diy, keep, values );
	};

	StoryFace.prototype.createInterface = function( diy, bindings, faceIndex ) {
		var trackerPanel = new ui.Grid();
		trackerPanel.setTitle( strings.string( 'AHLCG-TrackerBox' ) );
		var trackerField = new ui.textField( '', 30 );
		this.bind( bindings, faceIndex, 'TrackerBox', trackerField );
		var heightSpinner = new ui.spinner( 50, 200, 1, 100 );
		this.bind( bindings, faceIndex, 'TrackerHeight', heightSpinner );
		trackerPanel.place(
			strings.string( 'AHLCG-TrackerBox' ), 'align right', trackerField, 'wrap, pushx, growx',
			strings.string( 'AHLCG-Height' ), 'align right', heightSpinner, 'align left, split', '%', 'pushx, growx, align left'
		);

		var textTab = new ui.Grid();
		textTab.place( TextBlocks.createPanel( diy, this, bindings, faceIndex ), 'wrap, pushx, growx' );
		textTab.place( trackerPanel, 'wrap, pushx, growx' );

		var scaleSpinner = new ui.spinner( 50, 150, 1, 100 );
		this.bind( bindings, faceIndex, 'ScaleModifier', scaleSpinner );
		textTab.place( strings.string( 'AHLCG-TextScale' ), 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left' );

		return {
			general: [
				{ panel: this.createTitlePanel( diy, bindings, faceIndex ), title: strings.string( 'AHLCG-Title' ) }
			],
			tabs: [
				{ panel: textTab, title: strings.string( 'AHLCG-Rules' ) }
			]
		};
	};

	StoryFace.prototype.createPainter = function( diy, sheet, faceIndex ) {
		var boxes = {
			label: this.createBox( diy, sheet, 'Label' ),
			name: this.createBox( diy, sheet, 'Name' ),
			traits: this.createBox( diy, sheet, 'Header' ),
			header: this.createBox( diy, sheet, 'Header' ),
			story: this.createBox( diy, sheet, 'Story' ),
			body: this.createBox( diy, sheet, 'Body' ),
			tracker: this.createBox( diy, sheet, 'TrackerName' )
		};
		FaceUtils.initBodyTags( diy, boxes.name );
		FaceUtils.initBodyTags( diy, boxes.traits );
		FaceUtils.initBodyTags( diy, boxes.header );
		FaceUtils.initBodyTags( diy, boxes.story );
		FaceUtils.initBodyTags( diy, boxes.body );
		return boxes;
	};

	StoryFace.prototype.paint = function( g, diy, sheet, boxes ) {
		var faceIndex = sheet.getSheetIndex();
		var suffix = this.suffix( faceIndex );

		this.paintTemplate( g, sheet );
		FaceUtils.translateToTrim( g, sheet );

		this.paintLabel( g, diy, boxes.label );
		this.paintTitle( g, diy, boxes.name, this.getTitle( diy, faceIndex ) );

		var tracker = String( diy.settings.get( 'TrackerBox' + suffix, '' ) );
		var trackerHeight = Number( diy.settings.get( 'TrackerHeight' + suffix, '100' ) );
		if ( tracker.length > 0 ) this.paintTracker( g, diy, sheet, boxes.tracker, tracker, trackerHeight );

		// the text ends above the top of the tracking box
		var bottomSpace = tracker.length > 0 ? 90 * trackerHeight / 100.0 + 10 : 0;
		var scaleModifier = Number( diy.settings.get( 'ScaleModifier' + suffix, '100' ) );
		TextBlocks.paint( g, diy, this, boxes, TextBlocks.read( diy.settings, suffix ), scaleModifier, bottomSpace );
	};

	StoryFace.prototype.paintLabel = function( g, diy, box ) {
		var region = diy.settings.getRegion( this.key( diy.settings, 'Label-region' ) );
		region.y += parseInt( FaceUtils.plugin().typeFontOffset );

		box.markupText = String( strings.gstring( 'AHLCG-Label-Story' ) ).toUpperCase();
		box.drawAsSingleLine( g, region );
	};

	// a box image stretched to the tracker height (percent), aligned to the
	// bottom of <TrackerBox-region>, with the name at its top
	StoryFace.prototype.paintTracker = function( g, diy, sheet, box, name, height ) {
		var ImageUtils = imageutils.ImageUtils;
		var Region = common.Region;

		var region = diy.settings.getRegion( this.key( diy.settings, 'TrackerBox-region' ) );
		var nameRegion = diy.settings.getRegion( this.key( diy.settings, 'TrackerName-region' ) );
		nameRegion.y += parseInt( FaceUtils.plugin().titleFontOffset );

		var diff = region.height * ( 100.0 - height ) / 100.0;
		region.y += diff;
		region.height -= diff;
		nameRegion.y += diff;

		var boxImage = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxTracker.png' );
		var lineImage = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-BoxTrackerLine.png' );
		var w = boxImage.getWidth();
		var h = boxImage.getHeight();

		// top, stretched middle and bottom (the top flipped)
		sheet.paintImage( g, boxImage, new Region( region.x, region.y, w, h ) );
		sheet.paintImage( g, lineImage, new Region( region.x, region.y + h, w, region.height - h * 2 ) );
		sheet.paintImage( g, ImageUtils.mirror( boxImage, false, true ), new Region( region.x, region.y + region.height - h, w, h ) );

		box.markupText = name;
		box.drawAsSingleLine( g, nameRegion );
	};

	return StoryFace;
} );
