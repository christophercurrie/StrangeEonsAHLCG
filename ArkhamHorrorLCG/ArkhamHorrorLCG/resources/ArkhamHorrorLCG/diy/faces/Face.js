// Base face for FaceHandler (handlers/FaceHandler.js). A face draws one side of
// a card and owns the settings, editor panels and markup boxes for that side.
// Settings keys take the face's binding suffix ('' or 'Back').
//
// Module: returns Face.
define( [ 'faces/FaceUtils', 'se/markup', 'se/strings', 'se/ui' ], function ( FaceUtils, markup, strings, ui ) {
	const Suffixes = [ '', 'Back' ];

	function Face() {
	}

	// settings key prefix of the face's template: <template>-template is the
	// image; the card size also follows its bleed margin and resolution
	Face.prototype.template = null;
	// template bleed margin in points
	Face.prototype.bleedMargin = 8.64;
	// template resolution in pixels per inch, or null for the default
	Face.prototype.dpi = null;

	Face.prototype.suffix = function( faceIndex ) {
		return Suffixes[faceIndex];
	};

	// with keep, only sets keys the component lacks
	Face.prototype.setDefaults = function( diy, faceIndex, keep ) {
	};

	// removes settings that describe the face's type, when another face
	// replaces it
	Face.prototype.clearType = function( diy, faceIndex ) {
	};

	// returns { general: [ { panel, title } ], tabs: [ { panel, title } ] }
	Face.prototype.createInterface = function( diy, bindings, faceIndex, editor ) {
		return { general: [], tabs: [] };
	};

	// returns the face's markup boxes
	Face.prototype.createPainter = function( diy, sheet, faceIndex ) {
		return {};
	};

	// paints the whole sheet, bleed margin included
	Face.prototype.paint = function( g, diy, sheet, boxes ) {
	};

	// <template>-<name> if set, else the shared AHLCG-<name>
	Face.prototype.key = function( settings, name ) {
		var key = this.template + '-' + name;
		return settings.get( key ) != null ? key : 'AHLCG-' + name;
	};

	// sets each key + suffix
	Face.prototype.setValues = function( diy, faceIndex, keep, values ) {
		var suffixed = {};
		for ( let key in values ) {
			suffixed[key + this.suffix( faceIndex )] = values[key];
		}
		this.setSettings( diy, keep, suffixed );
	};

	// sets each key as is
	Face.prototype.setSettings = function( diy, keep, values ) {
		for ( let key in values ) {
			if ( keep && diy.settings.getOverride( key ) != null ) continue;
			diy.settings.set( key, values[key] );
		}
	};

	// markup box styled by the face's <name>-style and <name>-alignment
	Face.prototype.createBox = function( diy, sheet, name ) {
		var box = markup.markupBox( sheet );
		box.defaultStyle = diy.settings.getTextStyle( this.key( diy.settings, name + '-style' ), null );
		box.alignment = diy.settings.getTextAlignment( this.key( diy.settings, name + '-alignment' ) );
		return box;
	};

	// the front's title is the component name; the back's is $TitleBack
	Face.prototype.getTitle = function( diy, faceIndex ) {
		if ( faceIndex === 0 ) return String( diy.name );
		return String( diy.settings.get( 'Title' + this.suffix( faceIndex ), '' ) );
	};

	// panel with a two line title field
	Face.prototype.createTitlePanel = function( diy, bindings, faceIndex ) {
		var panel = new ui.Grid();
		var titleArea = new ui.textArea( '', 2, 30 );
		if ( faceIndex === 0 ) diy.setNameField( titleArea );
		else bindings.add( 'Title' + this.suffix( faceIndex ), titleArea, [ faceIndex ] );
		panel.place( strings.string( 'AHLCG-Title' ), 'align right', titleArea, 'wrap, pushx, growx' );
		return panel;
	};

	// One line centered in <Name-region>, or two lines at its top and bottom.
	Face.prototype.paintTitle = function( g, diy, box, title ) {
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

	// Paints the template image over the whole sheet. When rendering for
	// export or printing, the image set by <template>-template-hires is used
	// instead, if available; it is provided by a separate plug-in.
	Face.prototype.paintTemplate = function( g, sheet ) {
		sheet.paintImage( g, this.template + '-template', 0, 0 );
	};

	return Face;
} );
