/**
 * $isUrl[text;protocols?]
 * Returns true when the text is a valid URL.
 * protocols is a comma separated list (default "http,https").
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, protocols = "http,https"] = data.inside.splits;
    const allowed = protocols
        .split(",")
        .map((p) => p.trim().toLowerCase().replace(/:$/, ""))
        .filter(Boolean);

    let valid = false;
    try {
        const url = new URL(text.trim());
        valid = allowed.includes(url.protocol.replace(/:$/, "").toLowerCase()) && url.hostname !== "";
    } catch {
        valid = false;
    }

    data.result = valid;

    return {
        code: d.util.setCode(data)
    };
};
