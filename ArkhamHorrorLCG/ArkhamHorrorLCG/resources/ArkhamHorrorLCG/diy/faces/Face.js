// Base face for FaceHandler (handlers/FaceHandler.js). A face draws one side of
// a card and owns the settings, editor panels and markup boxes for that side.
// Settings keys take the face's binding suffix ('' or 'Back').
//
// Module: returns Face.
define( function () {
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

	// returns { general: [ { panel, title } ], tabs: [ { panel, title } ] }
	Face.prototype.createInterface = function( diy, bindings, faceIndex ) {
		return { general: [], tabs: [] };
	};

	// returns the face's markup boxes
	Face.prototype.createPainter = function( diy, sheet, faceIndex ) {
		return {};
	};

	// paints the whole sheet, bleed margin included
	Face.prototype.paint = function( g, diy, sheet, boxes ) {
	};

	// sets each key + suffix
	Face.prototype.setValues = function( diy, faceIndex, keep, values ) {
		for ( let key in values ) {
			let fullKey = key + this.suffix( faceIndex );
			if ( keep && diy.settings.getOverride( fullKey ) != null ) continue;
			diy.settings.set( fullKey, values[key] );
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
