// Strange Eons markup library: markup boxes and their layout constants.
//
// Module: returns { markupBox, updateNameTags, FIT_SCALE_TEXT, LAYOUT_TOP,
// LAYOUT_MIDDLE, LAYOUT_BOTTOM, LAYOUT_CENTER }.
useLibrary( 'markup' );

define( function () {
	return {
		markupBox: markupBox,
		updateNameTags: updateNameTags,
		FIT_SCALE_TEXT: FIT_SCALE_TEXT,
		LAYOUT_TOP: LAYOUT_TOP,
		LAYOUT_MIDDLE: LAYOUT_MIDDLE,
		LAYOUT_BOTTOM: LAYOUT_BOTTOM,
		LAYOUT_CENTER: LAYOUT_CENTER
	};
} );
