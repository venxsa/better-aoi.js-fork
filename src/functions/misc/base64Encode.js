/**
 * $base64Encode[text;urlSafe?]
 * Encodes text to Base64. With urlSafe "true" the URL safe alphabet is used and padding is removed.
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, urlSafe = "false"] = data.inside.splits;

    data.result = Buffer.from(text, "utf8").toString(urlSafe === "true" ? "base64url" : "base64");

    return {
        code: d.util.setCode(data)
    };
};
