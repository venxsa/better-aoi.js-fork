/**
 * $uuid
 * Returns a random RFC 4122 version 4 UUID.
 * @param {import("..").Data} d
 */
const { randomUUID } = require("crypto");

module.exports = (d) => {
    const data = d.util.aoiFunc(d, false);

    data.result = randomUUID();

    return {
        code: d.util.setCode(data)
    };
};
