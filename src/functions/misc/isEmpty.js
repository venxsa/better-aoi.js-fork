/**
 * $isEmpty[text]
 * Returns true when the text is empty or only contains whitespace.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.trim() === "";

    return {
        code: d.util.setCode(data)
    };
};
