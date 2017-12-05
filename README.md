<div align="center">
<h1>iopipe-scripts 🛠📦</h1>

<p>Scripts for IOpipe projects</p>
</div>

<hr />

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev iopipe-scripts
```

## Usage

This is a CLI and exposes a bin called `iopipe-scripts`. I don't really plan on
documenting or testing it super duper well because it's really specific to my
needs. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some
of the things you can do with `iopipe-scripts`.

### Overriding Config

Unlike `react-scripts`, `iopipe-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `iopipe-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`iopipe-scripts` will use that instead of it's own internal config. In addition,
`iopipe-scripts` exposes its configuration so you can use it and override only
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
{"presets": ["iopipe-scripts/babel"]}
```

Or, for `jest`:

```javascript
const {jest: jestConfig} = require('iopipe-scripts/config')
module.exports = Object.assign(jestConfig, {
  // your overrides here
})
```

> Note: `iopipe-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

## Thank You

Thanks to Kent C. Dodds and contributors for the base repository.
[https://github.com/kentcdodds/kcd-scripts](https://github.com/kentcdodds/kcd-scripts)
