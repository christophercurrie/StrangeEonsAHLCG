// The fonts of card text: registers the plug-in's fonts and sets the
// families, sizes, widths, weights, tracking and offsets of each kind of text
// from the user's font preferences.
//
// Module: returns { apply }, where apply( o ) sets the font properties of
// the plug-in's shared object.
define(['se/common', 'se/fontutils', 'se/java'], function (
    common,
    FontUtils,
    Java
) {
    const TextAttribute = Java.type('java.awt.font.TextAttribute');
    const WEIGHT_REGULAR = TextAttribute.WEIGHT_REGULAR;
    const WEIGHT_MEDIUM = TextAttribute.WEIGHT_MEDIUM;
    const WEIGHT_BOLD = TextAttribute.WEIGHT_BOLD;
    const WIDTH_REGULAR = TextAttribute.WIDTH_REGULAR;
    const ResourceKit = common.ResourceKit;
    const Settings = common.Settings;

    // a user setting as a string, or null
    function setting(key, missing) {
        var user = Settings.getUser();
        var value =
            missing === undefined ? user.get(key) : user.get(key, missing);
        return value === null || value === undefined ? null : String(value);
    }

    // the first family of the list installed, or the default
    function available(families, missing) {
        return String(ResourceKit.findAvailableFontFamily(families, missing));
    }

    function apply(o) {
        const registerTTFont = function registerTTFont() {
            for (let i = 0; i < arguments.length; ++i) {
                arguments[i] = 'ArkhamHorrorLCG/fonts/' + arguments[i] + '.ttf';
            }
            return String(
                FontUtils.registerFontFamilyFromResources.apply(this, arguments)
            );
        };
        const registerOTFont = function registerOTFont() {
            for (let i = 0; i < arguments.length; ++i) {
                arguments[i] = 'ArkhamHorrorLCG/fonts/' + arguments[i] + '.otf';
            }
            return String(
                FontUtils.registerFontFamilyFromResources.apply(this, arguments)
            );
        };

        var titleFontFamily = setting('AHLCG-DefaultTitleFont');
        var subtitleFontFamily = setting('AHLCG-DefaultSubtitleFont');
        var typeFontFamily = setting('AHLCG-DefaultCardTypeFont');
        var bodyFontFamily = setting('AHLCG-DefaultBodyFont');
        var traitFontFamily = setting('AHLCG-DefaultTraitFont');
        var victoryFontFamily = setting('AHLCG-DefaultVictoryFont');
        var flavorFontFamily = setting('AHLCG-DefaultFlavorFont');
        var storyFontFamily = setting('AHLCG-DefaultStoryFont');
        var collectionFontFamily = setting('AHLCG-DefaultCollectionFont');

        var fTitleSize = setting('AHLCG-DefaultTitleFontSize', '100');
        var fSubtitleSize = setting('AHLCG-DefaultSubtitleFontSize', '100');
        var fCardTypeSize = setting('AHLCG-DefaultCardTypeFontSize', '100');
        var fBodySize = setting('AHLCG-DefaultBodyFontSize', '100');
        var fTraitSize = setting('AHLCG-DefaultTraitFontSize', '100');
        var fVictorySize = setting('AHLCG-DefaultVictoryFontSize', '100');
        var fFlavorSize = setting('AHLCG-DefaultFlavorFontSize', '100');
        var fStorySize = setting('AHLCG-DefaultStoryFontSize', '100');
        var fCollectionSize = setting('AHLCG-DefaultCollectionFontSize', '100');

        var fTitleOffset = setting('AHLCG-DefaultTitleFontOffset', '0');
        var fSubtitleOffset = setting('AHLCG-DefaultSubtitleFontOffset', '0');
        var fCardTypeOffset = setting('AHLCG-DefaultCardTypeFontOffset', '0');
        var fBodyOffset = setting('AHLCG-DefaultBodyFontOffset', '0');
        var fTraitsOffset = setting('AHLCG-DefaultTraitsFontOffset', '0');
        var fVictoryOffset = setting('AHLCG-DefaultVictoryFontOffset', '0');
        var fFlavorOffset = setting('AHLCG-DefaultFlavorFontOffset', '0');
        var fStoryOffset = setting('AHLCG-DefaultStoryFontOffset', '0');
        var fCollectionOffset = setting(
            'AHLCG-DefaultCollectionFontOffset',
            '0'
        );

        var defaultFontList = 'Arno Pro, Times New Roman';

        o.bodyFontTightness = 1.0;

        o.titleFontSize = 11.0;
        o.titleFontWidth = 1.0;
        o.titleFontWeight = WEIGHT_REGULAR;
        o.titleFontTracking = 0.015;

        o.bodyFontSize = 7.8;
        o.bodyFontWidth = 1.0;
        o.bodyFontWeight = WEIGHT_MEDIUM;
        o.bodyFontTracking = 0.0;
        o.bodyStorySize = 7.6;
        o.bodyTraitSize = 7.4;
        o.bodyFlavorSize = 7.4;
        o.bodyVictorySize = 7.4;
        o.bodyStoryWeight = WEIGHT_REGULAR;
        o.bodyTraitWeight = WEIGHT_BOLD;
        o.bodyFlavorWeight = WEIGHT_REGULAR;
        o.bodyVictoryWeight = WEIGHT_BOLD;
        o.bodyStoryWidth = 0.98;
        o.bodyTraitWidth = 1.0;
        o.bodyFlavorWidth = 0.98;
        o.bodyVictoryWidth = 1.0;
        o.bodyStoryTracking = -0.01;
        o.bodyTraitTracking = 0.0;
        o.bodyFlavorTracking = -0.01;
        o.bodyVictoryTracking = 0.0;
        o.smallLabelSize = 4.4;
        o.smallLabelWeight = WEIGHT_BOLD;
        o.smallLabelWidth = 0.98;
        o.smallLabelTracking = 0.0;
        o.largeLabelSize = 5.6;
        o.largeLabelWeight = WEIGHT_BOLD;
        o.largeLabelWidth = 1.05;
        o.largeLabelTracking = 0.0;
        o.subtypeSize = 5.6;
        o.subtypeWeight = WEIGHT_BOLD;
        o.subtypeWidth = 1.0;
        o.subtypeTracking = 0.0;
        o.subtitleSize = 6.0;
        o.subtitleWeight = WEIGHT_BOLD;
        o.subtitleWidth = 1.0;
        o.subtitleTracking = 0.0;
        o.scenarioIndexSize = 6.5;
        o.scenarioIndexWeight = WEIGHT_BOLD;
        o.scenarioIndexWidth = WIDTH_REGULAR;
        o.scenarioIndexTracking = 0.0;
        o.scenarioIndexBackSize = 4.6;
        o.indexSuffixSize = 6.5;
        o.indexSuffixWeight = WEIGHT_BOLD;
        o.indexSuffixWidth = WIDTH_REGULAR;
        o.indexSuffixTracking = 0.0;
        o.indexBackSuffixSize = 4.6;
        o.collectionSize = 4.2;
        o.collectionWeight = WEIGHT_BOLD;
        o.collectionWidth = 1.0;
        o.collectionTracking = 0.01;
        o.difficultySize = 5.6;
        o.difficultyWeight = WEIGHT_BOLD;
        o.difficultyWidth = 0.97;
        o.difficultyTracking = 0.0;

        o.titleFontOffset = 0;
        o.subtitleFontOffset = 0;
        o.typeFontOffset = 0;
        o.bodyFontOffset = 0;
        o.traitFontOffset = 0;
        o.victoryFontOffset = 0;
        o.flavorFontOffset = 0;
        o.storyFontOffset = 0;
        o.collectionFontOffset = 0;

        if (titleFontFamily === null || titleFontFamily === 'Default') {
            o.titleFamily = registerTTFont('Arkhamic');
        } else {
            o.titleFamily = titleFontFamily;

            o.titleFontSize = (11.0 * fTitleSize) / 100.0;
            o.titleFontWidth = 1.0;
            o.titleFontWeight = WEIGHT_REGULAR;
            o.titleFontTracking = 0.0;

            o.titleFontOffset = fTitleOffset;
        }

        if (subtitleFontFamily === null || subtitleFontFamily === 'Default') {
            o.subtitleFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.subtitleFamily === 'Arno Pro') {
                o.subtitleSize = 6.4;
                o.subtitleWidth = 0.96;
                o.subtitleWeight = WEIGHT_BOLD;
                o.subtitleTracking = 0.0;

                o.subtitleFontOffset = 0;
            } else if (o.subtitleFamily === 'Times New Roman') {
                o.subtitleFontOffset = -2;
            }
        } else {
            o.subtitleFamily = subtitleFontFamily;

            o.subtitleSize = (6.0 * fSubtitleSize) / 100.0;
            o.subtitleWidth = 1.0;
            o.subtitleWeight = WEIGHT_BOLD;
            o.subtitleTracking = 0.0;
            o.subtitleFontOffset = fSubtitleOffset;
        }

        if (typeFontFamily === null || typeFontFamily === 'Default') {
            o.typeFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.typeFamily === 'Arno Pro') {
                o.smallLabelSize = 5.0;
                o.smallLabelWidth = 0.92;
                o.smallLabelWeight = WEIGHT_BOLD;
                o.smallLabelTracking = 0.0;
                o.largeLabelSize = 6.0;
                o.largeLabelWidth = 1.05;
                o.largeLabelWeight = WEIGHT_BOLD;
                o.largeLabelTracking = 0.0;
                o.subtypeSize = 6.0;
                o.subtypeWidth = 1.0;
                o.subtypeWeight = WEIGHT_BOLD;
                o.subtypeTracking = 0.0;
                o.scenarioIndexSize = 7.0;
                o.scenarioIndexWeight = WEIGHT_BOLD;
                o.scenarioIndexWidth = WIDTH_REGULAR;
                o.scenarioIndexTracking = 0.0;
                o.scenarioIndexBackSize = 4.9;
                o.difficultySize = 6.0;
                o.difficultyWidth = 0.97;
                o.difficultyWeight = WEIGHT_BOLD;
                o.difficultyTracking = 0.0;

                o.typeFontOffset = 0;
            } else if (o.typeFamily === 'Times New Roman') {
                o.typeFontOffset = -2;
            }
        } else {
            o.typeFamily = typeFontFamily;

            o.smallLabelSize = (4.4 * fCardTypeSize) / 100.0;
            o.smallLabelWidth = 1.0;
            o.smallLabelWeight = WEIGHT_BOLD;
            o.smallLabelTracking = 0.0;
            o.largeLabelSize = (5.6 * fCardTypeSize) / 100.0;
            o.largeLabelWidth = 1.0;
            o.largeLabelWeight = WEIGHT_BOLD;
            o.largeLabelTracking = 0.0;
            o.subtypeSize = (5.6 * fCardTypeSize) / 100.0;
            o.subtypeWidth = 1.0;
            o.subtypeWeight = WEIGHT_BOLD;
            o.subtypeTracking = 0.0;
            o.scenarioIndexSize = (6.5 * fCardTypeSize) / 100.0;
            o.scenarioIndexWeight = WEIGHT_BOLD;
            o.scenarioIndexWidth = WIDTH_REGULAR;
            o.scenarioIndexTracking = 0.0;
            o.scenarioIndexBackSize = (4.6 * fCardTypeSize) / 100.0;
            o.difficultySize = (5.6 * fSubtitleSize) / 100.0;
            o.difficultyWidth = 1.0;
            o.difficultyWeight = WEIGHT_BOLD;
            o.difficultyTracking = 0.0;

            o.typeFontOffset = fCardTypeOffset;
        }

        if (bodyFontFamily === null || bodyFontFamily === 'Default') {
            o.bodyFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.bodyFamily === 'Arno Pro') {
                o.bodyFontSize = 8.6;
                o.bodyFontWidth = 0.98;
                o.bodyFontWeight = WEIGHT_MEDIUM;
                o.bodyFontTracking = -0.01;
                o.bodyFontTightness = 0.9;
                o.bodyFontOffset = 0;
            } else if (o.bodyFamily === 'Times New Roman') {
                o.bodyFontOffset = -2;
            }
        } else {
            o.bodyFamily = bodyFontFamily;

            o.bodyFontSize = (7.8 * fBodySize) / 100.0;
            o.bodyFontWidth = 1.0;
            o.bodyFontWeight = WEIGHT_MEDIUM;
            o.bodyFontTracking = 0.0;

            o.bodyFontOffset = fBodyOffset;
        }

        if (traitFontFamily === null || traitFontFamily === 'Default') {
            o.traitFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.traitFamily === 'Arno Pro') {
                o.bodyTraitSize = 7.8;
                o.bodyTraitWidth = 1.0;
                o.bodyTraitWeight = WEIGHT_BOLD;
                o.bodyTraitTracking = -0.01;

                o.traitFontOffset = 0;
            } else if (o.traitFamily === 'Times New Roman') {
                o.traitFontOffset = -2;
            }
        } else {
            o.traitFamily = traitFontFamily;

            o.bodyTraitSize = (7.4 * fTraitSize) / 100.0;
            o.bodyTraitWidth = 1.0;
            o.bodyTraitWeight = WEIGHT_BOLD;
            o.bodyTraitTracking = 0.0;

            o.traitFontOffset = fTraitsOffset;
        }

        if (victoryFontFamily === null || victoryFontFamily === 'Default') {
            o.victoryFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.victoryFamily === 'Arno Pro') {
                o.bodyVictorySize = 7.8;
                o.bodyVictoryWidth = 1.0;
                o.bodyVictoryWeight = WEIGHT_BOLD;
                o.bodyVictoryTracking = 0.0;

                o.victoryFontOffset = 0;
            } else if (o.victoryFamily === 'Times New Roman') {
                o.victoryFontOffset = -2;
            }
        } else {
            o.victoryFamily = victoryFontFamily;

            o.bodyVictorySize = (7.4 * fVictorySize) / 100.0;
            o.bodyVictoryWidth = 1.0;
            o.bodyVictoryWeight = WEIGHT_BOLD;
            o.bodyVictoryTracking = 0.0;

            o.victoryFontOffset = fVictoryOffset;
        }

        if (flavorFontFamily === null || flavorFontFamily === 'Default') {
            o.flavorFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.flavorFamily === 'Arno Pro') {
                o.bodyFlavorSize = 7.8;
                o.bodyFlavorWidth = 1.0;
                o.bodyFlavorWeight = WEIGHT_REGULAR;
                o.bodyFlavorTracking = -0.01;

                o.flavorFontOffset = 0;
            } else if (o.flavorFamily === 'Times New Roman') {
                o.flavorFontOffset = -2;
            }
        } else {
            o.flavorFamily = flavorFontFamily;

            o.bodyFlavorSize = (7.4 * fFlavorSize) / 100.0;
            o.bodyFlavorWidth = 1.0;
            o.bodyFlavorWeight = WEIGHT_REGULAR;
            o.bodyFlavorTracking = 0.0;

            o.flavorFontOffset = fFlavorOffset;
        }

        if (storyFontFamily === null || storyFontFamily === 'Default') {
            o.storyFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.storyFamily === 'Arno Pro') {
                o.bodyStorySize = 8.6;
                o.bodyStoryWidth = 1.0;
                o.bodyStoryWeight = WEIGHT_REGULAR;
                o.bodyStoryTracking = -0.01;

                o.storyFontOffset = 0;
            } else if (o.storyFamily === 'Times New Roman') {
                o.storyFontOffset = -2;
            }
        } else {
            o.storyFamily = storyFontFamily;

            o.bodyStorySize = (7.6 * fStorySize) / 100.0;
            o.bodyStoryWidth = 1.0;
            o.bodyStoryWeight = WEIGHT_REGULAR;
            o.bodyStoryTracking = 0.0;

            o.storyFontOffset = fStoryOffset;
        }

        if (
            collectionFontFamily === null ||
            collectionFontFamily === 'Default'
        ) {
            o.collectionFamily = available(defaultFontList, 'NimbusRomNo9');

            if (o.collectionFamily === 'Arno Pro') {
                o.collectionSize = 4.5;
                o.collectionWidth = 1.0;
                o.collectionWeight = WEIGHT_BOLD;
                o.collectionTracking = 0.01;

                o.collectionFontOffset = 0;
            } else if (o.collectionFamily === 'Times New Roman') {
                o.collectionFontOffset = -1;
            }
        } else {
            o.collectionFamily = collectionFontFamily;

            o.collectionSize = (4.2 * fCollectionSize) / 100.0;
            o.collectionWidth = 1.0;
            o.collectionWeight = WEIGHT_BOLD;
            o.collectionTracking = 0.0;

            o.collectionFontOffset = fCollectionOffset;
        }

        if (o.OS === 'Mac') {
            o.titleFontWeight = WEIGHT_REGULAR;
            o.bodyFontWeight = WEIGHT_REGULAR;
        }

        var suffixFontFamily = available(defaultFontList, 'NimbusRomNo9L');
        o.suffixFamily = suffixFontFamily;

        if (o.typeFamily === 'Arno Pro') {
            o.indexSuffixSize = 7.0;
            o.indexSuffixWeight = WEIGHT_BOLD;
            o.indexSuffixWidth = WIDTH_REGULAR;
            o.indexSuffixTracking = 0.0;
            o.indexBackSuffixSize = 4.9;
        }

        if (bodyFontFamily === 'NimbusRomNo9')
            o.bodyFamily = registerOTFont(
                'NimbusRomNo9L-Med',
                'NimbusRomNo9L-MedIta',
                'NimbusRomNo9L-Reg',
                'NimbusRomNo9L-RegIta'
            );

        o.symbolSize = 6.8;

        o.skillFamily = registerTTFont('Bolton', 'BoltonBold');
        o.symbolFamily = registerTTFont('AHLCGSymbol');

        o.costFont = ResourceKit.getFont(
            'ArkhamHorrorLCG/fonts/Arkhamic.ttf',
            16.0
        );
        o.enemyFont = ResourceKit.getFont(
            'ArkhamHorrorLCG/fonts/Bolton.ttf',
            16.0
        );
        o.symbolFont = ResourceKit.getFont(
            'ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf',
            16.0
        );
        o.chaosFont = ResourceKit.getFont(
            'ArkhamHorrorLCG/fonts/AHLCGSymbol.ttf',
            14.0
        );
    }

    return { apply: apply };
});
