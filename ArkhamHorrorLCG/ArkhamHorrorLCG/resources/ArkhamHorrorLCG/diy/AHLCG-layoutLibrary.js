importClass( javax.swing.JTextField );

function layoutTitle( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();
	TitlePanel.setTitle( @AHLCG-Title );

	var titleField = new textField( '', 30 );

	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	TitlePanel.place(
		@AHLCG-Title, 'align right', titleField, 'wrap, pushx, growx'
		);

	if (subtitle) {
		var subtitleField = new textField( '', 30 );
		bindings.add( 'Subtitle' + BindingSuffixes[bindingFaceIndex], subtitleField, updateFaces );

		TitlePanel.place(
			@AHLCG-Subtitle, 'align right', subtitleField, 'wrap, pushx, growx'
			);
	}

	return TitlePanel;
}

// 2 lines
function layoutTitle2( diy, bindings, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();
	TitlePanel.setTitle( @AHLCG-Title );

	var titleArea = new textArea( '', 2, 30 );

	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleArea );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleArea, updateFaces );

	TitlePanel.place(
		@AHLCG-Title, 'align right', titleArea, 'wrap, pushx, growx'
		);

	return TitlePanel;
}

function layoutTitleUnique( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	var TitlePanel = new Grid();
	TitlePanel.setTitle( @AHLCG-Title );

	var titleField = new textField( '', 30 );

	if (bindingFaceIndex == FACE_FRONT) diy.setNameField( titleField );
	else bindings.add( 'Title' + BindingSuffixes[bindingFaceIndex], titleField, updateFaces );

	var uniqueIcon = ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-Unique.png'), 12, 12);
	var uniqueButton = new toggleButton( '', uniqueIcon, false );
	bindings.add( 'Unique' + BindingSuffixes[bindingFaceIndex], uniqueButton, updateFaces );

	TitlePanel.place(
		@AHLCG-Title, 'align right', uniqueButton, 'split, wmax 35, hmin 25, hmax 25', titleField, 'wrap, pushx, growx'
		);

	if (subtitle) {
		var subtitleField = new textField( '', 30 );
		bindings.add( 'Subtitle' + BindingSuffixes[bindingFaceIndex], subtitleField, updateFaces );

		TitlePanel.place(
			@AHLCG-Subtitle, 'align right', subtitleField, 'wrap, pushx, growx'
			);
	}

	return TitlePanel;
}

function layoutTitleGuide( diy, bindings, updateFaces, bindingFaceIndex, portraitPanels ) {
	return AHLCGModules.GuidePanels.title( legacyCard(), diy, bindings, updateFaces, bindingFaceIndex, portraitPanels );
}

function layoutGuideStats( bindings, faceIndex ) {
	return AHLCGModules.GuidePanels.stats( legacyCard(), bindings, faceIndex );
}

function layoutConcealedStats( diy, bindings, faceIndex ) {
	var StatsPanel = new Grid();
	StatsPanel.setTitle( @AHLCG-BasicData );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var TemplateList = new comboBox( AHLCGObject.comboConcealedTemplate, null );
	bindings.add( 'Template' + BindingSuffixes[faceIndex], TemplateList, [faceIndex] );

	StatsPanel.place(
		@AHLCG-Template, 'align right, gapx 10', TemplateList, 'pushx, growx, sizegroup sp'
		);

	return StatsPanel;
}

function layoutCopyright( bindings, selectFaces, faces, faceIndex ) {
	var CopyrightPanel = new Grid();
	CopyrightPanel.setTitle( @AHLCG-CopyrightTitle );

	var fieldWidth = selectFaces ? 20 : 30;

	var copyrightField = new textField( '', fieldWidth );
	bindings.add( 'Copyright', copyrightField, faces );

	if (selectFaces) {
		var frontBox = new checkBox( @AHLCG-Front, true, null );
		var backBox = new checkBox( @AHLCG-Back, true, null );

		bindings.add( 'ShowCopyrightFront', frontBox, [0] );
		bindings.add( 'ShowCopyrightBack', backBox, [1] );

		CopyrightPanel.place(
			@AHLCG-Copyright, 'align right', copyrightField, 'align left, split 3',
			frontBox, 'align right', backBox, 'align right, gapx 10'
		);
	}
	else {
		CopyrightPanel.place(
			@AHLCG-Copyright, 'align right', copyrightField, 'pushx, growx',
			new tipButton( @( 'AHLCG-CopyrightTip1' ) ), 'wrap, aligny top, gaptop 5'
		);
	}

	return CopyrightPanel;
}

function layoutText( bindings, parts, suffix, faceIndex ) {
	var TextPanel = new Grid();
	TextPanel.setTitle( @AHLCG-Rules );

	var tipCount = 0;

	for ( let index = 0; index < parts.length; index++ ) {
		let base = parts[index];
		let key = base + suffix;
		let tipkey = base;
		let tipAlign = 0;

		let field = null;
		let spaceSpinner = null;

		switch ( base ) {
			case 'Traits':
				field = new textField( '', 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 4;
				tipAlign = 1;	// horizontal
				break;
			case 'Keywords':
				field = new textArea( '', 6, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 1;
				break;
			case 'Rules':
				var height = 6;
				if ( CardTypes[faceIndex] == 'Scenario' ) height = 18;
				else if ( CardTypes[faceIndex] == 'Guide75' ) height = 40;
				else if ( CardTypes[faceIndex] == 'GuideA4' ) height = 40;
				else if ( CardTypes[faceIndex] == 'GuideLetter' ) height = 40;

				field = new textArea( '', height, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				if ( CardTypes[faceIndex] == 'Guide75' ) tipCount = 4;
				else if ( CardTypes[faceIndex] == 'GuideA4' )  tipCount = 4;
				else if ( CardTypes[faceIndex] == 'GuideLetter' )  tipCount = 4;
				else tipCount = 3;
				break;
			case 'Header':
				field = new textArea( '', 2, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 0;
				break;
			case 'Victory':
//				if ( CardTypes[faceIndex] == 'Location' ) {
					field = new textArea( '', 2, 30 );
					bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
//				}
//				else {
//					field = new textField( '', 30 );
//					bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );
//				}

				tipCount = 1;
				break;
			default:
				field = new textArea( '', 6, 30 );
				bindings.add( key + BindingSuffixes[faceIndex], field, [ faceIndex ] );

				tipCount = 0;
				break;
		}

		switch ( tipCount ) {
			case 0:
				TextPanel.place(
					@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'wrap, pushx, growx'
				);
				break;
			case 1:
				TextPanel.place(
					@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'pushx, growx'
				);
				break;
			default:
				if ( tipAlign == 0 ) {
					TextPanel.place(
						@( 'AHLCG-' + base ), 'spany ' + tipCount + ', aligny top, gaptop 5, align right', field, 'spany ' + tipCount + ', pushx, growx'
					);
				}
				else {
					TextPanel.place(
						@( 'AHLCG-' + base ), 'aligny top, gaptop 5, align right', field, 'split' + tipCount + ', pushx, growx'
					);
				}
				break;
		}

		for ( let tipIndex = 1; tipIndex <= tipCount; tipIndex++ ) {
			if ( @( 'AHLCG-' + base + 'Tip' ) != null ) {
				if ( tipAlign == 0 || tipIndex == tipCount ) {
					TextPanel.place(
						new tipButton( @( 'AHLCG-' + base + 'Tip' + tipIndex ) ), 'wrap, aligny top, gaptop 5'
					);
				}
				else
				{
					TextPanel.place(
						new tipButton( @( 'AHLCG-' + base + 'Tip' + tipIndex ) ), 'aligny top, gaptop 5'
					);
				}
			}
		}

		// don't do this for the last one
		if (index + 1 < parts.length ) {
			var spaceSpinner = new spinner( 0, 50, 1, 1 );

			bindings.add( key + BindingSuffixes[faceIndex] + 'Spacing', spaceSpinner, [ faceIndex ] );

			TextPanel.place(
				@AHLCG-Spacing, 'align right', spaceSpinner, 'wrap'
			);
		}
	}

	return TextPanel;
}

function layoutPortraitOptions( bindings, faces, bindingFaceIndex, artist, mirror, share ) {
	var OptionPanel = new Grid();
	OptionPanel.setTitle( @AHLCG-Options );

	if ( share ) {
		var shareBox = new checkBox( @AHLCG-SharePortrait, true, null );
		bindings.add( 'PortraitShare', shareBox, faces );

		OptionPanel.place(
			shareBox, 'wrap, span 2'
		);
	}
	if ( artist ) {
		var artistField = new textField( '', 30 );
		bindings.add( 'Artist' + BindingSuffixes[bindingFaceIndex], artistField, faces );

		OptionPanel.place(
			@AHLCG-Artist, 'align right', artistField, 'pushx, growx, sizegroup sp'
		);
	}
	if ( mirror != null) {
		OptionPanel.place(
			mirror, 'align right'
		);
	}

	return OptionPanel;
}

function setupGuidePortrait( diy, portraitIndex, positionOption, settingUp ) {
	AHLCGModules.GuidePage.setupPortrait( legacyCard(), diy, portraitIndex, positionOption, settingUp );
}

function layoutPortraits( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	var PortraitTabArray = layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist );

	return PortraitTabArray[0];
}

function layoutHSBPanel(diy, bindings){
	var HSBTab = new Grid();
	HSBTab.editorTabScrolling = true;

	var panel = new tintPanel();
    bindings.add('tint', panel);
	HSBTab.place( panel, 'wrap, pushx, growx' );

	return HSBTab;
}

function layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	var PortraitTab = new Grid();
	PortraitTab.editorTabScrolling = true;

	var resultArray = [ PortraitTab ];

	var frontNeeded = ( frontPortrait != null && frontPortrait.length > 0 );
	var backNeeded = ( backPortrait != null && backPortrait.length > 0 );

	if ( frontNeeded ) {
		let frontPortraitImagePanel = null;
		if ( backNeeded ) frontPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( frontPortrait ), @AHLCG-Portrait + ' : '+ @AHLCG-Front );
		else frontPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( frontPortrait ), @AHLCG-Portrait );

		let frontMirrorButton = null;
		if (mirror) frontMirrorButton = createPortraitMirrorButton( frontPortrait, frontPortraitImagePanel );

		let frontOptionPanel = layoutPortraitOptions( bindings, [0, 1], FACE_FRONT, true, frontMirrorButton, false );
		if ( backNeeded ) frontOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-Front );

		PortraitTab.place( frontPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( frontOptionPanel, 'wrap, pushx, growx' );

		resultArray.push( frontPortraitImagePanel );
	}
	if ( backNeeded ) {
		let backPortraitImagePanel = null;
		if ( frontNeeded ) backPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( backPortrait ), @AHLCG-Portrait + ' : ' + @AHLCG-Back );
		else backPortraitImagePanel = new portraitPanel( diy, getPortraitIndex( backPortrait ), @AHLCG-Portrait );

		let backMirrorButton = null;
		if (mirror) backMirrorButton = createPortraitMirrorButton( backPortrait, backPortraitImagePanel );

		let backOptionPanel = layoutPortraitOptions( bindings, [1], FACE_BACK, backArtist, backMirrorButton, share );
		if ( frontNeeded ) backOptionPanel.setTitle( @AHLCG-Options + ': ' + @AHLCG-Back );

		PortraitTab.place( backPortraitImagePanel, 'wrap, pushx, growx' );
		PortraitTab.place( backOptionPanel, 'wrap, pushx, growx' );

		resultArray.push( backPortraitImagePanel );
	}

	// template replacement
	var templatePanel = new Grid();
	templatePanel.setTitle( @AHLCG-TemplateReplacement );

	var templateFrontField = new textField( '', 30 );
	bindings.add( 'TemplateReplacement', templateFrontField, [0] );
	var templateBackField = new textField( '', 30 );
	bindings.add( 'TemplateReplacementBack', templateBackField, [1] );

	var templateFrontButton = new button(
		@AHLCG-Pref-Select, null,
		function(){
			filename = ResourceKit.showImageFileDialog( null );
			if (filename != null) {
				templateFrontField.setText(filename);
			}
		}
	);
	templatePanel.place(
		@AHLCG-Front, 'align right', templateFrontField, 'pushx, growx', templateFrontButton, 'wrap'
	);

	if ( diy.faceStyle != FaceStyle.PLAIN_BACK ) {
		var templateBackButton = new button(
			@AHLCG-Pref-Select, null,
			function(){
				filename = ResourceKit.showImageFileDialog( null );
				if (filename != null) {
					templateBackField.setText(filename);
				}
			}
		);

		templatePanel.place(
			@AHLCG-Back, 'align right', templateBackField, 'pushx, growx', templateBackButton, 'wrap'
		);
	}

	var templateBleedBox = new checkBox( @AHLCG-TemplateReplacementBleed, false, null );
	bindings.add( 'TemplateReplacementBleed', templateBleedBox, diy.faceStyle != FaceStyle.PLAIN_BACK ? [0, 1] : [0] );
	templatePanel.place( templateBleedBox, 'skip, span 2, wrap' );

	PortraitTab.place( templatePanel, 'wrap, pushx, growx' );
	resultArray.push( templatePanel );

	return resultArray;
}

function layoutGuidePortraits( diy, bindings, leftPortrait, rightPortrait, mirror ) {
	return AHLCGModules.GuidePanels.portraits( legacyCard(), diy, bindings, leftPortrait, rightPortrait, mirror );
}

function layoutCollection( bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex ) {
	var CollectionPanel = new Grid();
	CollectionPanel.setTitle( @AHLCG-Collection );

	var CollectionList = new comboBox( Eons.namedObjects.AHLCGObject.comboCollection, null );
	bindings.add( 'Collection' + BindingSuffixes[bindingFaceIndex], CollectionList, faces );

	// if we select a user set, load the portrait accordingly
	CollectionList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.collectionTypes[CollectionList.getSelectedIndex()];
			$CollectionType = type.toString();
			if ( type > 0 ) {
				var icon = $( 'AHLCG-UserCollectionIcon' + type, '' );

				PortraitList[ getPortraitIndex( 'Collection' ) ].setSource( icon );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	var collectionNumber;
	if ( useSpinner ) {
		collectionNumber = new spinner(1, 999, 1, 1);
	}
	else {
		collectionNumber = new textField( '', 8 );
		collectionNumber.setHorizontalAlignment(JTextField.RIGHT);
	}
	bindings.add( 'CollectionNumber' + BindingSuffixes[bindingFaceIndex], collectionNumber, faces );

	CollectionPanel.place(
		@AHLCG-Collection, 'align right', CollectionList, 'wrap, pushx, growx, span 3'
	);

	if (selectFaces) {
		var frontBox = new checkBox( @AHLCG-Front, true, null );
		var backBox = new checkBox( @AHLCG-Back, true, null );

		bindings.add( 'ShowCollectionNumberFront' + BindingSuffixes[bindingFaceIndex], frontBox, [0, 1] );
		bindings.add( 'ShowCollectionNumberBack' + BindingSuffixes[bindingFaceIndex], backBox, [0, 1] );

		CollectionPanel.place(
			@AHLCG-CollectionNumber, 'align right', collectionNumber, 'align left',
			frontBox, 'align right', backBox, 'align right, gapx 10'
		);
	}
	else {
		CollectionPanel.place(
			@AHLCG-CollectionNumber, 'align right', collectionNumber, 'wrap'
		);
	}

	var flipBox = new checkBox( 'Flip A/B suffix', false, null );
	bindings.add( 'flipSuffix', flipBox, [false, true]);
	CollectionPanel.place(
		'Flip', 'align right', flipBox, 'wrap'
	);
	return CollectionPanel;
}

function layoutEncounter( bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex ) {
	var EncounterPanel = new Grid();
	EncounterPanel.setTitle( @AHLCG-EncounterSet );

	var EncounterList = new comboBox( Eons.namedObjects.AHLCGObject.comboEncounter, null );
	bindings.add( 'Encounter' + BindingSuffixes[bindingFaceIndex], EncounterList, iconFaces );

	// if we select a user set, load the portrait accordingly
	EncounterList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.encounterTypes[EncounterList.getSelectedIndex()];
			$EncounterType = type.toString();

			if ( type > 0 ) {
				var icon = ImageUtils.read( $( 'AHLCG-UserEncounterIcon' + type, '' ));

				if (CardTypes[0] == 'Ultimatum') {
					icon = createInvertedImage( icon );
				}

				PortraitList[ getPortraitIndex( 'Encounter' ) ].setImage( $( 'AHLCG-UserEncounterIcon' + type, '' ), icon );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	var encounterNumber = new textField( '', 8 );
	encounterNumber.setHorizontalAlignment(JTextField.RIGHT);

	bindings.add( 'EncounterNumber' + BindingSuffixes[bindingFaceIndex], encounterNumber, numberFaces );

	var totalNumber = new textField( "", 4);
	bindings.add( 'EncounterTotal' + BindingSuffixes[bindingFaceIndex], totalNumber, numberFaces );

	var frontSymbolBox = null;
	var backSymbolBox = null;

	if ( CardTypes[FACE_FRONT] == 'Location' ) {
		frontSymbolBox = new checkBox( @AHLCG-Front, true, null );
		bindings.add( 'ShowEncounterIcon', frontSymbolBox, [0] );
	}
	if ( CardTypes[FACE_BACK] == 'Location' || CardTypes[FACE_BACK] == 'LocationBack' ) {
		backSymbolBox = new checkBox( @AHLCG-Back, true, null );
		bindings.add( 'ShowEncounterIconBack', backSymbolBox, [1] );
	}

	if ( frontSymbolBox || backSymbolBox ) {
		let listOptions = ( CardTypes[FACE_FRONT] == 'Story' ) ? 'pushx, growx, span 2' : 'pushx, growx'

		EncounterPanel.place(
			@AHLCG-Set, 'align right', EncounterList, listOptions
		);

		if ( frontSymbolBox ) {
			let boxOptions = ( backSymbolBox ) ? 'align left' : 'wrap, align right';

			EncounterPanel.place(
				'', 'align right', frontSymbolBox, boxOptions
			);
		}

		if ( backSymbolBox ) {
			if ( frontSymbolBox ) {
				EncounterPanel.place(
					'', 'align right'
				);
			}
			EncounterPanel.place(
				backSymbolBox, 'wrap, align right'
			);
		}
	}
	else {
		EncounterPanel.place(
			@AHLCG-Set, 'align right', EncounterList, 'wrap, pushx, growx, span 3'
		);
	}

	if (selectFaces) {
		var frontBox = new checkBox( @AHLCG-Front, true, null );
		var backBox = new checkBox( @AHLCG-Back, true, null );

		bindings.add( 'ShowEncounterNumberFront' + BindingSuffixes[bindingFaceIndex], frontBox, [0, 1] );
		bindings.add( 'ShowEncounterNumberBack' + BindingSuffixes[bindingFaceIndex], backBox, [0, 1] );

		EncounterPanel.place(
			@AHLCG-SetNumber, 'align right', encounterNumber, 'align left, split 3',
			' / ', 'align left', totalNumber, 'align left',
			frontBox, 'align right', backBox, 'align right, gapx 10'
		);
	}
	else {
		EncounterPanel.place(
			@AHLCG-SetNumber, 'align right', encounterNumber, 'split',
			' / ', 'split', totalNumber, 'split, wrap'
		);
	}

	var invertButton = createPortraitInvertButton( "Encounter" );
	EncounterPanel.place(
		"Invert", 'align right', invertButton, 'align right'
	);

	return EncounterPanel;
}

function layoutSimpleEncounter( bindings, portraitPanel, iconFaces, bindingFaceIndex ) {
	var EncounterPanel = new Grid();
	EncounterPanel.setTitle( @AHLCG-EncounterSet );

	var EncounterList = new comboBox( Eons.namedObjects.AHLCGObject.comboEncounter, null );
	bindings.add( 'Encounter' + BindingSuffixes[bindingFaceIndex], EncounterList, iconFaces );

	// if we select a user set, load the portrait accordingly
	EncounterList.addActionListener( function updateShape( actionEvent ) {
		try {
			var type = Eons.namedObjects.AHLCGObject.encounterTypes[EncounterList.getSelectedIndex()];
			$EncounterType = type.toString();

			if ( type > 0 ) {
				var icon = $( 'AHLCG-UserEncounterIcon' + type, '' );

				PortraitList[ getPortraitIndex( 'Encounter' ) ].setSource( icon );
				portraitPanel.updatePanel();
				setPortraitPanelFileFieldEnabled( portraitPanel, false );
			}
			else {
				setPortraitPanelFileFieldEnabled( portraitPanel, true );
			}
		} catch (ex) {
			Error.handleUncaught( ex );
		}
	});

	EncounterPanel.place(
		@AHLCG-Set, 'align right', EncounterList, 'wrap, pushx, growx'
	);

	return EncounterPanel;
}
