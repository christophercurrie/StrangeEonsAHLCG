// A legacy card type with a fixed face on each side.
//
// config, as for FaceHandler, and:
//   faces            [ front, back ] face constructors
//   legacyPortraits  the portraits its legacy saves hold; see
//                    FaceHandler.legacyPortraits
//   upgrade          function( diy ) for older saves, before the faces' missing
//                    settings are set; diy.version is the saved version
//
// Module: returns ShimHandler.
import FaceHandler from './FaceHandler.mjs';

class ShimHandler extends FaceHandler {
    constructor(config) {
        super(config, new config.faces[0](), new config.faces[1]());
    }
}

export default ShimHandler;
