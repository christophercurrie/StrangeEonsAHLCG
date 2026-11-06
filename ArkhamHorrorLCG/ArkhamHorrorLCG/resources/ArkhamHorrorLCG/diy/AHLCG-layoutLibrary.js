function layoutTitle( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.title( legacyCard(), diy, bindings, subtitle, updateFaces, bindingFaceIndex );
}

function layoutTitle2( diy, bindings, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.title2( legacyCard(), diy, bindings, updateFaces, bindingFaceIndex );
}

function layoutTitleUnique( diy, bindings, subtitle, updateFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.titleUnique( legacyCard(), diy, bindings, subtitle, updateFaces, bindingFaceIndex );
}

function layoutTitleGuide( diy, bindings, updateFaces, bindingFaceIndex, portraitPanels ) {
	return AHLCGModules.GuidePanels.title( legacyCard(), diy, bindings, updateFaces, bindingFaceIndex, portraitPanels );
}

function layoutGuideStats( bindings, faceIndex ) {
	return AHLCGModules.GuidePanels.stats( legacyCard(), bindings, faceIndex );
}

function layoutConcealedStats( diy, bindings, faceIndex ) {
	return AHLCGModules.Panels.concealedStats( legacyCard(), bindings, faceIndex );
}

function layoutCopyright( bindings, selectFaces, faces, faceIndex ) {
	return AHLCGModules.Panels.copyright( bindings, selectFaces, faces );
}

function layoutText( bindings, parts, suffix, faceIndex ) {
	return AHLCGModules.Panels.text( legacyCard(), bindings, parts, suffix, faceIndex );
}

function setupGuidePortrait( diy, portraitIndex, positionOption, settingUp ) {
	AHLCGModules.GuidePage.setupPortrait( legacyCard(), diy, portraitIndex, positionOption, settingUp );
}

function layoutPortraits( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	return layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist )[0];
}

function layoutHSBPanel( diy, bindings ) {
	return AHLCGModules.Panels.tint( bindings );
}

function layoutPortraitsWithPanels( diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist ) {
	return AHLCGModules.Panels.portraits( legacyCard(), diy, bindings, frontPortrait, backPortrait, mirror, share, backArtist );
}

function layoutGuidePortraits( diy, bindings, leftPortrait, rightPortrait, mirror ) {
	return AHLCGModules.GuidePanels.portraits( legacyCard(), diy, bindings, leftPortrait, rightPortrait, mirror );
}

function layoutCollection( bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex ) {
	return AHLCGModules.Panels.collection( legacyCard(), bindings, portraitPanel, useSpinner, selectFaces, faces, bindingFaceIndex );
}

function layoutEncounter( bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.encounter( legacyCard(), bindings, portraitPanel, selectFaces, iconFaces, numberFaces, bindingFaceIndex );
}

function layoutSimpleEncounter( bindings, portraitPanel, iconFaces, bindingFaceIndex ) {
	return AHLCGModules.Panels.simpleEncounter( legacyCard(), bindings, portraitPanel, iconFaces, bindingFaceIndex );
}
