// Token text as the legacy chaos layouts save it, per side: text for each
// token, <token><suffix>, joined to another token's group by
// Merge<token><suffix>.
//
// Module: returns { toBlocks, clear }.
define(function () {
    const Tokens = ['Skull', 'Cultist', 'Tablet', 'ElderThing'];

    // Token blocks for a side of a legacy card, grouped as the legacy layout
    // grouped them: a token without text is left out unless merged, and a
    // group shows the text of its first token that has some.
    function toBlocks(settings, suffix) {
        var text = Tokens.map(function (token) {
            return String(settings.get(token + suffix, ''));
        });
        var group = text.map(function (t, i) {
            return t.length > 0 ? i : Tokens.length;
        });
        Tokens.forEach(function (token, i) {
            var j = Tokens.indexOf(
                String(settings.get('Merge' + token + suffix, 'None'))
            );
            if (j < 0) return;
            group[i] = group[j] = Math.min(group[i], group[j]);
        });

        var blocks = [];
        for (let g = 0; g < Tokens.length; g++) {
            let members = Tokens.filter(function (token, i) {
                return group[i] === g;
            });
            if (members.length === 0) continue;
            blocks.push({
                style: 'token',
                text: text.filter(function (t, i) {
                    return group[i] === g && t.length > 0;
                })[0],
                spacing: 0,
                tokens: members,
            });
        }
        return blocks;
    }

    function clear(settings, suffix) {
        Tokens.forEach(function (token) {
            settings.reset(token + suffix);
            settings.reset(token + suffix + 'Spacing');
            settings.reset('Merge' + token + suffix);
        });
    }

    return { toBlocks: toBlocks, clear: clear };
});
