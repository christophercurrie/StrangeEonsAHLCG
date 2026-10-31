// Game text as a list of styled blocks that card authors add, delete and
// restyle in the editor. Blocks are stored per face as
//   BlockCount<suffix>
//   BlockStyle<n><suffix>    one of Styles
//   BlockText<n><suffix>
//   BlockSpacing<n><suffix>  points after the block (before, for victory)
//
// Blocks are laid out top to bottom and shrunk together in 4% steps until
// they fit. Rule blocks split the text into parts; a rule is drawn before
// each part that has text, except the first.
//
// Module: returns TextBlocks.
define( [ 'faces/FaceUtils', 'se/markup', 'se/strings', 'se/ui' ],
function ( FaceUtils, markup, strings, ui ) {
	const Styles = [ 'traits', 'header', 'story', 'rules', 'victory', 'rule' ];
	const StyleLabels = {
		traits: 'AHLCG-Traits',
		header: 'AHLCG-Header',
		story: 'AHLCG-AccentedStory',
		rules: 'AHLCG-Rules',
		victory: 'AHLCG-Victory',
		rule: 'AHLCG-Rule'
	};
	const DefaultStyle = 'rules';
	// measured height of a rule and the space around it, before scaling
	const RuleHeight = 16;

	function key( name, n, suffix ) {
		return 'Block' + name + n + suffix;
	}

	function count( settings, suffix ) {
		return Math.max( 1, parseInt( settings.get( 'BlockCount' + suffix, '1' ), 10 ) || 1 );
	}

	function defaults( suffix ) {
		var values = {};
		values['BlockCount' + suffix] = '1';
		values[key( 'Style', 1, suffix )] = DefaultStyle;
		values[key( 'Text', 1, suffix )] = '';
		values[key( 'Spacing', 1, suffix )] = '0';
		return values;
	}

	// [ { style, text, spacing } ]; other styles read as the default
	function read( settings, suffix, styles ) {
		var blocks = [];
		for ( let n = 1; n <= count( settings, suffix ); n++ ) {
			let style = String( settings.get( key( 'Style', n, suffix ), DefaultStyle ) );
			blocks.push( {
				style: styles.indexOf( style ) >= 0 ? style : DefaultStyle,
				text: String( settings.get( key( 'Text', n, suffix ), '' ) ),
				spacing: parseInt( settings.get( key( 'Spacing', n, suffix ), '0' ), 10 ) || 0
			} );
		}
		return blocks;
	}

	function write( settings, suffix, blocks ) {
		var old = count( settings, suffix );
		for ( let n = 1; n <= Math.max( old, blocks.length ); n++ ) {
			let block = blocks[n - 1];
			if ( block ) {
				settings.set( key( 'Style', n, suffix ), block.style );
				settings.set( key( 'Text', n, suffix ), block.text );
				settings.set( key( 'Spacing', n, suffix ), String( block.spacing ) );
			}
			else {
				settings.reset( key( 'Style', n, suffix ) );
				settings.reset( key( 'Text', n, suffix ) );
				settings.reset( key( 'Spacing', n, suffix ) );
			}
		}
		settings.set( 'BlockCount' + suffix, String( blocks.length ) );
	}

	// One row per block: style, spacing, delete and the text. Adding or
	// deleting a block rebuilds just the rows and their bindings, in place;
	// bindings must be ui/Bindings, which can remove them.
	function createPanel( diy, face, bindings, faceIndex ) {
		var settings = diy.settings;
		var suffix = face.suffix( faceIndex );
		var panel = new ui.Grid();
		panel.setTitle( strings.string( 'AHLCG-Rules' ) );
		// a Swing panel, unlike Grid, can be emptied and refilled
		var rows = new javax.swing.JPanel( new Packages.net.miginfocom.swing.MigLayout( 'insets 0' ) );
		var bound = [];

		var items = face.blockStyles.map( function ( style ) {
			return new arkham.diy.ListItem( style, strings.string( StyleLabels[style] ) );
		} );

		function place( component, hint ) {
			if ( !( component instanceof java.awt.Component ) ) component = new javax.swing.JLabel( String( component ) );
			rows['add(java.awt.Component,java.lang.Object)']( component, hint );
		}

		function bind( name, n, control ) {
			face.bind( bindings, faceIndex, key( name, n, '' ), control );
			bound.push( control );
		}

		function edit( change ) {
			bindings.flush();
			var blocks = read( settings, suffix, face.blockStyles );
			change( blocks );
			write( settings, suffix, blocks );
			diy.markChanged( faceIndex );
			populate();
		}

		function addRow( n, total ) {
			var styleList = new ui.comboBox( items, null );
			var spacing = new ui.spinner( 0, 300, 1, 0 );
			var text = new ui.textArea( '', 4, 30 );
			var remove = new ui.button( strings.string( 'AHLCG-DeleteBlock' ), null, function deleteBlock( actionEvent ) {
				edit( function ( blocks ) { blocks.splice( n - 1, 1 ); } );
			} );
			remove.setEnabled( total > 1 );

			// rules have no text or spacing
			function updateControls() {
				var textual = String( styleList.getSelectedItem() ) !== 'rule';
				text.setEnabled( textual );
				spacing.setEnabled( textual );
			}
			styleList.addActionListener( function updateStyle( actionEvent ) {
				updateControls();
			} );

			bind( 'Style', n, styleList );
			bind( 'Spacing', n, spacing );
			bind( 'Text', n, text );
			updateControls();

			place( styleList, 'split 4, span 2' );
			place( strings.string( 'AHLCG-Spacing' ), 'gapx 10' );
			place( spacing, '' );
			place( remove, 'gapx push, wrap' );
			place( text, 'span 2, pushx, growx, wrap' );
		}

		// rebuilds the rows and their bindings from the settings
		function populate() {
			bound.forEach( function ( control ) { face.unbind( bindings, control ); } );
			bound = [];
			rows.removeAll();
			var total = count( settings, suffix );
			for ( let n = 1; n <= total; n++ ) {
				addRow( n, total );
			}
			rows.revalidate();
			rows.repaint();
		}

		var add = new ui.button( strings.string( 'AHLCG-AddBlock' ), null, function addBlock( actionEvent ) {
			edit( function ( blocks ) {
				blocks.push( { style: DefaultStyle, text: '', spacing: 0 } );
			} );
			// show and focus the new block once laid out
			var text = rows.getComponent( rows.getComponentCount() - 1 );
			java.awt.EventQueue.invokeLater( function () {
				text.scrollRectToVisible( new java.awt.Rectangle( 0, 0, text.getWidth(), text.getHeight() ) );
				text.requestFocusInWindow();
			} );
		} );

		populate();
		// the block count can change when the editor reloads the component,
		// such as after Clear
		face.addPopulateListener( bindings, populate );

		panel.place( rows, 'span 2, pushx, growx, wrap', add, 'span 2, wrap' );
		return panel;
	}

	// as when assigned to a region's integer fields
	function toInt( value ) {
		return value < 0 ? Math.ceil( value ) : Math.floor( value );
	}

	function setTextSize( box, defaultSize, percent ) {
		var style = box.getDefaultStyle();
		style.add( markup.SIZE, defaultSize * percent / 100.0 );
		box.setDefaultStyle( style );
		box.markupText = '';
	}

	// markup for a block's text
	function blockMarkup( block ) {
		if ( block.style === 'traits' ) return '<center><ts>' + block.text + '</ts>';
		if ( block.style === 'victory' ) return '<center><hdr>' + block.text + '</hdr>';
		return block.text;
	}

	// Part index of each block; rules start a new part. Rules, traits and
	// victory belong to no part's text.
	function partsOf( blocks ) {
		var part = 0;
		var nonEmpty = [];
		var parts = blocks.map( function ( block ) {
			if ( block.style === 'rule' ) {
				part++;
				return part;
			}
			if ( isPartText( block ) ) nonEmpty[part] = true;
			return part;
		} );
		return { parts: parts, nonEmpty: nonEmpty };
	}

	function isPartText( block ) {
		return ( block.style === 'header' || block.style === 'story' || block.style === 'rules' ) && block.text.length > 0;
	}

	// Paints blocks in the face's Body region and story text in its Story region,
	// ending above the tracking box. boxes: traits, header, story, body.
	// layout: trackerHeight, in percent, 0 without a tracking box.
	function paint( g, diy, sheet, face, boxes, blocks, scaleModifier, layout ) {
		var settings = diy.settings;
		var o = FaceUtils.plugin();
		var faceIndex = sheet.getSheetIndex();
		// the text ends above the top of the tracking box
		var bottomSpace = layout.trackerHeight > 0 ? 90 * layout.trackerHeight / 100.0 + 10 : 0;
		var traitsBox = boxes.traits, headerBox = boxes.header, storyBox = boxes.story, bodyBox = boxes.body;

		var fullRegion = face.textRegion( diy, faceIndex, 'Body' );
		var fullStoryRegion = face.textRegion( diy, faceIndex, 'Story' );
		var region = face.textRegion( diy, faceIndex, 'Body' );
		var storyRegion = face.textRegion( diy, faceIndex, 'Story' );
		[ fullRegion, fullStoryRegion, region, storyRegion ].forEach( function ( r ) { r.height -= bottomSpace; } );
		// traits ignore the body font offset
		var traitsY = region.y;

		var offset = parseInt( o.bodyFontOffset );
		[ fullRegion, fullStoryRegion, region, storyRegion ].forEach( function ( r ) { r.y += offset; } );

		bodyBox.setReplacementForTag( 'fullnameb', settings.get( 'TitleBack' ) );

		var ruleAbove = 8, ruleBelow = 8;
		var storyLineTop = -1, storyLineBottom = 4;
		if ( String( o.bodyFamily ) === 'Arno Pro' ) {
			ruleAbove = 6;
			ruleBelow = 10;
		}
		if ( String( o.bodyFamily ) === 'Times New Roman' ) storyLineTop = -4;

		var headerTightness = Number( settings.get( face.key( settings, 'Header-tightness' ) ) ) * o.bodyFontTightness;
		traitsBox.setLineTightness( headerTightness );
		headerBox.setLineTightness( headerTightness );
		storyBox.setLineTightness( Number( settings.get( face.key( settings, 'Story-tightness' ) ) ) * o.bodyFontTightness );
		bodyBox.setLineTightness( Number( settings.get( face.key( settings, 'Body-tightness' ) ) ) * o.bodyFontTightness );
		[ traitsBox, headerBox, storyBox, bodyBox ].forEach( function ( box ) { box.setTextFitting( markup.FIT_NONE ); } );

		traitsBox.defaultStyle = settings.getTextStyle( face.key( settings, 'Header-style' ), null );
		headerBox.defaultStyle = settings.getTextStyle( face.key( settings, 'Header-style' ), null );
		storyBox.defaultStyle = settings.getTextStyle( face.key( settings, 'Story-style' ), null );
		bodyBox.defaultStyle = settings.getTextStyle( face.key( settings, 'Body-style' ), null );

		var defaultSizes = {
			traits: traitsBox.defaultStyle.get( markup.SIZE ),
			header: headerBox.defaultStyle.get( markup.SIZE ),
			story: storyBox.defaultStyle.get( markup.SIZE ),
			body: bodyBox.defaultStyle.get( markup.SIZE )
		};

		// box, size and measuring region per style
		function boxFor( style ) {
			switch ( style ) {
				case 'traits': return { box: traitsBox, size: defaultSizes.traits, region: fullRegion };
				case 'story': return { box: storyBox, size: defaultSizes.story, region: fullStoryRegion };
				case 'rules': return { box: bodyBox, size: defaultSizes.body, region: fullRegion };
				default: return { box: headerBox, size: defaultSizes.header, region: fullRegion };
			}
		}

		function measure( block, percent ) {
			var b = boxFor( block.style );
			setTextSize( b.box, b.size, percent );
			b.box.markupText = blockMarkup( block );
			if ( block.style === 'rules' ) markup.updateNameTags( b.box, diy );
			return b.box.measure( g, b.region );
		}

		var partition = partsOf( blocks );
		var parts = partition.parts, nonEmpty = partition.nonEmpty;
		var partCount = parts.length > 0 ? parts[parts.length - 1] + 1 : 1;
		var firstPartHasHeader = blocks.some( function ( block, i ) {
			return parts[i] === 0 && block.style === 'header' && block.text.length > 0;
		} );

		var fullHeight = fullRegion.height;
		var totalHeight;
		var scale = 1.0;
		var textSize = 100.0;

		do {
			totalHeight = 0;

			// victory text measures plain, at the previous step's size
			blocks.forEach( function ( block ) {
				if ( block.style === 'victory' && block.text.length > 0 ) {
					headerBox.markupText = '';
					headerBox.markupText = block.text;
					totalHeight += headerBox.measure( g, fullRegion ) + block.spacing;
				}
			} );

			blocks.forEach( function ( block ) {
				if ( block.style === 'victory' || block.style === 'rule' || block.text.length === 0 ) return;
				totalHeight += measure( block, textSize );
				if ( block.style === 'header' || block.style === 'story' ) totalHeight += block.spacing + 4;
				else totalHeight += block.spacing;
			} );
			setTextSize( headerBox, defaultSizes.header, textSize );

			if ( firstPartHasHeader ) totalHeight += 4;
			for ( let p = 0; p < partCount; p++ ) {
				if ( nonEmpty[p] ) totalHeight += RuleHeight;
			}
			totalHeight -= RuleHeight;

			if ( totalHeight > fullHeight ) scale -= 0.04;
			textSize = scale * 100.0;
		} while ( totalHeight > fullHeight );

		var textScale = scale * 0.98;
		textSize = textScale * scaleModifier;
		var spacingScale = scale * scaleModifier / 100.0;

		// top of the next block, in whole pixels
		var y = region.y;
		var firstPartText = true;

		blocks.forEach( function ( block, i ) {
			var part = parts[i];

			if ( block.style === 'rule' ) {
				if ( !nonEmpty[part] ) return;
				y += Math.ceil( ruleAbove * spacingScale );
				g.setPaint( java.awt.Color.BLACK );
				g.setStroke( new java.awt.BasicStroke( 1.0 ) );
				g.drawLine( region.x, y, region.x + region.width, y );
				y += Math.ceil( ruleBelow * spacingScale );
				return;
			}
			if ( block.text.length === 0 ) return;

			// the first text sits a little lower
			if ( part === 0 && isPartText( block ) && firstPartText ) {
				y = toInt( y + 4 * textScale );
				firstPartText = false;
			}

			var b = boxFor( block.style );
			setTextSize( b.box, b.size, textSize );
			b.box.markupText = blockMarkup( block );
			if ( block.style === 'rules' ) markup.updateNameTags( b.box, diy );
			var measured = b.box.measure( g, b.region );
			var height = Math.ceil( measured );

			switch ( block.style ) {
				case 'traits':
					b.box.draw( g, new java.awt.Rectangle( region.x, traitsY + ( y - region.y ), region.width, height ) );
					y = toInt( y + measured + Math.ceil( block.spacing * scale ) );
					break;
				case 'header':
					b.box.draw( g, new java.awt.Rectangle( region.x, y, region.width, height ) );
					y += height + Math.ceil( ( block.spacing + 4 ) * spacingScale );
					break;
				case 'story': {
					let r = new java.awt.Rectangle( storyRegion.x, y, storyRegion.width, height + 2 );
					b.box.draw( g, r );
					g.setPaint( java.awt.Color.BLACK );
					g.setStroke( new java.awt.BasicStroke( 1.0 ) );
					let top = r.y - storyLineTop * scale;
					let bottom = r.y + r.height - storyLineBottom * scale;
					g.drawLine( r.x - 15, top, r.x - 15, bottom );
					g.drawLine( r.x - 12, top, r.x - 12, bottom );
					y += r.height;
					// story spacing only separates it from rules text that follows
					let next = blocks[i + 1];
					if ( next && next.style === 'rules' && next.text.length > 0 ) {
						y += Math.ceil( ( block.spacing + 4 ) * spacingScale );
					}
					break;
				}
				case 'rules':
					b.box.draw( g, new java.awt.Rectangle( region.x, y, region.width, height ) );
					y = toInt( y + height + 2 * scale ) + Math.ceil( block.spacing * spacingScale );
					break;
				case 'victory':
					y += block.spacing;
					b.box.draw( g, new java.awt.Rectangle( region.x, y, region.width, height ) );
					y += height;
					break;
			}
		} );
	}

	return {
		Styles: Styles,
		defaults: defaults,
		read: read,
		createPanel: createPanel,
		paint: paint
	};
} );
