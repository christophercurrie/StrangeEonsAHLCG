// Image filters used by legacy handlers.
//
// Module: returns { greyscale, inverted, blurred, alphaInverted }.
import Java from '../se/java.mjs';

const Filters = 'ca.cgjennings.graphics.filters.';

function filter(name, args) {
    var Filter = Java.type(Filters + name);
    var instance = args == null ? new Filter() : new Filter(args);
    return function (source) {
        return instance.filter(source, null);
    };
}

export default {
    greyscale: filter('GreyscaleFilter'),
    inverted: filter('InversionFilter'),
    blurred: filter('GaussianBlurFilter', 40),
    alphaInverted: filter('AlphaInversionFilter'),
};
