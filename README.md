<div align="center">
<h1>tradeshift-scripts 🛠📦</h1>

<p>CLI toolbox for common scripts for my projects</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][LICENSE]

[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

I do a bunch of open source and want to make it easier to maintain so many
projects.

## This solution

This is a CLI that abstracts away all configuration for my open source projects
for linting, testing, building, and more.

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev tradeshift-scripts
```

## Usage

This is a CLI and exposes a bin called `tradeshift-scripts`. I don't really plan on
documenting or testing it super duper well because it's really specific to my
needs. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some
of the things you can do with `tradeshift-scripts`.

### Overriding Config

Unlike `react-scripts`, `tradeshift-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `tradeshift-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`tradeshift-scripts` will use that instead of it's own internal config. In addition,
`tradeshift-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/tradeshift-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["tradeshift-scripts/babel"]}
```

Or, for `jest`:

```javascript
const {jest: jestConfig} = require('tradeshift-scripts/config')
module.exports = Object.assign(jestConfig, {
  // your overrides here
})
```

> Note: `tradeshift-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

## Inspiration

This is inspired by `react-scripts`.

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here! Again, this is a very specific-to-me solution.

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/wejendorp/tradeshift-scripts.svg?style=flat-square
[build]: https://travis-ci.org/wejendorp/tradeshift-scripts
[coverage-badge]: https://img.shields.io/codecov/c/github/wejendorp/tradeshift-scripts.svg?style=flat-square
[coverage]: https://codecov.io/github/wejendorp/tradeshift-scripts
[version-badge]: https://img.shields.io/npm/v/tradeshift-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/tradeshift-scripts
[downloads-badge]: https://img.shields.io/npm/dm/tradeshift-scripts.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/tradeshift-scripts
[license-badge]: https://img.shields.io/npm/l/tradeshift-scripts.svg?style=flat-square
[license]: https://github.com/wejendorp/tradeshift-scripts/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/wejendorp/tradeshift-scripts/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/wejendorp/tradeshift-scripts.svg?style=social
[github-watch]: https://github.com/wejendorp/tradeshift-scripts/watchers
[github-star-badge]: https://img.shields.io/github/stars/wejendorp/tradeshift-scripts.svg?style=social
[github-star]: https://github.com/wejendorp/tradeshift-scripts/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20tradeshift-scripts!%20https://github.com/wejendorp/tradeshift-scripts%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/wejendorp/tradeshift-scripts.svg?style=social
