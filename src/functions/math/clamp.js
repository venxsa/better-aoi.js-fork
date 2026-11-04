/**
 * $clamp[number;min;max]
 * Restricts the number to the range min..max.
 * @param {import("..").Data} d
 */
const isNum = (value) => value.trim() !== "" && Number.isFinite(Number(value));

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number, min, max] = data.inside.splits;

    if (![number, min, max].every((v) => v !== undefined && isNum(v))) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Number Provided In");
    if (Number(min) > Number(max)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Minimum Cannot Be Greater Than Maximum In");

    data.result = Math.min(Math.max(Number(number), Number(min)), Number(max));

    return {
        code: d.util.setCode(data)
    };
};
