// Card handler that dispatches to a front and back face (diy/faces).
// Subclasses pass their configuration and faces to the constructor and export
// an instance with handlers/exportHandler.
//
// config:
//   version       diy.version written on create and read
//   templateKeys  [ front, back ] template keys of the component; each face's
//                 template settings are copied to them, since the component's
//                 template keys can't change after create
//
// Subclasses may override setCardDefaults( diy ) for extra card-level
// defaults, upgrade( diy ) for version steps when reading older saves and
// createGeneralPanels( diy, editor, bindings ).
//
// Module: returns FaceHandler.
define( [ 'se/diy', 'se/strings', 'se/ui' ], function ( diyLibrary, strings, ui ) {
	const FACE_FRONT = 0;
	const FACE_BACK = 1;

	function FaceHandler( config, front, back ) {
		this.version = config.version;
		this.templateKeys = config.templateKeys;

		this.faces = [ front, back ];
		this.boxes = [ null, null ];
		this.portraits = [];
	}

	FaceHandler.prototype.setFace = function( faceIndex, face ) {
		this.faces[faceIndex] = face;
		this.boxes[faceIndex] = null;
	};

	FaceHandler.prototype.setCardDefaults = function( diy ) {
	};

	FaceHandler.prototype.upgrade = function( diy ) {
	};

	FaceHandler.prototype.setFaceTemplates = function( diy ) {
		for ( let i = 0; i < this.faces.length; i++ ) {
			let face = this.faces[i];
			let key = this.templateKeys[i];
			diy.settings.set( key + '-template', diy.settings.get( face.template + '-template' ) );
			diy.settings.set( key + '-bleed-margin', String( face.bleedMargin ) );
			if ( face.dpi != null ) diy.settings.set( key + '-dpi', String( face.dpi ) );
			else diy.settings.reset( key + '-dpi' );
		}
	};

	// panels placed first on the General tab
	FaceHandler.prototype.createGeneralPanels = function( diy, editor, bindings ) {
		return [];
	};

	FaceHandler.prototype.getPortraitCount = function() {
		return this.portraits.length;
	};

	FaceHandler.prototype.getPortrait = function( index ) {
		if ( index < 0 || index >= this.portraits.length ) {
			throw new Error( 'Invalid portrait index: ' + index );
		}
		return this.portraits[index];
	};

	FaceHandler.prototype.create = function( diy ) {
		this.setFaceTemplates( diy );
		diy.frontTemplateKey = this.templateKeys[FACE_FRONT];
		diy.backTemplateKey = this.templateKeys[FACE_BACK];

		diy.faceStyle = diyLibrary.FaceStyle.TWO_FACES;
		diy.customPortraitHandling = true;

		diy.name = '';

		this.setDefaults( diy );

		diy.setCornerRadius( 8 );
		diy.version = this.version;
	};

	FaceHandler.prototype.setDefaults = function( diy ) {
		for ( let i = 0; i < this.faces.length; i++ ) {
			this.faces[i].setDefaults( diy, i, false );
		}

		this.setCardDefaults( diy );
	};

	FaceHandler.prototype.createInterface = function( diy, editor ) {
		var bindings = new ui.Bindings( editor, diy );
		var sideNames = [ strings.string( 'AHLCG-Front' ), strings.string( 'AHLCG-Back' ) ];

		var general = this.createGeneralPanels( diy, editor, bindings );
		var tabs = [];
		for ( let faceIndex = 0; faceIndex < this.faces.length; faceIndex++ ) {
			let faceUi = this.faces[faceIndex].createInterface( diy, bindings, faceIndex );

			for ( let j = 0; j < faceUi.general.length; j++ ) {
				faceUi.general[j].panel.setTitle( faceUi.general[j].title + ': ' + sideNames[faceIndex] );
				general.push( faceUi.general[j].panel );
			}
			for ( let j = 0; j < faceUi.tabs.length; j++ ) {
				tabs.push( { panel: faceUi.tabs[j].panel, title: faceUi.tabs[j].title + ': ' + sideNames[faceIndex] } );
			}
		}

		var GeneralTab = new ui.Grid();
		GeneralTab.editorTabScrolling = true;
		for ( let i = 0; i < general.length; i++ ) {
			GeneralTab.place( general[i], 'wrap, pushx, growx' );
		}
		GeneralTab.addToEditor( editor, strings.string( 'AHLCG-General' ) );

		for ( let i = 0; i < tabs.length; i++ ) {
			tabs[i].panel.editorTabScrolling = true;
			tabs[i].panel.addToEditor( editor, tabs[i].title );
		}

		bindings.bind();
	};

	FaceHandler.prototype.createFacePainter = function( diy, sheet, faceIndex ) {
		this.boxes[faceIndex] = this.faces[faceIndex].createPainter( diy, sheet, faceIndex );
	};

	FaceHandler.prototype.createFrontPainter = function( diy, sheet ) {
		this.createFacePainter( diy, sheet, FACE_FRONT );
	};

	FaceHandler.prototype.createBackPainter = function( diy, sheet ) {
		this.createFacePainter( diy, sheet, FACE_BACK );
	};

	FaceHandler.prototype.paintFace = function( g, diy, sheet ) {
		var faceIndex = sheet.getSheetIndex();
		this.faces[faceIndex].paint( g, diy, sheet, this.boxes[faceIndex] );
	};

	FaceHandler.prototype.paintFront = function( g, diy, sheet ) {
		this.paintFace( g, diy, sheet );
	};

	FaceHandler.prototype.paintBack = function( g, diy, sheet ) {
		this.paintFace( g, diy, sheet );
	};

	FaceHandler.prototype.onClear = function( diy ) {
		this.setDefaults( diy );
	};

	FaceHandler.prototype.onRead = function( diy, ois ) {
		this.upgrade( diy );

		diy.setCornerRadius( 8 );
		diy.version = this.version;
	};

	FaceHandler.prototype.onWrite = function( diy, oos ) {
	};

	return FaceHandler;
} );
