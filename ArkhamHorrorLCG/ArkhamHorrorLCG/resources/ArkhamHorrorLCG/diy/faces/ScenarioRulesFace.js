// Scenario rules page: title, rules text and page number. A resolution page
// shows a fixed header in place of the title.
//
// Module: returns ScenarioRulesFace.
define( [ 'faces/Face', 'faces/FaceUtils', 'se/markup', 'se/strings', 'se/ui' ],
function ( Face, FaceUtils, markup, strings, ui ) {
	function ScenarioRulesFace() {
		Face.call( this );
	}

	ScenarioRulesFace.prototype = Object.create( Face.prototype );
	ScenarioRulesFace.prototype.constructor = ScenarioRulesFace;
	ScenarioRulesFace.prototype.template = 'AHLCG-Scenario';

	ScenarioRulesFace.prototype.setDefaults = function( diy, faceIndex, keep ) {
		var values = {
			Page: String( faceIndex + 1 ),
			Resolution: '0',
			Rules: ''
		};
		// the front's title is the component name
		if ( faceIndex !== 0 ) values.Title = '';
		this.setValues( diy, faceIndex, keep, values );
	};

	ScenarioRulesFace.prototype.createInterface = function( diy, bindings, faceIndex ) {
		var suffix = this.suffix( faceIndex );

		var titlePanel = new ui.Grid();
		var titleArea = new ui.textArea( '', 2, 30 );
		if ( faceIndex === 0 ) diy.setNameField( titleArea );
		else bindings.add( 'Title' + suffix, titleArea, [ faceIndex ] );
		var resolutionBox = new ui.checkBox( strings.string( 'AHLCG-ScenarioRules-Resolution' ) );
		bindings.add( 'Resolution' + suffix, resolutionBox, [ faceIndex ] );
		titlePanel.place( strings.string( 'AHLCG-Title' ), 'align right', titleArea, 'wrap, pushx, growx' );
		titlePanel.place( resolutionBox, 'skip 1, wrap' );

		var statPanel = new ui.Grid();
		var pageSpinner = new ui.spinner( 0, 50, 1, 1 );
		bindings.add( 'Page' + suffix, pageSpinner, [ faceIndex ] );
		statPanel.place( strings.string( 'AHLCG-Page' ), 'align right, gapx 10', pageSpinner, 'wrap' );

		var textPanel = new ui.Grid();
		textPanel.setTitle( strings.string( 'AHLCG-Rules' ) );
		var rulesArea = new ui.textArea( '', 18, 30 );
		bindings.add( 'Rules' + suffix, rulesArea, [ faceIndex ] );
		textPanel.place( strings.string( 'AHLCG-Rules' ), 'spany 3, aligny top, gaptop 5, align right',
			rulesArea, 'spany 3, pushx, growx' );
		for ( let i = 1; i <= 3; i++ ) {
			textPanel.place( new ui.tipButton( strings.string( 'AHLCG-RulesTip' + i ) ), 'wrap, aligny top, gaptop 5' );
		}

		return {
			general: [
				{ panel: titlePanel, title: strings.string( 'AHLCG-Title' ) },
				{ panel: statPanel, title: strings.string( 'AHLCG-BasicData' ) }
			],
			tabs: [
				{ panel: textPanel, title: strings.string( 'AHLCG-Rules' ) }
			]
		};
	};

	ScenarioRulesFace.prototype.createBox = function( diy, sheet, name ) {
		var box = markup.markupBox( sheet );
		box.defaultStyle = diy.settings.getTextStyle( this.key( diy.settings, name + '-style' ), null );
		box.alignment = diy.settings.getTextAlignment( this.key( diy.settings, name + '-alignment' ) );
		return box;
	};

	ScenarioRulesFace.prototype.createPainter = function( diy, sheet, faceIndex ) {
		var boxes = {
			name: this.createBox( diy, sheet, 'Name' ),
			header: this.createBox( diy, sheet, 'Header' ),
			page: this.createBox( diy, sheet, 'Page' ),
			body: this.createBox( diy, sheet, 'Body' )
		};
		boxes.name.setLineTightness( Number( diy.settings.get( this.key( diy.settings, 'Name-tightness' ) ) ) );
		FaceUtils.initBodyTags( diy, boxes.name );
		FaceUtils.initBodyTags( diy, boxes.body );
		return boxes;
	};

	ScenarioRulesFace.prototype.paint = function( g, diy, sheet, boxes ) {
		var faceIndex = sheet.getSheetIndex();
		var suffix = this.suffix( faceIndex );
		var title = faceIndex === 0 ? String( diy.name ) : String( diy.settings.get( 'Title' + suffix, '' ) );

		this.paintTemplate( g, sheet );
		FaceUtils.translateToTrim( g, sheet );

		var resolution = String( diy.settings.get( 'Resolution' + suffix, '0' ) ) === '1';
		var bodyRegion = resolution ? 'BodyResolution-region' : title.length > 0 ? 'BodyName-region' : 'Body-region';

		if ( !resolution ) this.paintTitle( g, diy, boxes.name, title );
		this.paintPage( g, diy, boxes.page, String( diy.settings.get( 'Page' + suffix, '' ) ) );
		if ( resolution ) this.paintResolutionHeader( g, diy, boxes.header );
		this.paintRules( g, diy, boxes.body, String( diy.settings.get( 'Rules' + suffix, '' ) ), bodyRegion );
	};

	// two header lines over a double rule as wide as the wider line
	ScenarioRulesFace.prototype.paintResolutionHeader = function( g, diy, box ) {
		var region = diy.settings.getRegion( this.key( diy.settings, 'Header-region' ) );
		region.y += parseInt( FaceUtils.plugin().victoryFontOffset );

		box.markupText = strings.gstring( 'AHLCG-Scenario-Header1' );
		var height = box.measure( g, region );
		var width1 = box.drawAsSingleLine( g, region ) + 4.0;

		region.y += height;

		box.markupText = '<size 80%>' + strings.gstring( 'AHLCG-Scenario-Header2' ) + '<size 125%>';
		height = box.measure( g, region );
		var width2 = box.drawAsSingleLine( g, region ) + 4.0;

		var width = Math.max( width1, width2 );
		var left = region.x + ( region.width - width ) / 2;
		var right = region.x + ( region.width + width ) / 2;
		var y = region.y + height;

		g.setPaint( java.awt.Color.BLACK );
		g.setStroke( new java.awt.BasicStroke( 1.0 ) );
		g.drawLine( left, y, right, y );
		g.drawLine( left, y + 4, right, y + 4 );
	};

	// one line centered, or two lines at the top and bottom of the region
	ScenarioRulesFace.prototype.paintTitle = function( g, diy, box, title ) {
		box.markupText = '';
		if ( title.length === 0 ) return;

		var region = diy.settings.getRegion( this.key( diy.settings, 'Name-region' ) );
		region.y += parseInt( FaceUtils.plugin().titleFontOffset );

		var lines = title.split( '\n' );
		if ( lines.length > 1 ) {
			box.markupText = lines[0];
			box.alignment = markup.LAYOUT_TOP | markup.LAYOUT_CENTER;
			box.drawAsSingleLine( g, region );

			box.markupText = lines[1];
			box.alignment = markup.LAYOUT_BOTTOM | markup.LAYOUT_CENTER;
			box.drawAsSingleLine( g, region );
		}
		else {
			region.y += 1;
			box.markupText = lines[0];
			box.alignment = markup.LAYOUT_MIDDLE | markup.LAYOUT_CENTER;
			box.drawAsSingleLine( g, region );
		}
	};

	ScenarioRulesFace.prototype.paintPage = function( g, diy, box, page ) {
		var parity = Number( page ) % 2 === 0 ? 'PageEven' : 'PageOdd';
		box.markupText = page;
		box.drawAsSingleLine( g, diy.settings.getRegion( this.key( diy.settings, parity + '-region' ) ) );
	};

	ScenarioRulesFace.prototype.paintRules = function( g, diy, box, rules, regionName ) {
		var settings = diy.settings;
		var o = FaceUtils.plugin();

		box.setLineTightness( Number( settings.get( this.key( settings, 'Body-tightness' ) ) ) * o.bodyFontTightness );
		box.setTextFitting( markup.FIT_SCALE_TEXT );
		box.setReplacementForTag( 'fullnameb', settings.get( 'TitleBack' ) );

		var region = settings.getRegion( this.key( settings, regionName ) );
		region.y += parseInt( o.bodyFontOffset );

		box.markupText = rules;
		markup.updateNameTags( box, diy );
		box.draw( g, region );
	};

	return ScenarioRulesFace;
} );
