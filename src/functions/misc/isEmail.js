/**
 * $isEmail[text]
 * Returns true when the text looks like a valid email address.
 * @param {import("..").Data} d
 */
const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;
    const email = text.trim();

    data.result = email.length <= 254 && EMAIL.test(email);

    return {
        code: d.util.setCode(data)
    };
};
