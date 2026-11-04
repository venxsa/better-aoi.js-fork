/**
 * $wordCount[text]
 * Counts the words in the text (words are separated by any whitespace).
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;
    const trimmed = text.trim();

    data.result = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    return {
        code: d.util.setCode(data)
    };
};
