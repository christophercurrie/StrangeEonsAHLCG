// Strange Eons markup library: markup boxes and their layout constants.
//
// Module: returns { markupBox, updateNameTags, FIT_NONE, FIT_SCALE_TEXT,
// LAYOUT_TOP, LAYOUT_MIDDLE, LAYOUT_BOTTOM, LAYOUT_CENTER, SIZE }.
/* global
  useLibrary, markupBox, updateNameTags, FIT_NONE, FIT_SCALE_TEXT, LAYOUT_TOP,
  LAYOUT_MIDDLE, LAYOUT_BOTTOM, LAYOUT_CENTER, SIZE
 */
useLibrary( 'markup' );

define( function () {
	return {
		markupBox: markupBox,
		updateNameTags: updateNameTags,
		FIT_NONE: FIT_NONE,
		FIT_SCALE_TEXT: FIT_SCALE_TEXT,
		LAYOUT_TOP: LAYOUT_TOP,
		LAYOUT_MIDDLE: LAYOUT_MIDDLE,
		LAYOUT_BOTTOM: LAYOUT_BOTTOM,
		LAYOUT_CENTER: LAYOUT_CENTER,
		SIZE: SIZE
	};
} );
