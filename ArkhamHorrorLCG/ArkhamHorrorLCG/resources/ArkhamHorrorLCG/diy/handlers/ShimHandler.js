// A legacy card type with a fixed face on each side.
//
// config, as for FaceHandler, and:
//   faces            [ front, back ] face constructors
//   legacyPortraits  the portraits its legacy saves hold; see
//                    FaceHandler.legacyPortraits
//   cardDefaults     settings a new card starts with, over the faces' own
//   upgrade          function( diy ) for older saves, before the faces' missing
//                    settings are set; diy.version is the saved version
//
// Module: returns ShimHandler.
define(['handlers/FaceHandler'], function (FaceHandler) {
    function ShimHandler(config) {
        FaceHandler.call(
            this,
            config,
            new config.faces[0](),
            new config.faces[1]()
        );
        this.cardDefaults = config.cardDefaults || {};
    }

    ShimHandler.prototype = Object.create(FaceHandler.prototype);
    ShimHandler.prototype.constructor = ShimHandler;

    ShimHandler.prototype.setCardDefaults = function (diy) {
        for (let key in this.cardDefaults) {
            diy.settings.set(key, this.cardDefaults[key]);
        }
    };

    return ShimHandler;
});
