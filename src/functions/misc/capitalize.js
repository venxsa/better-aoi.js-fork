/**
 * $capitalize[text;lowerRest?]
 * Uppercases the first character of the text.
 * If lowerRest is "true" the rest of the text is lowercased as well.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, lowerRest = "false"] = data.inside.splits;

    const rest = lowerRest === "true" ? text.slice(1).toLowerCase() : text.slice(1);
    data.result = text.charAt(0).toUpperCase() + rest;

    return {
        code: d.util.setCode(data)
    };
};
