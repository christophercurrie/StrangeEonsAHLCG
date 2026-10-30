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
define( [ 'se/diy', 'se/strings', 'se/ui', 'ui/Bindings' ], function ( diyLibrary, strings, ui, Bindings ) {
	const FACE_FRONT = 0;
	const FACE_BACK = 1;
	const GeneralHint = 'wrap, pushx, growx';

	function FaceHandler( config, front, back ) {
		this.version = config.version;
		this.templateKeys = config.templateKeys;

		this.faces = [ front, back ];
		this.boxes = [ null, null ];
		this.portraits = [];

		// the open editor: its bindings, General tab panel and tab, and what
		// each side added to them
		this.editor = null;
		this.bindings = null;
		this.generalPanel = null;
		this.generalTab = null;
		this.sideInterfaces = [ null, null ];
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
		var tabPane = editor.getTabbedPane();

		this.editor = editor;
		this.bindings = new Bindings( editor, diy );

		var GeneralTab = new ui.Grid();
		GeneralTab.editorTabScrolling = true;
		var general = this.createGeneralPanels( diy, editor, this.bindings );
		for ( let i = 0; i < general.length; i++ ) {
			GeneralTab.place( general[i], GeneralHint );
		}
		this.generalPanel = GeneralTab.addToEditor( editor, strings.string( 'AHLCG-General' ) );
		// added before the last tab
		this.generalTab = tabPane.getComponentAt( tabPane.getTabCount() - 2 );

		for ( let faceIndex = 0; faceIndex < this.faces.length; faceIndex++ ) {
			this.addFaceInterface( diy, faceIndex );
		}

		this.bindings.bind();
	};

	// Adds a side's panels to the General tab and its tabs after the General
	// tab, before those of the back.
	FaceHandler.prototype.addFaceInterface = function( diy, faceIndex ) {
		var tabPane = this.editor.getTabbedPane();
		var faceUi = this.faces[faceIndex].createInterface( diy, this.bindings, faceIndex );
		var side = { general: [], tabs: [] };
		var sideName = strings.string( faceIndex === FACE_FRONT ? 'AHLCG-Front' : 'AHLCG-Back' );
		var back = faceIndex === FACE_FRONT ? this.sideInterfaces[FACE_BACK] : null;

		var generalIndex = this.generalPanel.getComponentCount() - ( back ? back.general.length : 0 );
		for ( let j = 0; j < faceUi.general.length; j++ ) {
			faceUi.general[j].panel.setTitle( faceUi.general[j].title + ': ' + sideName );
			let panel = faceUi.general[j].panel.realize();
			this.generalPanel['add(java.awt.Component,java.lang.Object,int)']( panel, GeneralHint, generalIndex + j );
			side.general.push( panel );
		}

		var tabIndex = tabPane.indexOfComponent( this.generalTab ) + 1;
		if ( faceIndex !== FACE_FRONT ) tabIndex += this.sideInterfaces[FACE_FRONT].tabs.length;
		for ( let j = 0; j < faceUi.tabs.length; j++ ) {
			faceUi.tabs[j].panel.editorTabScrolling = true;
			faceUi.tabs[j].panel.addToEditor( this.editor, faceUi.tabs[j].title + ': ' + sideName, null, null, tabIndex + j );
			side.tabs.push( tabPane.getComponentAt( tabIndex + j ) );
		}

		this.sideInterfaces[faceIndex] = side;
		this.generalPanel.revalidate();
		this.generalPanel.repaint();
	};

	FaceHandler.prototype.removeFaceInterface = function( diy, faceIndex ) {
		var tabPane = this.editor.getTabbedPane();
		var side = this.sideInterfaces[faceIndex];

		this.faces[faceIndex].removeInterface( diy, this.bindings, faceIndex );
		for ( let j = 0; j < side.general.length; j++ ) {
			this.generalPanel.remove( side.general[j] );
		}
		for ( let j = 0; j < side.tabs.length; j++ ) {
			tabPane.remove( side.tabs[j] );
		}
		this.sideInterfaces[faceIndex] = null;
	};

	// Calls change, which replaces the face on a side, updating the open editor
	// in place: the side's controls, and new sheets, since templates can differ.
	FaceHandler.prototype.changeFace = function( diy, faceIndex, change ) {
		this.bindings.flush();
		this.removeFaceInterface( diy, faceIndex );
		change();
		this.addFaceInterface( diy, faceIndex );
		this.editor.setGameComponent( diy );
		diy.markChanged( faceIndex );
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
