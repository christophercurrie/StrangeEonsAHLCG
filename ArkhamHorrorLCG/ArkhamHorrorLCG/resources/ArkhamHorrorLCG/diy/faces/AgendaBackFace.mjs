// Agenda back: an act back (see ActBackFace) on the agenda's template.
//
// Module: returns AgendaBackFace.
import ActBackFace from './ActBackFace.mjs';

class AgendaBackFace extends ActBackFace {
    template = 'AHLCG-AgendaBackFace';
    labelKey = 'AHLCG-Label-Agenda';
}

export default AgendaBackFace;
