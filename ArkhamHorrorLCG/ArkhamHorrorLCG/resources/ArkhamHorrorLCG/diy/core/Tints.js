// Tint caches for the guide's interlude and resolution boxes, made the first
// time each is asked for.
//
// Module: returns { install }, where install( o ) adds the getters to the
// plug-in's shared object.
define(['se/imageutils', 'se/java'], function (imageutils, Java) {
    const TintCache = Java.type('ca.cgjennings.graphics.filters.TintCache');
    const TintFilter = Java.type('ca.cgjennings.graphics.filters.TintFilter');
    const ImageUtils = imageutils.ImageUtils;

    function install(o) {
        o.getIntBoxTint = function () {
            if (o.intBoxTint) return o.intBoxTint;

            o.intBoxTint = new TintCache(new TintFilter());
            o.intBoxTint.setImage(
                ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxIntRed.png')
            );

            return o.intBoxTint;
        };
        o.getIntMidTint = function () {
            if (o.intMidTint) return o.intMidTint;

            o.intMidTint = new TintCache(new TintFilter());
            o.intMidTint.setImage(
                ImageUtils.get(
                    'ArkhamHorrorLCG/overlays/AHLCG-BoxIntLineRed.png'
                )
            );

            return o.intMidTint;
        };
        o.getBracketTint = function () {
            if (o.bracketTint) return o.bracketTint;

            o.bracketTint = new TintCache(new TintFilter());
            o.bracketTint.setImage(
                ImageUtils.get(
                    'ArkhamHorrorLCG/overlays/AHLCG-BoxResBracketRed.png'
                )
            );

            return o.bracketTint;
        };
        o.getResBoxTint = function () {
            if (o.resBoxTint) return o.resBoxTint;

            o.resBoxTint = new TintCache(new TintFilter());
            o.resBoxTint.setImage(
                ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxResRed.png')
            );

            return o.resBoxTint;
        };
        o.getResMidTint = function () {
            if (o.resMidTint) return o.resMidTint;

            o.resMidTint = new TintCache(new TintFilter());
            o.resMidTint.setImage(
                ImageUtils.get(
                    'ArkhamHorrorLCG/overlays/AHLCG-BoxResLineRed.png'
                )
            );

            return o.resMidTint;
        };
    }

    return { install: install };
});
