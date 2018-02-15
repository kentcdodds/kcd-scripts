<div align="center">
<h1>@iopipe/scripts 🛠📦</h1>

<p>Scripts for IOpipe projects</p>
</div>

<hr />

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Overriding Config](#overriding-config)
- [Thank You](#thank-you)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

- Node v8.5 +

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
yarn add @iopipe/scripts --dev
```

## Usage

This is a CLI and exposes a bin called iopipe-scripts.

This project actually dogfoods itself. If you look in the package.json, you'll find scripts with node src {scriptName}. This serves as an example of some of the things you can do with iopipe-scripts.

A great example of this package in use can be found at the [IOpipe event-info plugin repo](https://github.com/iopipe/iopipe-js-event-info/blob/master/package.json).

You'll see that this repo uses scripts for linting, building, testing, and releasing. You'll also find the current recommended usage for eslint, until [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

### Overriding Config

`@iopipe/scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `@iopipe/scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`@iopipe/scripts` will use that instead of it's own internal config. In addition,
`@iopipe/scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/iopipe-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["./node_modules/@iopipe/scripts/babel"]}
```

Or, for `jest`:

```javascript
const { jest: jestConfig } = require('iopipe-scripts/config');
module.exports = Object.assign(jestConfig, {
  // your overrides here
});
```

> Note: `iopipe-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

## Thank You

Thanks to Kent C. Dodds and contributors for the base repository.
[https://github.com/kentcdodds/kcd-scripts](https://github.com/kentcdodds/kcd-scripts)
