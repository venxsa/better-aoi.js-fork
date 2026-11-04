/**
 * $average[number;number;...]
 * Returns the arithmetic mean of the given numbers.
 * @param {import("..").Data} d
 */
const isNum = (value) => value.trim() !== "" && Number.isFinite(Number(value));

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const numbers = data.inside.splits;

    if (!numbers.every(isNum)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Number Provided In");

    data.result = numbers.reduce((total, n) => total + Number(n), 0) / numbers.length;

    return {
        code: d.util.setCode(data)
    };
};
