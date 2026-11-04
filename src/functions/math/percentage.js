/**
 * $percentage[part;total;decimals?]
 * Returns what percentage `part` is of `total` (decimals defaults to 2).
 * @param {import("..").Data} d
 */
const isNum = (value) => value.trim() !== "" && Number.isFinite(Number(value));

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [part, total, decimals = "2"] = data.inside.splits;

    if (![part, total].every((v) => v !== undefined && isNum(v))) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Number Provided In");
    if (Number(total) === 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Total Cannot Be Zero In");
    if (!Number.isInteger(Number(decimals)) || Number(decimals) < 0 || Number(decimals) > 10)
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Decimals Must Be An Integer Between 0 And 10 In");

    data.result = Number(((Number(part) / Number(total)) * 100).toFixed(Number(decimals)));

    return {
        code: d.util.setCode(data)
    };
};
