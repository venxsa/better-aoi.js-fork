/**
 * $median[number;number;...]
 * Returns the median (middle value) of the given numbers.
 * @param {import("..").Data} d
 */
const isNum = (value) => value.trim() !== "" && Number.isFinite(Number(value));

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const numbers = data.inside.splits;

    if (!numbers.every(isNum)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Number Provided In");

    const sorted = numbers.map(Number).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    data.result = sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];

    return {
        code: d.util.setCode(data)
    };
};
