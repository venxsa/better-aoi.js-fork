/**
 * $isEven[number]
 * Returns true when the integer is even.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number] = data.inside.splits;

    if (number.trim() === "" || !Number.isInteger(Number(number))) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Integer Provided In");

    data.result = Number(number) % 2 === 0;

    return {
        code: d.util.setCode(data)
    };
};
