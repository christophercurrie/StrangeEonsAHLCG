// The names of the markup tags and styles cards set up on their text boxes;
// the text entry tags depend on the body font.
//
// Module: returns { apply }, where apply( o ) sets the lists on the
// plug-in's shared object, after its fonts.
define(function () {
    function apply(o) {
        o.TagList = [
            'Fast',
            'HorizontalSpacer',
            'LargeVerticalSpacer',
            'VerticalSpacer',
            'SmallVerticalSpacer',
            'Action',
            'Reaction',
            'Fast',
            'Guardian',
            'Seeker',
            'Rogue',
            'Mystic',
            'Survivor',
            'Willpower',
            'Intellect',
            'Combat',
            'Agility',
            'Wild',
            'Skull',
            'Cultist',
            'Artifact',
            'Monster',
            'Bless',
            'Curse',
            'Frost',
            'ElderSign',
            'Tentacle',
            'Unique',
            'PerInvestigator',
            'Prey',
            'Spawn',
            'Revelation',
            'Forced',
            'Objective',
            'Haunted',
            'Shift',
            'Bullet',
            'Resolution',
            'EndResolution',
            'GuideBullet',
            'Square',
            'Seal1',
            'Seal2',
            'Seal3',
            'Seal4',
            'Seal5',
            'Asterisk',
            'Dash',
            'CheckBox',
            'Damage',
            'Horror',
            'Resource',
            'Codex',
        ];

        if (o.bodyFamily === 'Arno Pro') {
            o.TagList.push(
                'TextEntry1A',
                'TextEntry2A',
                'TextEntry3A',
                'TextEntry4A',
                'TextEntry5A',
                'XPBoxA'
            );
        } else {
            o.TagList.push(
                'TextEntry1',
                'TextEntry2',
                'TextEntry3',
                'TextEntry4',
                'TextEntry5',
                'XPBox'
            );
        }

        o.StyleList = [
            'Trait',
            'Flavor',
            'Story',
            'Victory',
            'Header',
            'Body',
            'TraitSection',
            'FlavorSection',
            'InvStorySection',
            'ActStorySection',
            'AgendaStorySection',
            'AHF',
        ];

        o.SmallStyleTagList = new Array('AHFSmall');

        o.GuideStyleList = ['GuideSection', 'GuideHeader', 'GuideBoxBullet'];

        o.CopyrightTagList = new Array('Copyright');

        o.SuffixTagList = ['Suffix', 'SuffixBack'];
    }

    return { apply: apply };
});
