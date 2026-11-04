// Agenda: an act face (see ActFace) with doom in place of clues, the
// agenda's outline and story, and its collector line moved the other way
// when reversed.
//
// Module: returns AgendaFace.
define(['faces/ActAgenda', 'faces/ActFace'], function (ActAgenda, ActFace) {
    function AgendaFace() {
        ActFace.call(this);
    }

    AgendaFace.prototype = Object.create(ActFace.prototype);
    AgendaFace.prototype.constructor = AgendaFace;
    AgendaFace.prototype.template = 'AHLCG-AgendaFace';
    AgendaFace.prototype.labelKey = 'AHLCG-Label-Agenda';
    AgendaFace.prototype.parts = ['AgendaStory', 'Rules'];
    AgendaFace.prototype.statKey = 'Doom';
    AgendaFace.prototype.indexLabel = 'AHLCG-AgendaNumber';
    AgendaFace.prototype.reversedCollectorShift = -209;
    AgendaFace.prototype.outlineX = [0.0, 0.0, 0.148, 0.148, 1.0, 1.0];
    AgendaFace.prototype.outlineY = [0.0, 0.85, 0.85, 1.0, 1.0, 0.0];

    AgendaFace.prototype.defaultValues = function (diy, faceIndex) {
        return {
            Doom: '3',
            PerInvestigator: '0',
            Asterisk: '0',
            Orientation: 'Standard',
        };
    };

    AgendaFace.prototype.partFormats = function (diy, suffix) {
        var alignment = String(
            diy.settings.get('AHLCG-Story-alignment', 'left')
        );
        return {
            AgendaStory: ['<' + alignment + '>', '<gss>', '</gss>'],
        };
    };

    AgendaFace.prototype.paintStat = function (g, diy, sheet, suffix, reverse) {
        ActAgenda.paintDoom(this, g, diy, sheet, suffix, reverse != null);
    };

    return AgendaFace;
});
