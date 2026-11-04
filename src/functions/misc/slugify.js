/**
 * $slugify[text;separator?]
 * Turns text into a URL friendly slug: lowercase, accents removed,
 * everything that is not a letter or number replaced by the separator (default "-").
 * @param {import("..").Data} d
 */

// Letters that do not decompose with Unicode normalisation.
const SPECIAL = {
    ł: "l",
    Ł: "L",
    ø: "o",
    Ø: "O",
    đ: "d",
    Đ: "D",
    ß: "ss",
    æ: "ae",
    Æ: "AE",
    œ: "oe",
    Œ: "OE"
};

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, separator = "-"] = data.inside.splits;
    const sep = separator === "" ? "-" : separator;
    const escaped = sep.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");

    data.result = text
        .replace(/[łŁøØđĐßæÆœŒ]/g, (char) => SPECIAL[char])
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, sep)
        .replace(new RegExp(`^(?:${escaped})+|(?:${escaped})+$`, "g"), "");

    return {
        code: d.util.setCode(data)
    };
};
