// Agenda back: an act back (see ActBackFace) on the agenda's template.
//
// Module: returns AgendaBackFace.
define(['faces/ActBackFace'], function (ActBackFace) {
    function AgendaBackFace() {
        ActBackFace.call(this);
    }

    AgendaBackFace.prototype = Object.create(ActBackFace.prototype);
    AgendaBackFace.prototype.constructor = AgendaBackFace;
    AgendaBackFace.prototype.template = 'AHLCG-AgendaBackFace';
    AgendaBackFace.prototype.labelKey = 'AHLCG-Label-Agenda';

    return AgendaBackFace;
});
