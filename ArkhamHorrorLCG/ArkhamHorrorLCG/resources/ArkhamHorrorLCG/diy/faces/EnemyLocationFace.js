// An enemy that is also a location: art, title, game text in the location's
// outline with a victory box, shroud and clues, fight, health and evade, and
// damage and horror.
//
// Module: returns EnemyLocationFace.
define([
    'faces/CardFace',
    'faces/EnemyFace',
    'faces/FaceUtils',
    'faces/LocationFace',
    'faces/LocationParts',
    'se/strings',
    'se/ui',
], function (
    CardFace,
    EnemyFace,
    FaceUtils,
    LocationFace,
    LocationParts,
    strings,
    ui
) {
    function EnemyLocationFace() {
        LocationFace.call(this);
    }

    EnemyLocationFace.prototype = Object.create(LocationFace.prototype);
    EnemyLocationFace.prototype.constructor = EnemyLocationFace;
    EnemyLocationFace.prototype.template = 'AHLCG-EnemyLocationFace';
    EnemyLocationFace.prototype.hasSubtitle = false;
    EnemyLocationFace.prototype.healthPerInvestigator = 'PerInvestigatorHealth';
    EnemyLocationFace.prototype.paintStat = EnemyFace.prototype.paintStat;
    EnemyLocationFace.prototype.paintHealth = EnemyFace.prototype.paintHealth;
    EnemyLocationFace.prototype.paintTokens = EnemyFace.prototype.paintTokens;

    EnemyLocationFace.prototype.defaultValues = function (diy, faceIndex) {
        return {
            Shroud: '1',
            Clues: '1',
            PerInvestigator: '1',
            ShroudPerInvestigator: '0',
            Health: '2',
            PerInvestigatorHealth: '0',
            Attack: '2',
            PerInvestigatorAttack: '0',
            Evade: '2',
            PerInvestigatorEvade: '0',
            Damage: '0',
            Horror: '0',
        };
    };

    // the location's stats, then the enemy's
    EnemyLocationFace.prototype.createPanels = function (
        diy,
        bindings,
        faceIndex
    ) {
        var o = FaceUtils.plugin();
        var face = this;
        var panel = this.createStatPanel(bindings, faceIndex);
        function list(name, items) {
            var control = new ui.comboBox(items, null);
            face.bind(bindings, faceIndex, name, control);
            return control;
        }
        function perInvestigator(name) {
            var control = CardFace.iconButton('PerInvestigator');
            face.bind(bindings, faceIndex, name, control);
            return control;
        }
        var toggle = 'wmax 35, hmin 25, hmax 25';
        var enemy = new ui.Grid();
        enemy.place(
            strings.string('AHLCG-Attack'),
            'align right',
            list('Attack', o.comboEnemyStat),
            'pushx, growx',
            perInvestigator('PerInvestigatorAttack'),
            toggle,
            strings.string('AHLCG-Damage'),
            'align right, gapx 10',
            list('Damage', o.combo5),
            'wrap, pushx, growx, sizegroup sp',
            strings.string('AHLCG-Health'),
            'align right',
            list('Health', o.comboEnemyHealth),
            'pushx, growx',
            perInvestigator('PerInvestigatorHealth'),
            toggle,
            strings.string('AHLCG-Horror'),
            'align right',
            list('Horror', o.combo5),
            'wrap, pushx, growx, sizegroup sp',
            strings.string('AHLCG-Evade'),
            'align right',
            list('Evade', o.comboEnemyStat),
            'pushx, growx',
            perInvestigator('PerInvestigatorEvade'),
            toggle
        );
        panel.place(enemy, 'newline, span, pushx, growx');
        return [{ panel: panel, title: strings.string('AHLCG-BasicData') }];
    };

    EnemyLocationFace.prototype.paintContent = function (
        g,
        diy,
        sheet,
        boxes,
        collector
    ) {
        var suffix = this.suffix(sheet.getSheetIndex());
        this.paintName(g, diy, sheet, boxes.name);
        this.paintBody(g, diy, boxes.body, suffix);
        this.paintVictory(g, diy, boxes.victory, suffix);
        LocationParts.paintShroud(this, g, diy, sheet, suffix);
        LocationParts.paintClues(this, g, diy, sheet, suffix, false, null);
        this.paintStat(g, diy, sheet, 'Attack', suffix);
        this.paintStat(g, diy, sheet, 'Evade', suffix);
        this.paintHealth(g, diy, sheet, suffix);
        this.paintTokens(g, diy, sheet, 'Damage', suffix);
        this.paintTokens(g, diy, sheet, 'Horror', suffix);
        this.paintCollector(g, diy, sheet, boxes, collector, true, true);
    };

    return EnemyLocationFace;
});
