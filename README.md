<div align="center">
<h1>cod-scripts 🛠📦</h1>

<p>CLI toolbox for common scripts for my projects</p>
</div>

---

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![GitHub Workflow Status][actions-badge]][actions-badge]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Semantic Release][semantic-release-badge]][semantic-release]
[![Commitizen friendly][commitizen-badge]][commitizen]
<!-- prettier-ignore-end -->

## Motivation

This helps me maintain personal & work projects without duplication. This is a
CLI that abstracts away all configuration for my open source projects for
linting, testing, building, and more.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Overriding Config](#overriding-config)
  - [TypeScript Support](#typescript-support)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```sh
npm install --save-dev cod-scripts
npm install --save @babel/runtime
```

## Usage

This is a CLI and exposes a bin called `cod-scripts`. I don't really plan on
documenting or testing it super duper well because it's really specific to my
needs. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some of
the things you can do with `cod-scripts`.

### Overriding Config

Unlike `react-scripts`, `cod-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `cod-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`cod-scripts` will use that instead of it's own internal config. In addition,
`cod-scripts` exposes its configuration so you can use it and override only the
parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/cod-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{ "presets": ["cod-scripts/babel"] }
```

Or, for `jest`:

```js
const { jest: jestConfig } = require('cod-scripts/config')

module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```

Or, for `lint-staged`:

```js
// lint-staged.config.js or .lintstagedrc.js
const { lintStaged } = require('cod-scripts/config')

module.exports = {
  ...lintStaged,
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
}
```

Or, for `commitlint`, a `commitlint.config.js` file or `commitlint` prop in
package.json:

```js
// commitlint.config.js or .commitlintrc.js
const { commitlint } = require('cod-scripts/config')

module.exports = {
  ...commitlint,
  rules: {
    // overrides here
  },
}
```

```json
// package.json
{
  "commitlint": {
    "extends": ["./node_modules/cod-scripts/commitlint"],
    "rules": {
      // your overrides here
      // https://commitlint.js.org/#/reference-rules
    }
  }
}
```

> Note: `cod-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

### TypeScript Support

If the `tsconfig.json`-file is present in the project root directory and
`typescript` is a dependency the `@babel/preset-typescript` will automatically
get loaded when you use the default babel config that comes with `cod-scripts`.
If you customised your `.babelrc`-file you might need to manually add
`@babel/preset-typescript` to the `presets`-section.

`cod-scripts` will automatically load any `.ts` and `.tsx` files, including the
default entry point, so you don't have to worry about any rollup configuration.

If you have a `typecheck` script (normally set to `kcd-scripts typecheck`) that
will be run as part of the `validate` script (which is run as part of the
`pre-commit` script as well).

TypeScript definition files will also automatically be generated during the
`build` script.

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[prs]: http://makeapullrequest.com
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[commitizen]: http://commitizen.github.io/cz-cli/
[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[npmcharts]: http://npmcharts.com/compare/cod-scripts
[version-badge]: https://img.shields.io/npm/v/cod-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/cod-scripts
[downloads-badge]: https://img.shields.io/npm/dm/cod-scripts.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/cod-scripts.svg?style=flat-square
[license]: https://github.com/codfish/cod-scripts/blob/master/LICENSE
[actions]: https://github.com/codfish/cod-scripts/actions
[actions-badge]: https://img.shields.io/github/workflow/status/codfish/cod-scripts/Release/master
<!-- prettier-ignore-end -->
