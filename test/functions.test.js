"use strict";

/**
 * Unit tests for the utility functions added in this fork.
 * Run with: npm test
 *
 * Each function is executed the same way the interpreter does it:
 * the code after the function name is parsed with String.prototype.after
 * and the result is written back with Util.setCode.
 */
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

require("../src/core/prototypes.js");
const Util = require("../src/classes/Util.js");

const FUNCTIONS_DIR = path.join(__dirname, "../src/functions");

function findFunction(name) {
    for (const dir of fs.readdirSync(FUNCTIONS_DIR)) {
        const file = path.join(FUNCTIONS_DIR, dir, `${name}.js`);
        if (fs.existsSync(file)) return require(file);
    }
    throw new Error(`Function ${name} not found`);
}

/**
 * Runs `$name[args]` and returns what the code would look like afterwards,
 * or `{ error }` when the function reported an error.
 * Pass `null` as args to call the function without brackets.
 */
async function run(name, args) {
    const fn = findFunction(name);
    const func = `$${name}`;
    const code = args === null ? func : `${func}[${args}]`;
    let error = null;

    const d = {
        util: Util,
        func,
        command: { code },
        unpack() {
            return code.split(func).pop().after();
        },
        inside(unpacked) {
            return typeof unpacked.inside === "string" ? false : "Missing Brackets";
        },
        error(message) {
            error = message;
        },
        aoiError: {
            fnError(_d, _type, _data, message) {
                error = message ?? "error";
            }
        },
        randoms: {}
    };

    const result = await fn(d);
    if (error) return { error };
    // The interpreter restores escaped characters (#EQUAL# -> "=") before sending.
    return result.code.addBrackets();
}

describe("text functions", () => {
    it("$capitalize", async () => {
        assert.equal(await run("capitalize", "hello world"), "Hello world");
        assert.equal(await run("capitalize", "hELLO;true"), "Hello");
        assert.equal(await run("capitalize", "hELLO;false"), "HELLO");
    });

    it("$toTitleCase", async () => {
        assert.equal(await run("toTitleCase", "the QUICK brown fox"), "The Quick Brown Fox");
        assert.equal(await run("toTitleCase", "don't stop"), "Don't Stop");
    });

    it("$slugify", async () => {
        assert.equal(await run("slugify", "Hello, World!"), "hello-world");
        assert.equal(await run("slugify", "  Zażółć gęślą jaźń  "), "zazolc-gesla-jazn");
        assert.equal(await run("slugify", "Crème Brûlée;_"), "creme_brulee");
    });

    it("$padStart / $padEnd", async () => {
        assert.equal(await run("padStart", "7;3;0"), "007");
        assert.equal(await run("padEnd", "ab;5;*"), "ab***");
        assert.deepEqual(await run("padStart", "x;-1"), { error: "Length Must Be A Non-Negative Integer In" });
        assert.ok((await run("padEnd", "x;999999")).error.includes("Cannot Be Greater"));
    });

    it("$uuid", async () => {
        const first = await run("uuid", null);
        const second = await run("uuid", null);
        const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
        assert.match(first, uuid);
        assert.match(second, uuid);
        assert.notEqual(first, second);
    });

    it("$base64Encode / $base64Decode", async () => {
        assert.equal(await run("base64Encode", "Hello"), "SGVsbG8=");
        assert.equal(await run("base64Decode", "SGVsbG8="), "Hello");
        assert.equal(await run("base64Decode", await run("base64Encode", "zażółć 🙂")), "zażółć 🙂");
        assert.equal(await run("base64Encode", "??>>;true"), "Pz8-Pg");
        assert.equal(await run("base64Decode", "Pz8-Pg"), "??>>");
        assert.ok((await run("base64Decode", "not base64!")).error);
    });

    it("$hash", async () => {
        assert.equal(await run("hash", "md5;hello"), "5d41402abc4b2a76b9719d911017c592");
        assert.equal(await run("hash", "sha256;hello"), "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
        assert.equal(await run("hash", "SHA1;hello;base64"), "qvTGHdzF6KLavt4PO0gs2a6pQ00=");
        assert.ok((await run("hash", "crc32;hello")).error.includes("Invalid Algorithm"));
        assert.ok((await run("hash", "md5;hello;binary")).error.includes("Invalid Encoding"));
    });

    it("$wordCount", async () => {
        assert.equal(await run("wordCount", "one two  three\nfour"), "4");
        assert.equal(await run("wordCount", "   "), "0");
    });

    it("$isEmpty", async () => {
        assert.equal(await run("isEmpty", ""), "true");
        assert.equal(await run("isEmpty", "   "), "true");
        assert.equal(await run("isEmpty", "a"), "false");
    });

    it("$isUrl", async () => {
        assert.equal(await run("isUrl", "https://aoi.js.org/docs?x=1"), "true");
        assert.equal(await run("isUrl", "not a url"), "false");
        assert.equal(await run("isUrl", "ftp://example.com"), "false");
        assert.equal(await run("isUrl", "ftp://example.com;ftp,http"), "true");
        assert.equal(await run("isUrl", "javascript:alert(1)"), "false");
    });

    it("$isEmail", async () => {
        assert.equal(await run("isEmail", "user@example.com"), "true");
        assert.equal(await run("isEmail", "first.last+tag@sub.example.org"), "true");
        assert.equal(await run("isEmail", "user@example"), "false");
        assert.equal(await run("isEmail", "@example.com"), "false");
        assert.equal(await run("isEmail", "us er@example.com"), "false");
    });
});

describe("math functions", () => {
    it("$clamp", async () => {
        assert.equal(await run("clamp", "15;0;10"), "10");
        assert.equal(await run("clamp", "-5;0;10"), "0");
        assert.equal(await run("clamp", "5;0;10"), "5");
        assert.ok((await run("clamp", "5;10;0")).error.includes("Minimum"));
        assert.ok((await run("clamp", "a;0;10")).error.includes("Invalid Number"));
        assert.ok((await run("clamp", "5;0")).error.includes("Invalid Number"));
    });

    it("$average", async () => {
        assert.equal(await run("average", "1;2;3;4"), "2.5");
        assert.equal(await run("average", "7"), "7");
        assert.ok((await run("average", "1;x")).error.includes("Invalid Number"));
    });

    it("$median", async () => {
        assert.equal(await run("median", "3;1;2"), "2");
        assert.equal(await run("median", "4;1;3;2"), "2.5");
        assert.ok((await run("median", "1;;2")).error.includes("Invalid Number"));
    });

    it("$percentage", async () => {
        assert.equal(await run("percentage", "1;3"), "33.33");
        assert.equal(await run("percentage", "1;3;0"), "33");
        assert.equal(await run("percentage", "50;200"), "25");
        assert.ok((await run("percentage", "1;0")).error.includes("Zero"));
        assert.ok((await run("percentage", "1;2;11")).error.includes("Decimals"));
    });

    it("$isEven / $isOdd", async () => {
        assert.equal(await run("isEven", "4"), "true");
        assert.equal(await run("isEven", "7"), "false");
        assert.equal(await run("isOdd", "7"), "true");
        assert.equal(await run("isOdd", "-3"), "true");
        assert.equal(await run("isOdd", "0"), "false");
        assert.ok((await run("isEven", "1.5")).error.includes("Invalid Integer"));
    });
});

describe("function registry", () => {
    it("has no duplicate function names across categories", () => {
        const seen = new Map();
        for (const dir of fs.readdirSync(FUNCTIONS_DIR)) {
            for (const file of fs.readdirSync(path.join(FUNCTIONS_DIR, dir))) {
                const name = file.replace(/\.js$/, "").toLowerCase();
                assert.ok(!seen.has(name), `${name} exists in both ${seen.get(name)} and ${dir}`);
                seen.set(name, dir);
            }
        }
    });

    it("every function file exports a function", () => {
        for (const dir of fs.readdirSync(FUNCTIONS_DIR)) {
            for (const file of fs.readdirSync(path.join(FUNCTIONS_DIR, dir))) {
                const exported = require(path.join(FUNCTIONS_DIR, dir, file));
                assert.equal(typeof exported, "function", `${dir}/${file} must export a function`);
            }
        }
    });
});
