// Text style settings name the plug-in's fonts as {Eons.namedObjects.AHLCGObject.<name>}
// literals, optionally times or minus a number. Strange Eons evaluates those
// literals with its own script engine, which can't read this plug-in's
// objects, so install replaces them with the values.
//
// Module: returns { expand, literal }.

const Expression =
    /\{\s*Eons\.namedObjects\.AHLCGObject\.(\w+)\s*(?:([*-])\s*(\d+(?:\.\d+)?))?\s*\}/g;

// a style value that reads as the value
function literal(value) {
    if (typeof value === 'number') return '{' + String(value) + '}';
    if (value == null) return '{null}';
    const text = String(value);
    return text.includes("'") ? '"' + text + '"' : "'" + text + "'";
}

function evaluate(o, name, operator, operand) {
    const value = o[name];
    if (operator == null) return value;
    const n = Number(operand);
    return operator === '*' ? value * n : value - n;
}

// replaces the literals in settings' own values with o's values
function expand(settings, o) {
    for (let it = settings.getKeySet().iterator(); it.hasNext();) {
        const key = String(it.next());
        const value = String(settings.get(key));
        if (!value.includes('AHLCGObject')) continue;
        const expanded = value.replace(
            Expression,
            (match, name, operator, operand) =>
                literal(evaluate(o, name, operator, operand))
        );
        if (expanded !== value) settings.set(key, expanded);
    }
}

export default { expand, literal };
