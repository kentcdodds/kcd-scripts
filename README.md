<div align="center">
<h1>kcd-scripts 🛠📦</h1>

<p>CLI toolbox for common scripts for my projects</p>
</div>

---

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-19-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

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
  - [Overriding Config](#overriding-config)
  - [Flow support](#flow-support)
  - [TypeScript Support](#typescript-support)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [Contributors ✨](#contributors-)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev kcd-scripts
```

## Usage

This is a CLI and exposes a bin called `kcd-scripts`. I don't really plan on
documenting or testing it super duper well because it's really specific to my
needs. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some of
the things you can do with `kcd-scripts`.

### Overriding Config

Unlike `react-scripts`, `kcd-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `kcd-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`kcd-scripts` will use that instead of it's own internal config. In addition,
`kcd-scripts` exposes its configuration so you can use it and override only the
parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/kcd-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["kcd-scripts/babel"]}
```

Or, for `jest`:

```javascript
const {jest: jestConfig} = require('kcd-scripts/config')
module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```

> Note: `kcd-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

### Flow support

If the `flow-bin` is a dependency on the project the `@babel/preset-flow` will
automatically get loaded when you use the default babel config that comes with
`kcd-scripts`. If you customised your `.babelrc`-file you might need to manually
add `@babel/preset-flow` to the `presets`-section.

### TypeScript Support

If the `tsconfig.json`-file is present in the project root directory and 
`typescript` is a dependency the `@babel/preset-typescript` will automatically
get loaded when you use the default babel config that comes with `kcd-scripts`.
If you customised your `.babelrc`-file you might need to manually add
`@babel/preset-typescript` to the `presets`-section.

`kcd-scripts` will automatically load any `.ts` and `.tsx` files, including the
default entry point, so you don't have to worry about any rollup configuration.

`tsc --noemit` will run during lint-staged to verify that files will compile.

## Inspiration

This is inspired by `react-scripts`.

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here! Again, this is a very specific-to-me solution.

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## Contributors ✨

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/sudo-suhas"><img src="https://avatars2.githubusercontent.com/u/22251956?v=4" width="100px;" alt=""/><br /><sub><b>Suhas Karanth</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=sudo-suhas" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/issues?q=author%3Asudo-suhas" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=sudo-suhas" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/pbomb"><img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;" alt=""/><br /><sub><b>Matt Parrish</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=pbomb" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=pbomb" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/mateuscb"><img src="https://avatars3.githubusercontent.com/u/1319157?v=4" width="100px;" alt=""/><br /><sub><b>Mateus</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=mateuscb" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=mateuscb" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://macklin.underdown.me"><img src="https://avatars1.githubusercontent.com/u/2344137?v=4" width="100px;" alt=""/><br /><sub><b>Macklin Underdown</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=macklinu" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=macklinu" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/stereobooster"><img src="https://avatars2.githubusercontent.com/u/179534?v=4" width="100px;" alt=""/><br /><sub><b>stereobooster</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=stereobooster" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=stereobooster" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://dsds.io"><img src="https://avatars0.githubusercontent.com/u/410792?v=4" width="100px;" alt=""/><br /><sub><b>Dony Sukardi</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/issues?q=author%3Adonysukardi" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=donysukardi" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://alexandernanberg.com"><img src="https://avatars3.githubusercontent.com/u/8997319?v=4" width="100px;" alt=""/><br /><sub><b>Alexander Nanberg</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=alexandernanberg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fobbyal"><img src="https://avatars2.githubusercontent.com/u/7818365?v=4" width="100px;" alt=""/><br /><sub><b>Alex Liang</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=fobbyal" title="Code">💻</a></td>
    <td align="center"><a href="http://www.jeffdetmer.com"><img src="https://avatars1.githubusercontent.com/u/649578?v=4" width="100px;" alt=""/><br /><sub><b>Jeff Detmer</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=shellthor" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/endymion_r"><img src="https://avatars3.githubusercontent.com/u/93752?v=4" width="100px;" alt=""/><br /><sub><b>Alex Zherdev</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=alexzherdev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/adamdharrington"><img src="https://avatars0.githubusercontent.com/u/5477801?v=4" width="100px;" alt=""/><br /><sub><b>Adam Harrington</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=adamdharrington" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=adamdharrington" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://afontcu.dev"><img src="https://avatars0.githubusercontent.com/u/9197791?v=4" width="100px;" alt=""/><br /><sub><b>Adrià Fontcuberta</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=afontcu" title="Code">💻</a></td>
    <td align="center"><a href="https://codefund.io"><img src="https://avatars2.githubusercontent.com/u/12481?v=4" width="100px;" alt=""/><br /><sub><b>Eric Berry</b></sub></a><br /><a href="#fundingFinding-coderberry" title="Funding Finding">🔍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/schaab"><img src="https://avatars0.githubusercontent.com/u/1103255?v=4" width="100px;" alt=""/><br /><sub><b>Jared Schaab</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=schaab" title="Code">💻</a> <a href="https://github.com/kentcdodds/kcd-scripts/commits?author=schaab" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/serkan-sipahi-59b20081/"><img src="https://avatars2.githubusercontent.com/u/1880749?v=4" width="100px;" alt=""/><br /><sub><b>Bitcollage</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=SerkanSipahi" title="Code">💻</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=MichaelDeBoey" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/weyert"><img src="https://avatars3.githubusercontent.com/u/7049?v=4" width="100px;" alt=""/><br /><sub><b>Weyert de Boer</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=weyert" title="Code">💻</a></td>
    <td align="center"><a href="https://kubajastrz.com"><img src="https://avatars0.githubusercontent.com/u/6443113?v=4" width="100px;" alt=""/><br /><sub><b>Jakub Jastrzębski</b></sub></a><br /><a href="https://github.com/kentcdodds/kcd-scripts/commits?author=KubaJastrz" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/com/kentcdodds/kcd-scripts.svg?style=flat-square
[build]: https://travis-ci.com/kentcdodds/kcd-scripts
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/kcd-scripts.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/kcd-scripts
[version-badge]: https://img.shields.io/npm/v/kcd-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/kcd-scripts
[downloads-badge]: https://img.shields.io/npm/dm/kcd-scripts.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/kcd-scripts
[license-badge]: https://img.shields.io/npm/l/kcd-scripts.svg?style=flat-square
[license]: https://github.com/kentcdodds/kcd-scripts/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/kcd-scripts/blob/master/other/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[bugs]: https://github.com/kentcdodds/kcd-scripts/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/kentcdodds/kcd-scripts/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/kentcdodds/kcd-scripts/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->
