// Images the user names by file path or by identifier (project:, res:, file:,
// http:), as a portrait panel accepts them.
//
// Module: returns { exists, read }; read returns null for an image that
// can't be read.
define(['se/common'], function (common) {
    const StrangeImage = common.StrangeImage;

    function exists(identifier) {
        var id = identifier == null ? '' : String(identifier);
        return id.length > 0 && StrangeImage.exists(id);
    }

    function read(identifier) {
        if (!exists(identifier)) return null;
        return StrangeImage.getAsBufferedImage(String(identifier));
    }

    return { exists: exists, read: read };
});
