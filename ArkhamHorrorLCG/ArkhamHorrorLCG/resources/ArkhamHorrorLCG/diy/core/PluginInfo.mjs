// The plug-in's name, description, version and game language, and its
// images by name.
//
// Module: returns { name, description, version, locale, image }.
import common from '../se/common.mjs';
import imageutils from '../se/imageutils.mjs';
import strings from '../se/strings.mjs';

function name() {
    return strings.string('AHLCG');
}

function description() {
    return strings.string('AHLCG-Description');
}

function version() {
    return 9.96;
}

// the game language, without its country
function locale() {
    return String(common.Language.getGameLocale()).split('_')[0];
}

// ArkhamHorrorLCG/[folder/]resource.ext, a jp2 by default
function image(resource, folder, ext) {
    if (ext === undefined) ext = 'jp2';
    var path = 'ArkhamHorrorLCG/';
    if (folder !== undefined && folder.length > 0) path += folder + '/';
    return imageutils.ImageUtils.get(path + resource + '.' + ext);
}

export default {
    name: name,
    description: description,
    version: version,
    locale: locale,
    image: image,
};
