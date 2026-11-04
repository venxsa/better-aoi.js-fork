/**
 * $hash[algorithm;text;encoding?]
 * Hashes text. Algorithms: md5, sha1, sha256, sha512. Encodings: hex (default), base64.
 * md5 and sha1 are only meant for checksums, never for passwords.
 * @param {import("..").Data} d
 */
const { createHash } = require("crypto");

const ALGORITHMS = ["md5", "sha1", "sha256", "sha512"];
const ENCODINGS = ["hex", "base64"];

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [algorithm, text, encoding = "hex"] = data.inside.splits;
    const algo = algorithm.trim().toLowerCase();
    const enc = encoding.trim().toLowerCase() || "hex";

    if (!ALGORITHMS.includes(algo)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, `Invalid Algorithm Provided In (use ${ALGORITHMS.join(", ")})`);
    if (!ENCODINGS.includes(enc)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, `Invalid Encoding Provided In (use ${ENCODINGS.join(", ")})`);

    data.result = createHash(algo)
        .update(text ?? "", "utf8")
        .digest(enc);

    return {
        code: d.util.setCode(data)
    };
};
