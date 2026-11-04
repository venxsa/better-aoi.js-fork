/**
 * $base64Decode[text]
 * Decodes a Base64 string (standard or URL safe alphabet) back to text.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;
    const clean = text.trim();

    if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(clean) || clean.length % 4 === 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Base64 Provided In");

    data.result = Buffer.from(clean, "base64").toString("utf8");

    return {
        code: d.util.setCode(data)
    };
};
