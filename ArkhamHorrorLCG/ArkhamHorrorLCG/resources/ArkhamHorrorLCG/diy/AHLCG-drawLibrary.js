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

function drawGuideTemplate( diy, g, sheet, labelBox  ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(187, 51, 750, 188) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 90) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 94) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuideTemplateA4( diy, g, sheet, labelBox ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(206, 56, 827, 207) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(189, 162, 865, 99) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(190, 162, 863, 104) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuideTemplateLetter( diy, g, sheet, labelBox ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(223, 56, 827, 207) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(206, 162, 865, 99) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(207, 162, 863, 104) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuidePortraits( g, diy, sheet ) {
	var bodyRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') );

	for( let index = 0; index < PortraitList.length; index++ ) {
		var portrait = PortraitList[index];
		var image = portrait.getImage();
		var stencil = portrait.getClipStencil();

		if ( stencil != null ) {
			var invertStencil = createAlphaInvertedImage( stencil );

			var scale = portrait.getScale();
			var panX = portrait.getPanX();
			var panY = portrait.getPanY();

			var gs = invertStencil.getGraphics();
			gs.setComposite(AlphaComposite.SrcIn);
			gs.drawImage( image, stencil.getWidth()/2 - image.getWidth()*scale/2 + panX, stencil.getHeight()/2 - image.getHeight()*scale/2 + panY, image.getWidth()*scale, image.getHeight()*scale, null );

			gs.dispose();

			sheet.paintImage(g, invertStencil, bodyRegion );
		}
	}
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
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	if ( isNaN( spacing ) ) spacing = 100;

	var tightness = AHLCGObject.bodyFontTightness * 1.2 * spacing / 100.0;

	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) {
//		bodyRegion.y -= 2;
		tightness = tightness * 0.98;
//		tightness = tightness * 1.4;

		var bodyStyle = bodyBox.getDefaultStyle();
		bodyStyle.add( WIDTH, 0.96 );
		bodyStyle.add( TRACKING, -0.01 );
		bodyBox.setDefaultStyle( bodyStyle );
	}

	bodyRegion.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);

	while (text.length > 0) {
//		let startMatch = /<section>|<header>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*[A-Fa-f0-9\.]{6})*>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<section|header(?:\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*[A-Fa-f0-9\.]{6})*>/.exec( text );
//		let startMatch = /<section\s*.*>|<header\s*.*>|<box(?:res|sa|int)\s*.*>/.exec( text );
		let endMatch = null;
		let matchIndex = -1;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
		let intCupShape = null;
		let textRegion = new Region( bodyRegion );

		if ( startMatch ) {
			let tagMatch = /<([a-zA-Z]+)/.exec( startMatch[0] );
			let colorMatch = null;

			switch ( tagMatch[1] ) {
				case 'section':
					colorMatch = /colou?r\s*=\s*([A-Fa-f0-9\.]{6})/.exec( startMatch[0] );
					endMatch = /<\/section>/.exec( text );

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
						specialText = text.slice( startMatch.index, endMatch.index + 10 );
						postSpecialText = text.slice( endMatch.index + 10 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					specialText = specialText.replace( /<section.*?>/, '<section>' );

					if ( colorMatch ) {
						specialText = specialText.replace( /<section>/, '<section><color ' + colorMatch[1] + '>' );
						specialText = specialText.replace( /<\section>/, '<\color><\section>' );
					}
					else {
						specialText = specialText.replace( /<section>/, '<section><color 415a55>' );
						specialText = specialText.replace( /<\section>/, '<\color><\section>' );
					}

					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness')  * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

//					sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//						new Region( bodyRegion.x, bodyRegion.y + sectionHeight - 2, bodyRegion.width + 2, 6) );
					if ( colorMatch ) {
						let aRgbHex = colorMatch[1].match(/.{1,2}/g);
						let aRgb = [
							parseInt(aRgbHex[0], 16),
							parseInt(aRgbHex[1], 16),
							parseInt(aRgbHex[2], 16)
						];

						g.setPaint( new Color( aRgb[0]/256.0, aRgb[1]/256.0, aRgb[2]/256.0 ) );
						}
					else {
						g.setPaint( new Color( 0.255, 0.353, 0.333 ) );
					}
					g.setStroke( new BasicStroke( 1.0 ) );
					g.drawLine(bodyRegion.x, bodyRegion.y + sectionHeight - 1, bodyRegion.x + bodyRegion.width + 2, bodyRegion.y + sectionHeight - 1);
					g.drawLine(bodyRegion.x, bodyRegion.y + sectionHeight + 3, bodyRegion.x + bodyRegion.width + 2, bodyRegion.y + sectionHeight + 3);

					bodyRegion.y += sectionHeight - 4;
					bodyRegion.height -= (sectionHeight - 4);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				case 'header':
					colorMatch = /colou?r\s*=\s*([A-Fa-f0-9\.]{6})/.exec( startMatch[0] );
					endMatch = /<\/header>/.exec( text );

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
						specialText = text.slice( startMatch.index, endMatch.index + 9 );
						postSpecialText = text.slice( endMatch.index + 9 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					bodyRegion.y += 8;
					bodyRegion.height -= 8;

					specialText = specialText.replace( /<header.*?>/, '<header>' );

					if (colorMatch) {
						specialText = specialText.replace( /<header>/, '<header><color ' + colorMatch[1] + '>' );
						specialText = specialText.replace( /<\header>/, '<\color><\header>' );
					}
					else {
						specialText = specialText.replace( /<header>/, '<header><color 415a55>' );
						specialText = specialText.replace( /<\header>/, '<\color><\header>' );
					}

//					var defaultStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
//					if (colorMatch) {
//						var textStyle = defaultStyle;

//						if ( colorMatch ) {
//							textStyle.add( COLOR, new Color( Color.HSBtoRGB(colorMatch[1], colorMatch[2], colorMatch[3]) ) );
//						}

//						bodyBox.setStyleForTag( 'header', textStyle );
//					}
/*
					var textStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
					if (colorMatch) {
						var textStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
						var coloredStyle = textStyle;
						coloredStyle.add( COLOR, new Color( Color.HSBtoRGB(colorMatch[1], colorMatch[2], colorMatch[3]) ));
						bodyBox.setDefaultStyle(coloredStyle);
					}
*/
					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness') * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

//					if (colorMatch) {
//						bodyBox.setDefaultStyle( textStyle );
//						bodyBox.setStyleForTag( 'header', defaultStyle );
//					}

					bodyRegion.y += sectionHeight - 12;
					bodyRegion.height -= (sectionHeight - 12);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				default:	//	<box...>
					colorMatch = /colou?r\s*=\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)/.exec( startMatch[0] );

					let res = ( /boxres/.exec( startMatch[0] ) != null );
					let sa = ( /boxsa/.exec( startMatch[0] ) != null );
					let keybox = ( /boxkey/.exec( startMatch[0] ) != null );
					let interlude = ( /boxint/.exec( startMatch[0] ) != null );
					let flashback = ( /boxfla/.exec( startMatch[0] ) != null );
					let header = ( /\sheader/.exec( startMatch[0] ) != null );
					let bracket = ( /\sbracket/.exec( startMatch[0] ) != null );

					if ( flashback ) {
						if ( colorMatch == null ) {
							colorMatch = [ 'color', '0.630', '0.48', '0.48' ];
						}

						interlude = true;
					}

					if ( keybox ) {
						if ( colorMatch == null ) {
							colorMatch = [ 'color', '0.000', '0.97', '0.55' ];
						}
					}

					if ( res ) endMatch = /<\/boxres>/.exec( text );
					else if ( sa ) endMatch = /<\/boxsa>/.exec( text );
					else if ( keybox ) endMatch = /<\/boxkey>/.exec( text );
					else if ( flashback ) {
						endMatch = /<\/boxfla>/.exec( text );
						interlude = true;
					}
					else if ( interlude ) {
						endMatch = /<\/boxint>/.exec( text );
						header = false;
						bracket = false;
					}

					if ( interlude ) {
						header = false;
						bracket = false;
					}

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
//						let len = (res || interlude) ? 9 : 8;
						let len = endMatch[0].length;

						specialText = text.slice( startMatch.index, endMatch.index + len );
						postSpecialText = text.slice( endMatch.index + len );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					let headerHeight = 0;
					if ( header ) {
						headerHeight = res ? 80 : 47;
					}

//					let boxRegion = new Region( bodyRegion.x - 7, bodyRegion.y, bodyRegion.width + 36, bodyRegion.height );
// matched, but caused text to go beyond right edge
//					let boxRegion = new Region( bodyRegion.x - 15, bodyRegion.y, bodyRegion.width + 12, bodyRegion.height );
					let boxRegion = (CardTypes[0] == 'Guide75') ?
						new Region( bodyRegion.x - 22, bodyRegion.y, bodyRegion.width + 30, bodyRegion.height ) :		// 7.5
						new Region( bodyRegion.x - 15, bodyRegion.y, bodyRegion.width + 30, bodyRegion.height );		// A4

					if ( interlude ) {
						boxRegion.x += 5;
						boxRegion.width -= 7;

						bodyRegion.y += 5;
						bodyRegion.height -= 10;
					}

					// space before header/first text, if you change these you must change the -= below
//					bodyRegion.x += 34;
//					bodyRegion.width -= 48;

					if ( CardTypes[0] == 'Guide75' ) {
						bodyRegion.x += 16;
						bodyRegion.width -= 48;
					}
					else {	// A4
						bodyRegion.x += 24;
						bodyRegion.width -= 48;
					}

					if ( header ) {
						bodyRegion.y += 29;
						bodyRegion.height -= 29;
					}
					else {
						bodyRegion.y += 27;
						bodyRegion.height -= 27;
					}

					textRegion.x = bodyRegion.x;
					textRegion.y = bodyRegion.y;
					textRegion.width = bodyRegion.width;
					textRegion.height = bodyRegion.height;

					if ( interlude ) {
						textRegion.width += 5;
					}


					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
					sectionHeight = bodyBox.measure( g, textRegion );

					if (interlude) {
						let inset = 24;
						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );

						textRegion.height = sectionHeight + 2;

						// test again, sectionHeight may have increased by a line because of the CupShape
						let newSectionHeight = bodyBox.measure( g, textRegion );
						while (newSectionHeight > sectionHeight) {
							sectionHeight = newSectionHeight;

							bodyBox.setPageShape( new PageShape.CompoundShape(
								new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
								bodyRegion.y + sectionHeight - 12,
								new PageShape.InsetShape(inset, inset)
								) );

							textRegion.height = sectionHeight + 2;
							newSectionHeight = bodyBox.measure( g, textRegion );
							}

						// test again if it shrunk again, means with the indents it doesn't fit, but without the indents,
						// it doesn't need the extra line.  Shrink the indents.
						if (newSectionHeight < sectionHeight) {
							sectionHeight = newSectionHeight;

							do {
								inset -= 4;

								bodyBox.setPageShape( new PageShape.CompoundShape(
									new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
									bodyRegion.y + sectionHeight - 12,
									new PageShape.InsetShape(inset, inset)
									) );

								textRegion.height = sectionHeight + 2;
								newSectionHeight = bodyBox.measure( g, textRegion );
							} while (newSectionHeight > sectionHeight && inset > 0);
						}

						sectionHeight = newSectionHeight;

						if (interlude && sectionHeight < 60) sectionHeight = 60;
						textRegion.height = sectionHeight + 2;

						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );
					}

					let boxTopImage = null;
					let boxBotImage = null;
					let boxMidImage = null;
					// Bracket images only used in color
					let boxTopBracketImage = null;
					let boxBotBracketImage = null;

					let boxType = 'SA';
					if ( res ) boxType = 'Res';
					else if ( interlude ) boxType = 'Int';
// colors:
// Resolution     : 0.019, 0.70, 0.38
// SA			  : 0.480, 0.58, 0.36
// Key			  : 0.000, 0.97, 0.55
// Interlude (TFA): 0.489, 0.56, 0.36
// Flashback (TIC): 0.630, 0.48, 0.48
// Keys (TIC)     : 0.992, 0.76, 0.37

// res box tint
					if ( colorMatch != null ) {
//						if ( bracket && !interlude ) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
//						else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Red.png');

//						if ( interlude || endMatch == bracket) boxBotImage = boxTopImage;
//						else if ( endMatch ) boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
//						else boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Red.png');

//						boxMidImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'LineRed.png');

						var h = parseFloat(colorMatch[1]);
						var s = parseFloat(colorMatch[2]);
						var b = parseFloat(colorMatch[3]);
						var b2 = b;

						if ( !interlude ) {
							b2 += 0.3;
							if ( b2 > 1.0 ) b2 = 1.0;
						}

//						var tc = new TintCache( new TintFilter() );
						var tcBox = null;
						var tcBracket = null;
						var tcMid = null;

						if ( interlude ) {
							tcBox = AHLCGObject.getIntBoxTint();
							tcMid = AHLCGObject.getIntMidTint();
						}
						else if ( bracket ) {
							tcBox = AHLCGObject.getResBoxTint();
							tcBracket = AHLCGObject.getBracketTint();
							tcMid = AHLCGObject.getResMidTint();
//							if ( !endMatch ) tcBot = AHLCGObject.getResTopTint();
//							if ( endMatch ) tcBotBracket = AHLCGObject.getBracketTint();
						}
						else {
							tcBox = AHLCGObject.getResBoxTint();
							tcMid = AHLCGObject.getResMidTint();
							if ( endMatch ) tcBracket = AHLCGObject.getBracketTint();
						}

						tcBox.setFactors(h, s, b2);
						boxTopImage = tcBox.getTintedImage();
						boxBotImage = boxTopImage;

						tcMid.setFactors(h, s, b2);
						boxMidImage = tcMid.getTintedImage();

						if ( tcBracket ) {
							tcBracket.setFactors(h, s, b);
						}
						if ( bracket ) {
							boxTopBracketImage = tcBracket.getTintedImage();
						}
						if ( !interlude && endMatch ) {
							boxBotBracketImage = tcBracket.getTintedImage();
						}
//						else {
//							boxBotImage = boxTopImage;
//						}
					}
					else {
						if ( bracket && !interlude ) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
						else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');

						if ( interlude || endMatch == bracket) boxBotImage = boxTopImage;
						else if ( endMatch ) boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
						else boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');

						boxMidImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Line.png');
					}
/*
			// ok from scratch now
					var mask = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxMask.png');
					var color = ImageUtils.create(mask.getWidth(), mask.getHeight(), true);
					var gc = color.createGraphics();
					gc.setPaint( new Color(1, 1, 1) );
					gc.fillRect( 0, 0, color.getWidth(), color.getHeight() );

					boxTopImage = createStencilImage(color, 'Box');
*/
					let ar = boxTopImage.height / boxTopImage.width;
					let topHeight = Math.round( boxRegion.width * ar );
					let rSectionHeight = Math.round( sectionHeight );
					let rHeaderHeight = Math.round( headerHeight );

					sheet.paintImage( g, boxTopImage,
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, topHeight ) );
					if ( boxTopBracketImage ) {
						sheet.paintImage( g, boxTopBracketImage,
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, topHeight ) );
					}

//					boxRegion.y += boxRegion.width * ar;
//					boxRegion.height -= boxRegion.width * ar;
					boxRegion.y += topHeight;
					boxRegion.height -= topHeight;

					let minHeight = 84;
					if ( interlude ) minHeight = 60;

					if ( rSectionHeight + rHeaderHeight > minHeight ) {
						sheet.paintImage( g, boxMidImage,
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, rSectionHeight + rHeaderHeight - minHeight ) );
					}

					if ( rSectionHeight + rHeaderHeight < minHeight ) rSectionHeight = minHeight - rHeaderHeight;
					boxRegion.y += rSectionHeight + rHeaderHeight;
					boxRegion.height -= ( rSectionHeight + rHeaderHeight );

					ar = boxBotImage.height / boxBotImage.width;

					sheet.paintImage( g, ImageUtils.mirror( boxBotImage, false, true ),
						new Region( boxRegion.x, boxRegion.y - minHeight, boxRegion.width, topHeight ));
					if ( boxBotBracketImage ) {
						sheet.paintImage( g, ImageUtils.mirror( boxBotBracketImage, false, true ),
							new Region( boxRegion.x, boxRegion.y - minHeight, boxRegion.width, topHeight ));
					}

					// draw header
					if ( header ) {
						if ( res ) {
							let headerRegion = new Region2D( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
/*
							var textStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							textStyle.add( COLOR, new Color( 1.0, 1.0, 0.0) );
*/
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							headerBox.markupText = #AHLCG-Scenario-Header1;

							let height = headerBox.measure( g, headerRegion );
							let width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

							headerRegion.y += height;

							headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

							height += headerBox.measure( g, headerRegion );
							let width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

							let headerWidth = Math.max( width1, width2 );

//							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//								new Region( headerRegion.x + (headerRegion.width - headerWidth)/ 2, bodyRegion.y + height, headerWidth, 6) );
//							g.setPaint( new Color( 0.282, 0.012, 0.0 ) );
							g.setPaint( new Color( 0.388, 0.145, 0.114 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, bodyRegion.y + height, headerRegion.x + (headerRegion.width - headerWidth) / 2 + headerWidth, bodyRegion.y + height);
							g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, bodyRegion.y + height + 5, headerRegion.x + (headerRegion.width - headerWidth) / 2 + headerWidth, bodyRegion.y + height + 5);
						}
						else if ( sa ) {
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SAHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Standalone + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

//							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//								new Region( bodyRegion.x + (bodyRegion.width - width)/ 2, bodyRegion.y + height - 2, width, 6) );
//							g.setPaint( new Color( 0.255, 0.353, 0.333 ) );
							g.setPaint( new Color( 0.176, 0.357, 0.345 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height - 2, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height - 2);
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height + 3, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height + 3);
						}
						else {	// Keys
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'KeyHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Keys + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

							g.setPaint( new Color( 0.494, 0.024, 0.027 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height - 2, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height - 2);
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height + 3, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height + 3);
						}

						bodyRegion.y += headerHeight;
						bodyRegion.height -= headerHeight;
					}

					textRegion.y = bodyRegion.y;
					textRegion.height = bodyRegion.height;

					// draw main box text
					if ( res ) bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResBullet-style'), null) );
					else bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SABullet-style'), null) );
/*
					// draw box
					g.setPaint(Color.blue);
					g.draw(new Rectangle(bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height));
					g.setPaint(Color.red);
					g.draw(new Rectangle(textRegion.x, textRegion.y, textRegion.width, textRegion.height));
*/
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
					bodyBox.draw( g, textRegion );
					bodyBox.markupText = '';

//					bodyRegion.x -= 34;
					bodyRegion.x -= 24;
					bodyRegion.width += 48;

//					if ( interlude ) bodyRegion.width -= 5;

					bodyRegion.y += sectionHeight + 55;
					bodyRegion.height -= (sectionHeight + 55);

					text = postSpecialText;

					bodyBox.setPageShape(null);
					break;
			}
		}
		else {
			bodyBox.markupText = text;
			bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
			bodyBox.draw( g, bodyRegion );
			bodyBox.markupText = '';

			text = '';
		}
	}
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

function drawPageNumber ( g, diy, sheet, pageBox ) {
	var faceIndex = sheet.getSheetIndex();

	var pageNumber = $( 'Page' + BindingSuffixes[faceIndex] );
	var region;

	if ( Number($Page) % 2 == 0 ) region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageEven-region' ) );
	else region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageOdd-region' ) );

	if ( region ) {	// only if Scenario type
		pageBox.markupText = pageNumber;
		pageBox.drawAsSingleLine( g, region );
	}
}

function drawWatermark( g, diy, sheet ) {
	AHLCGModules.CollectorLine.paintWatermark( legacyCard(), g, diy, sheet );
}
