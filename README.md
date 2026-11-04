<p align="center">
  <a href="https://aoi.js.org">
    <img width="500" src="https://i.postimg.cc/KvCzhVBh/better-aoi-js-fork.png" alt="better-aoi.js-fork">
  </a>
</p>

<div align="center">
  <b>A string-based Discord bot framework: fast to write, easy to read, with extra functions on top of aoi.js.</b>
</div>

<br/>

<div align="center">

![License](https://img.shields.io/badge/license-Apache--2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)
[![Tests](https://github.com/venxsa/better-aoi.js-fork/actions/workflows/test.yml/badge.svg)](https://github.com/venxsa/better-aoi.js-fork/actions/workflows/test.yml)

**[Original docs](https://aoi.js.org/)** | **[Support server](https://discord.gg/HMUfMXDQsV)** | **[Original aoi.js](https://github.com/aoijs/aoi.js)**

</div>

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Database](#database)
- [Command handler](#command-handler)
- [New functions in this fork](#new-functions-in-this-fork)
- [Development](#development)
- [Good to know](#good-to-know)
- [Credits and license](#credits-and-license)

## About

**better-aoi.js-fork** is an unofficial, enhanced fork of [aoi.js](https://github.com/aoijs/aoi.js). You write bot commands as short strings of `$functions`, and the library runs them on top of [discord.js](https://discord.js.org) v14. It suits beginners who want a working bot quickly, and experienced developers who want less boilerplate.

All original aoi.js functions are kept. This fork adds extra utility functions and tests (see [below](#new-functions-in-this-fork)).

## Features

- **700+ built-in functions** for messages, embeds, components, guilds, arrays, math, variables and more.
- **Built-in local database** through [`@aoijs/aoi.db`](https://www.npmjs.com/package/@aoijs/aoi.db).
- **Simple syntax:** a command is just `$function[arguments]` inside a string.
- **Custom functions, custom events and sharding** are supported, as in the original.
- **New in this fork:** text, math, encoding and validation helpers, covered by automated tests.

## Installation

Requires **Node.js 20 or newer**.

```bash
npm install github:venxsa/better-aoi.js-fork
```

Then import it in your bot:

```javascript
const { AoiClient } = require("better-aoi.js-fork");
```

> If you installed the package under a different name or from a registry, use that name in `require(...)`.

## Quick start

```javascript
const { AoiClient } = require("better-aoi.js-fork");

const client = new AoiClient({
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    prefix: "!",
    token: process.env.DISCORD_TOKEN
});

client.command({
    name: "ping",
    code: `Pong! $pingms`
});
```

Keep your token out of your source code. Use an environment variable (as above) or a `config.json` that is listed in `.gitignore`.

## Database

```javascript
const { AoiClient } = require("better-aoi.js-fork");

const client = new AoiClient({
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    events: ["onMessage", "onInteractionCreate"],
    prefix: "!",
    token: process.env.DISCORD_TOKEN,
    database: {
        type: "aoi.db",
        db: require("@aoijs/aoi.db"),
        dbType: "KeyValue",
        tables: ["main"],
        securityKey: "a-32-characters-long-string-here"
    }
});
```

`securityKey` must be a string of exactly 32 characters. Choose your own and keep it private.

## Command handler

There is no command handler by default, but you can load a folder of commands:

```javascript
client.loadCommands("./commands/", true);
```

- `./commands/` is the folder that contains your command files.
- `true` logs each loaded command in the console.

## New functions in this fork

These functions are added on top of the original aoi.js set. Each one reports a clear error for invalid input instead of failing silently.

### Text

| Function | Description | Example | Result |
| --- | --- | --- | --- |
| `$capitalize[text;lowerRest?]` | Uppercases the first character. Set `lowerRest` to `true` to lowercase the rest. | `$capitalize[hELLO;true]` | `Hello` |
| `$toTitleCase[text]` | Capitalizes every word. | `$toTitleCase[the QUICK brown fox]` | `The Quick Brown Fox` |
| `$slugify[text;separator?]` | URL-friendly slug. Removes accents (including Polish letters). Default separator is `-`. | `$slugify[Zażółć gęślą jaźń]` | `zazolc-gesla-jazn` |
| `$padStart[text;length;fill?]` | Pads the start up to `length` (max 10000). | `$padStart[7;3;0]` | `007` |
| `$padEnd[text;length;fill?]` | Pads the end up to `length` (max 10000). | `$padEnd[ab;5;*]` | `ab***` |
| `$wordCount[text]` | Counts words. | `$wordCount[one two three]` | `3` |
| `$isEmpty[text]` | `true` if the text is empty or only whitespace. | `$isEmpty[   ]` | `true` |

### Encoding and hashing

| Function | Description | Example | Result |
| --- | --- | --- | --- |
| `$uuid` | Random UUID v4. | `$uuid` | `3b241101-e2bb-4255-8caf-4136c566a962` |
| `$base64Encode[text;urlSafe?]` | Encodes to Base64. `urlSafe` = `true` uses the URL-safe alphabet without padding. | `$base64Encode[Hello]` | `SGVsbG8=` |
| `$base64Decode[text]` | Decodes Base64 (standard or URL-safe). | `$base64Decode[SGVsbG8=]` | `Hello` |
| `$hash[algorithm;text;encoding?]` | Algorithms: `md5`, `sha1`, `sha256`, `sha512`. Encodings: `hex` (default), `base64`. | `$hash[md5;hello]` | `5d41402abc4b2a76b9719d911017c592` |

> `md5` and `sha1` are fine for checksums, but do not use them to store passwords.

### Validation

| Function | Description | Example | Result |
| --- | --- | --- | --- |
| `$isUrl[text;protocols?]` | `true` for a valid URL. Default protocols: `http,https`. | `$isUrl[https://aoi.js.org]` | `true` |
| `$isEmail[text]` | `true` if the text looks like an email address. | `$isEmail[user@example.com]` | `true` |

### Math

| Function | Description | Example | Result |
| --- | --- | --- | --- |
| `$clamp[number;min;max]` | Keeps a number inside a range. | `$clamp[15;0;10]` | `10` |
| `$average[n;n;...]` | Arithmetic mean. | `$average[1;2;3;4]` | `2.5` |
| `$median[n;n;...]` | Middle value. | `$median[4;1;3;2]` | `2.5` |
| `$percentage[part;total;decimals?]` | Percentage of `part` in `total` (default 2 decimals). | `$percentage[1;3]` | `33.33` |
| `$isEven[integer]` | `true` for even integers. | `$isEven[4]` | `true` |
| `$isOdd[integer]` | `true` for odd integers. | `$isOdd[7]` | `true` |

### Example command

```javascript
client.command({
    name: "slug",
    code: `$slugify[$message]`
});

client.command({
    name: "progress",
    code: `You finished $percentage[$message[1];$message[2];1]% of the tasks.`
});
```

## Development

```bash
git clone https://github.com/venxsa/better-aoi.js-fork.git
cd better-aoi.js-fork
npm ci

npm test            # run the unit tests (Node's built-in test runner)
npm run prettycheck # check code formatting
npm run prettywrite # fix code formatting
```

To add a function, create `src/functions/<category>/<name>.js`. It is picked up automatically, and its `$name` becomes available in commands. Add a test for it in `test/functions.test.js`.

The tests run the functions the same way the interpreter does, so they catch both logic mistakes and wrong argument handling. GitHub Actions runs them on Node 20 and 22 for every push and pull request.

## Good to know

- Functions are read from **bottom to top**, so a function placed lower in the code runs first.
- Special characters in function results (such as `=`, `;` or `$`) are escaped internally and restored when the message is sent. This is normal aoi.js behavior.
- This fork follows the original aoi.js function set. For functions not listed above, see the [original documentation](https://aoi.js.org/).

## Credits and license

> [!IMPORTANT]
> This is a fork. All original credit goes to **Akarui Development**, Leref and the aoi.js contributors.

- Fork maintained by [venxsa](https://github.com/venxsa).
- Licensed under the [Apache License 2.0](./LICENSE).
- Contributing: see the [original contribution guide](https://github.com/aoijs/aoi.js/blob/v6/.github/CONTRIBUTING.md) and the files in [`.github`](./.github).
