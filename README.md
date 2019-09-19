<div align="center">
<h1>cod-scripts 🛠📦</h1>

<p>CLI toolbox for common scripts for my projects</p>
</div>

<hr />

[![Build Status][build-badge]][build] [![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package] [![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][license]

[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star] [![Tweet][twitter-badge]][twitter]

## The problem

I do a bunch of open source and want to make it easier to maintain so many projects.

## This solution

This is a CLI that abstracts away all configuration for my open source projects for linting,
testing, building, and more.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Overriding Config](#overriding-config)
  - [Flow support](#flow-support)
- [Inspiration](#inspiration)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should be installed
as one of your project's `devDependencies`:

```
npm install --save-dev cod-scripts
```

## Usage

This is a CLI and exposes a bin called `cod-scripts`. I don't really plan on documenting or testing
it super duper well because it's really specific to my needs. You'll find all available scripts in
`src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll find scripts with
`node src {scriptName}`. This serves as an example of some of the things you can do with
`cod-scripts`.

### Overriding Config

Unlike `react-scripts`, `cod-scripts` allows you to specify your own configuration for things and
have that plug directly into the way things work with `cod-scripts`. There are various ways that it
works, but basically if you want to have your own config for something, just add the configuration
and `cod-scripts` will use that instead of it's own internal config. In addition, `cod-scripts`
exposes its configuration so you can use it and override only the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like ESLint which require
project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the contents of:

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
const { jest: jestConfig } = require('cod-scripts/config');

module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
});
```

Or, for `commitlint`, a `commitlint.config.js` file or `commitlint` prop in package.json:

```js
// commitlint.config.js or .commitlintrc.js
const { commitlint: commitlintConfig } = require('cod-scripts/commitlint');

module.exports = {
  ...commitlintConfig,
  rules: {
    // overrides here
  },
};
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

> Note: `cod-scripts` intentionally does not merge things for you when you start configuring things
> to make it less magical and more straightforward. Extending can take place on your terms. I think
> this is actually a great way to do this.

### Flow support

If the `flow-bin` is a dependency on the project the `@babel/preset-flow` will automatically get
loaded when you use the default babel config that comes with `cod-scripts`. If you customised your
`.babelrc`-file you might need to manually add `@babel/preset-flow` to the `presets`-section.

## Inspiration

This is inspired by `react-scripts`.

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/codfish/cod-scripts.svg?style=flat-square
[build]: https://travis-ci.org/codfish/cod-scripts
[coverage-badge]: https://img.shields.io/codecov/c/github/codfish/cod-scripts.svg?style=flat-square
[coverage]: https://codecov.io/github/codfish/cod-scripts
[version-badge]: https://img.shields.io/npm/v/cod-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/cod-scripts
[downloads-badge]: https://img.shields.io/npm/dm/cod-scripts.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/cod-scripts
[license-badge]: https://img.shields.io/npm/l/cod-scripts.svg?style=flat-square
[license]: https://github.com/codfish/cod-scripts/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/codfish/cod-scripts/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/codfish/cod-scripts.svg?style=social
[github-watch]: https://github.com/codfish/cod-scripts/watchers
[github-star-badge]: https://img.shields.io/github/stars/codfish/cod-scripts.svg?style=social
[github-star]: https://github.com/codfish/cod-scripts/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20cod-scripts!%20https://github.com/codfish/cod-scripts%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/codfish/cod-scripts.svg?style=social
