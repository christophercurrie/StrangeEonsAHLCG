// The editor's lists of choices: classes, stats, skills, slots, page types,
// orientations, portrait positions and location icons, labelled in the
// interface language.
//
// Module: returns { apply }, where apply( o ) sets the lists on the
// plug-in's shared object.
define(['se/imageutils', 'se/java', 'se/strings'], function (
    imageutils,
    Java,
    strings
) {
    const ListItem = Java.type('ca.cgjennings.apps.arkham.diy.ListItem');
    const ImageUtils = imageutils.ImageUtils;

    function apply(o) {
        // updated arrays for language support
        o.comboClassesI = new Array(
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor')),
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem(
                'ParallelGuardian',
                strings.string('AHLCG-Class-ParallelGuardian')
            ),
            new ListItem(
                'ParallelSeeker',
                strings.string('AHLCG-Class-ParallelSeeker')
            ),
            new ListItem(
                'ParallelRogue',
                strings.string('AHLCG-Class-ParallelRogue')
            ),
            new ListItem(
                'ParallelMystic',
                strings.string('AHLCG-Class-ParallelMystic')
            ),
            new ListItem(
                'ParallelSurvivor',
                strings.string('AHLCG-Class-ParallelSurvivor')
            ),
            new ListItem(
                'ParallelNeutral',
                strings.string('AHLCG-Class-ParallelNeutral')
            )
        );

        o.comboClassesBWS = new Array(
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor')),
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem(
                'Specialist',
                strings.string('AHLCG-Class-Specialist')
            ),
            new ListItem('Story', strings.string('AHLCG-Class-Story')),
            new ListItem(
                'StoryWeakness',
                strings.string('AHLCG-Class-StoryWeakness')
            ),
            new ListItem('Weakness', strings.string('AHLCG-Class-Weakness')),
            new ListItem(
                'BasicWeakness',
                strings.string('AHLCG-Class-BasicWeakness')
            )
        );

        o.comboClassesBW = new Array(
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor')),
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem(
                'Specialist',
                strings.string('AHLCG-Class-Specialist')
            ),
            new ListItem('Weakness', strings.string('AHLCG-Class-Weakness')),
            new ListItem(
                'BasicWeakness',
                strings.string('AHLCG-Class-BasicWeakness')
            )
        );

        o.comboClassesW = new Array(
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor')),
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem('Weakness', strings.string('AHLCG-Class-Weakness'))
        );

        o.comboClassesD = new Array(
            new ListItem('None', strings.string('AHLCG-Class-None')),
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor'))
        );

        o.comboStoryAssetClasses = new Array(
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem('Weakness', strings.string('AHLCG-Class-Weakness'))
        );

        o.comboSkills = new Array(
            new ListItem('None', strings.string('AHLCG-Skill-None')),
            new ListItem('Willpower', strings.string('AHLCG-Skill-Willpower')),
            new ListItem('Intellect', strings.string('AHLCG-Skill-Intellect')),
            new ListItem('Combat', strings.string('AHLCG-Skill-Combat')),
            new ListItem('Agility', strings.string('AHLCG-Skill-Agility')),
            new ListItem('Wild', strings.string('AHLCG-Skill-Wild'))
        );

        o.comboSlots = new Array(
            new ListItem('None', strings.string('AHLCG-Slot-None')),
            new ListItem('Ally', strings.string('AHLCG-Slot-Ally')),
            new ListItem('Accessory', strings.string('AHLCG-Slot-Accessory')),
            new ListItem('Body', strings.string('AHLCG-Slot-Body')),
            new ListItem('Hat', strings.string('AHLCG-Slot-Hat')),
            new ListItem('1 Hand', strings.string('AHLCG-Slot-1Hand')),
            new ListItem('2 Hands', strings.string('AHLCG-Slot-2Hands')),
            new ListItem('1 Arcane', strings.string('AHLCG-Slot-1Arcane')),
            new ListItem('2 Arcane', strings.string('AHLCG-Slot-2Arcane')),
            new ListItem('Foot', strings.string('AHLCG-Slot-Foot')),
            new ListItem('Mask', strings.string('AHLCG-Slot-Mask')),
            new ListItem('Education', strings.string('AHLCG-Slot-Education')),
            new ListItem('Tarot', strings.string('AHLCG-Slot-Tarot'))
        );

        o.comboWeaknessTypes = new Array(
            new ListItem(
                'BasicWeakness',
                strings.string('AHLCG-WknType-BasicWeakness')
            ),
            new ListItem('Weakness', strings.string('AHLCG-WknType-Weakness')),
            new ListItem(
                'StoryWeakness',
                strings.string('AHLCG-WknType-StoryWeakness')
            )
        );

        o.comboWeaknessTypesI = new Array(
            new ListItem(
                'BasicWeakness',
                strings.string('AHLCG-WknType-BasicWeakness')
            ),
            new ListItem('Weakness', strings.string('AHLCG-WknType-Weakness')),
            new ListItem(
                'InvestigatorWeakness',
                strings.string('AHLCG-WknType-InvestigatorWeakness')
            ),
            new ListItem(
                'StoryWeakness',
                strings.string('AHLCG-WknType-StoryWeakness')
            )
        );

        o.comboScenario = new Array(
            new ListItem('Title', strings.string('AHLCG-Scenario-Title')),
            new ListItem(
                'Resolution',
                strings.string('AHLCG-Scenario-Resolution')
            ),
            new ListItem('Chaos', strings.string('AHLCG-StoryTemplate-Token')),
            new ListItem(
                'ChaosFull',
                strings.string('AHLCG-StoryTemplate-TokenFull')
            ),
            new ListItem('Portrait', strings.string('AHLCG-Scenario-Portrait'))
        );

        o.comboBacks = new Array(
            new ListItem('Player', strings.string('AHLCG-Back-Player')),
            new ListItem('Encounter', strings.string('AHLCG-Back-Encounter'))
        );

        o.comboLocationBacks = new Array(
            new ListItem('Standard', strings.string('AHLCG-Back-Standard')),
            new ListItem('Player', strings.string('AHLCG-Back-Player')),
            new ListItem('Encounter', strings.string('AHLCG-Back-Encounter'))
        );

        o.comboGuide = new Array(
            new ListItem('Title', strings.string('AHLCG-Guide-Title')),
            new ListItem('Empty', strings.string('AHLCG-Guide-Empty'))
        );

        o.comboTemplateOrientation = new Array(
            new ListItem(
                'Standard',
                strings.string('AHLCG-Orientation-Standard')
            ),
            new ListItem(
                'Reversed',
                strings.string('AHLCG-Orientation-Reversed')
            )
        );

        o.comboLevelsN = new Array(
            new ListItem('None', strings.string('AHLCG-Level-None'))
        );
        for (let index = 0; index <= 5; index++) {
            o.comboLevelsN[o.comboLevelsN.length] = new ListItem(
                index,
                String(index)
            );
        }
        o.comboPortraitPosition1 = new Array(
            new ListItem('None', strings.string('AHLCG-Guide-None')),
            new ListItem(
                'TopLeftSmall',
                strings.string('AHLCG-Guide-TopLeftSmall')
            ),
            new ListItem(
                'TopLeftMedium',
                strings.string('AHLCG-Guide-TopLeftMedium')
            ),
            new ListItem('TopLarge', strings.string('AHLCG-Guide-TopLarge')),
            new ListItem('TopHalf', strings.string('AHLCG-Guide-TopHalf')),
            new ListItem(
                'BottomLeftSmall',
                strings.string('AHLCG-Guide-BottomLeftSmall')
            ),
            new ListItem(
                'BottomLeftMedium',
                strings.string('AHLCG-Guide-BottomLeftMedium')
            ),
            new ListItem(
                'BottomLarge',
                strings.string('AHLCG-Guide-BottomLarge')
            ),
            new ListItem(
                'BottomHalf',
                strings.string('AHLCG-Guide-BottomHalf')
            ),
            new ListItem('LeftLarge', strings.string('AHLCG-Guide-LeftLarge')),
            new ListItem(
                'TopLeftCorner',
                strings.string('AHLCG-Guide-TopLeftCorner')
            ),
            new ListItem(
                'BottomLeftCorner',
                strings.string('AHLCG-Guide-BottomLeftCorner')
            ),
            new ListItem('FullPage', strings.string('AHLCG-Guide-FullPage'))
        );

        o.comboPortraitPosition2 = new Array(
            new ListItem('None', strings.string('AHLCG-Guide-None')),
            new ListItem(
                'TopRightSmall',
                strings.string('AHLCG-Guide-TopRightSmall')
            ),
            new ListItem(
                'TopRightMedium',
                strings.string('AHLCG-Guide-TopRightMedium')
            ),
            new ListItem('TopLarge', strings.string('AHLCG-Guide-TopLarge')),
            new ListItem('TopHalf', strings.string('AHLCG-Guide-TopRightHalf')),
            new ListItem(
                'BottomRightSmall',
                strings.string('AHLCG-Guide-BottomRightSmall')
            ),
            new ListItem(
                'BottomRightMedium',
                strings.string('AHLCG-Guide-BottomRightMedium')
            ),
            new ListItem(
                'BottomLarge',
                strings.string('AHLCG-Guide-BottomLarge')
            ),
            new ListItem(
                'BottomHalf',
                strings.string('AHLCG-Guide-BottomHalf')
            ),
            new ListItem(
                'RightLarge',
                strings.string('AHLCG-Guide-RightLarge')
            ),
            new ListItem(
                'TopRightCorner',
                strings.string('AHLCG-Guide-TopRightCorner')
            ),
            new ListItem(
                'BottomRightCorner',
                strings.string('AHLCG-Guide-BottomRightCorner')
            )
        );

        o.comboStoryTemplate = new Array(
            new ListItem('Story', strings.string('AHLCG-StoryTemplate-Story')),
            new ListItem('Chaos', strings.string('AHLCG-StoryTemplate-Token')),
            new ListItem(
                'ChaosFull',
                strings.string('AHLCG-StoryTemplate-TokenFull')
            )
        );

        o.comboStoryClass = new Array(
            new ListItem('Default', strings.string('AHLCG-Class-Default')),
            new ListItem('Neutral', strings.string('AHLCG-Class-Neutral')),
            new ListItem('Guardian', strings.string('AHLCG-Class-Guardian')),
            new ListItem('Seeker', strings.string('AHLCG-Class-Seeker')),
            new ListItem('Rogue', strings.string('AHLCG-Class-Rogue')),
            new ListItem('Mystic', strings.string('AHLCG-Class-Mystic')),
            new ListItem('Survivor', strings.string('AHLCG-Class-Survivor'))
        );

        o.comboStoryBackTemplate = new Array(
            new ListItem('Story', strings.string('AHLCG-StoryTemplate-Story')),
            new ListItem('Chaos', strings.string('AHLCG-StoryTemplate-Token')),
            new ListItem(
                'ChaosFull',
                strings.string('AHLCG-StoryTemplate-TokenFull')
            ),
            new ListItem('Player', strings.string('AHLCG-Back-Player')),
            new ListItem('Encounter', strings.string('AHLCG-Back-Encounter'))
        );

        o.comboConcealedTemplate = new Array(
            new ListItem(
                'Standard',
                strings.string('AHLCG-ConcealedTemplate-Standard')
            ),
            new ListItem(
                'Decoy',
                strings.string('AHLCG-ConcealedTemplate-Decoy')
            ),
            new ListItem(
                'NamedDecoy',
                strings.string('AHLCG-ConcealedTemplate-NamedDecoy')
            )
        );

        o.comboStat = new Array();
        for (let index = 0; index <= 9; index++) {
            o.comboStat[o.comboStat.length] = new ListItem(
                index,
                String(index)
            );
        }
        o.comboStat[o.comboStat.length] = new ListItem('X', 'X');
        o.comboStat[o.comboStat.length] = new ListItem('', 'Blank');

        o.comboInvestigatorHealth = new Array();
        for (let index = 1; index <= 15; index++) {
            o.comboInvestigatorHealth[o.comboInvestigatorHealth.length] =
                new ListItem(index, String(index));
        }
        o.comboInvestigatorHealth[o.comboInvestigatorHealth.length] =
            new ListItem('X', 'X');
        o.comboInvestigatorHealth[o.comboInvestigatorHealth.length] =
            new ListItem('', 'Blank');

        o.comboAssetStamina = new Array(
            new ListItem('None', strings.string('AHLCG-Stamina-None')),
            new ListItem('-', '-'),
            new ListItem('', 'Blank'),
            new ListItem('Star', '*')
        );
        for (let index = 1; index <= 15; index++) {
            o.comboAssetStamina[o.comboAssetStamina.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboAssetSanity = new Array(
            new ListItem('None', strings.string('AHLCG-Sanity-None')),
            new ListItem('-', '-'),
            new ListItem('', 'Blank'),
            new ListItem('Star', '*')
        );
        for (let index = 1; index <= 15; index++) {
            o.comboAssetSanity[o.comboAssetSanity.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboEnemyStat = new Array(
            new ListItem('-', '-'),
            new ListItem('?', '?'),
            new ListItem('', 'Blank'),
            new ListItem('X', 'X')
        );
        for (let index = 0; index <= 29; index++) {
            o.comboEnemyStat[o.comboEnemyStat.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboEnemyHealth = new Array(
            new ListItem('-', '-'),
            new ListItem('?', '?'),
            new ListItem('', 'Blank'),
            new ListItem('X', 'X')
        );
        for (let index = 0; index <= 29; index++) {
            o.comboEnemyHealth[o.comboEnemyHealth.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboCost = new Array(
            new ListItem('-', '-'),
            new ListItem('', 'Blank'),
            new ListItem('X', 'X')
        );
        for (let index = 0; index <= 19; index++) {
            o.comboCost[o.comboCost.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboClues = new Array(
            new ListItem('-', '-'),
            new ListItem('?', '?'),
            new ListItem('', 'Blank'),
            new ListItem('Star', '*')
        );
        for (let index = 0; index <= 19; index++) {
            o.comboClues[o.comboClues.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.comboCustCost = new Array();
        for (let index = 1; index <= 5; index++) {
            o.comboCustCost[index - 1] = new ListItem(index, String(index));
        }

        o.combo5 = new Array();
        for (let index = 0; index <= 5; index++) {
            o.combo5[index] = new ListItem(index, String(index));
        }

        o.combo20 = new Array();
        for (let index = 0; index <= 20; index++) {
            o.combo20[index] = new ListItem(index, String(index));
        }

        o.comboXD20 = new Array(
            new ListItem('-', '-'),
            new ListItem('X', 'X'),
            new ListItem('', 'Blank'),
            new ListItem('Star', '*')
        );
        for (let index = 0; index <= 20; index++) {
            o.comboXD20[o.comboXD20.length] = new ListItem(
                index,
                String(index)
            );
        }

        o.locationIcons = [
            'Circle',
            'Square',
            'Triangle',
            'Cross',
            'Diamond',
            'Slash',
            'T',
            'Hourglass',
            'Moon',
            'DoubleSlash',
            'Heart',
            'Star',
            'Quote',
            'Clover',
            'Spade',
            'CircleAlt',
            'SquareAlt',
            'TriangleAlt',
            'CrossAlt',
            'DiamondAlt',
            'SlashAlt',
            'TAlt',
            'HourglassAlt',
            'MoonAlt',
            'DoubleSlashAlt',
            'HeartAlt',
            'StarAlt',
        ];

        o.comboConnections = new Array(
            new ListItem(
                'None',
                strings.string('AHLCG-LocIcon-None'),
                ImageUtils.createIcon(
                    ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png'),
                    12,
                    12
                )
            ),
            new ListItem(
                'Empty',
                strings.string('AHLCG-LocIcon-Empty'),
                ImageUtils.createIcon(
                    ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png'),
                    12,
                    12
                )
            )
        );

        o.comboConnectionsBack = [
            new ListItem(
                'Copy front',
                strings.string('AHLCG-LocIcon-CopyFront'),
                ImageUtils.createIcon(
                    ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png'),
                    12,
                    12
                )
            ),
            new ListItem(
                'None',
                strings.string('AHLCG-LocIcon-None'),
                ImageUtils.createIcon(
                    ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png'),
                    12,
                    12
                )
            ),
            new ListItem(
                'Empty',
                strings.string('AHLCG-LocIcon-Empty'),
                ImageUtils.createIcon(
                    ImageUtils.get('ArkhamHorrorLCG/images/empty1x1.png'),
                    12,
                    12
                )
            ),
        ];

        for (let index = 0; index < o.locationIcons.length; index++) {
            let item = o.locationIcons[index];

            // location icon images include their colored base
            let iconImage = ImageUtils.get(
                'ArkhamHorrorLCG/icons/AHLCG-Loc' + item + '.png'
            );

            o.comboConnections[index + 2] = new ListItem(
                item,
                strings.string('AHLCG-LocIcon-' + item),
                ImageUtils.createIcon(iconImage, 12, 12)
            );

            o.comboConnectionsBack[index + 3] = new ListItem(
                item,
                strings.string('AHLCG-LocIcon-' + item),
                ImageUtils.createIcon(iconImage, 12, 12)
            );
        }
    }

    return { apply: apply };
});
