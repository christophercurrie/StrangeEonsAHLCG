// Agenda: an act face (see ActFace) with doom in place of clues, the
// agenda's outline and story, and its collector line moved the other way
// when reversed.
//
// Module: returns AgendaFace.
import ActAgenda from './ActAgenda.mjs';
import ActFace from './ActFace.mjs';

class AgendaFace extends ActFace {
    template = 'AHLCG-AgendaFace';
    labelKey = 'AHLCG-Label-Agenda';
    parts = ['AgendaStory', 'Rules'];
    statKey = 'Doom';
    indexLabel = 'AHLCG-AgendaNumber';
    reversedCollectorShift = -209;
    outlineX = [0.0, 0.0, 0.148, 0.148, 1.0, 1.0];
    outlineY = [0.0, 0.85, 0.85, 1.0, 1.0, 0.0];

    defaultValues(diy, faceIndex) {
        return {
            Doom: '3',
            PerInvestigator: '0',
            Asterisk: '0',
            Orientation: 'Standard',
        };
    }

    partFormats(diy, suffix) {
        var alignment = String(
            diy.settings.get('AHLCG-Story-alignment', 'left')
        );
        return {
            AgendaStory: ['<' + alignment + '>', '<gss>', '</gss>'],
        };
    }

    paintStat(g, diy, sheet, suffix, reverse) {
        ActAgenda.paintDoom(this, g, diy, sheet, suffix, reverse != null);
    }
}

export default AgendaFace;
