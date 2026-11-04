/**
 * $padStart[text;length;fill?]
 * Pads the start of the text until it reaches the given length (fill defaults to a space).
 * @param {import("..").Data} d
 */
const MAX_LENGTH = 10000;

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, length, fill = " "] = data.inside.splits;
    const target = Number(length);

    if (length.trim() === "" || !Number.isInteger(target) || target < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Length Must Be A Non-Negative Integer In");
    if (target > MAX_LENGTH) return d.aoiError.fnError(d, "custom", { inside: data.inside }, `Length Cannot Be Greater Than ${MAX_LENGTH} In`);

    data.result = text.padStart(target, fill === "" ? " " : fill);

    return {
        code: d.util.setCode(data)
    };
};
