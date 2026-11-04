/**
 * $toTitleCase[text]
 * Uppercases the first letter of every word and lowercases the rest.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.toLowerCase().replace(/(^|\s)(\S)/gu, (_, space, char) => space + char.toUpperCase());

    return {
        code: d.util.setCode(data)
    };
};
