<div align="center">
<h1>kcd-scripts 🛠📦</h1>

<p>CLI toolbox for common scripts for my projects</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors)
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
  - [Overriding Config](#overriding-config)
- [Inspiration](#inspiration)
- [Other Solutions](#other-solutions)
- [Contributors](#contributors)
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
find scripts with `node src {scriptName}`. This serves as an example of some
of the things you can do with `kcd-scripts`.

### Overriding Config

Unlike `react-scripts`, `kcd-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `kcd-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`kcd-scripts` will use that instead of it's own internal config. In addition,
`kcd-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

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

## Inspiration

This is inspired by `react-scripts`.

## Other Solutions

I'm not aware of any, if you are please [make a pull request][prs] and add it
here! Again, this is a very specific-to-me solution.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds "Code") [📖](https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=kentcdodds "Tests") | [<img src="https://avatars2.githubusercontent.com/u/22251956?v=4" width="100px;"/><br /><sub><b>Suhas Karanth</b></sub>](https://github.com/sudo-suhas)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=sudo-suhas "Code") [🐛](https://github.com/kentcdodds/kcd-scripts/issues?q=author%3Asudo-suhas "Bug reports") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=sudo-suhas "Tests") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=pbomb "Code") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=pbomb "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1319157?v=4" width="100px;"/><br /><sub><b>Mateus</b></sub>](https://github.com/mateuscb)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=mateuscb "Code") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=mateuscb "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2344137?v=4" width="100px;"/><br /><sub><b>Macklin Underdown</b></sub>](http://macklin.underdown.me)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=macklinu "Code") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=macklinu "Tests") | [<img src="https://avatars2.githubusercontent.com/u/179534?v=4" width="100px;"/><br /><sub><b>stereobooster</b></sub>](https://github.com/stereobooster)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=stereobooster "Code") [⚠️](https://github.com/kentcdodds/kcd-scripts/commits?author=stereobooster "Tests") | [<img src="https://avatars0.githubusercontent.com/u/410792?v=4" width="100px;"/><br /><sub><b>Dony Sukardi</b></sub>](http://dsds.io)<br />[🐛](https://github.com/kentcdodds/kcd-scripts/issues?q=author%3Adonysukardi "Bug reports") [💻](https://github.com/kentcdodds/kcd-scripts/commits?author=donysukardi "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/8997319?v=4" width="100px;"/><br /><sub><b>Alexander Nanberg</b></sub>](https://alexandernanberg.com)<br />[💻](https://github.com/kentcdodds/kcd-scripts/commits?author=alexandernanberg "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/kcd-scripts.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/kcd-scripts
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/kcd-scripts.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/kcd-scripts
[version-badge]: https://img.shields.io/npm/v/kcd-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/kcd-scripts
[downloads-badge]: https://img.shields.io/npm/dm/kcd-scripts.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/kcd-scripts
[license-badge]: https://img.shields.io/npm/l/kcd-scripts.svg?style=flat-square
[license]: https://github.com/kentcdodds/kcd-scripts/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/kcd-scripts/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/kcd-scripts.svg?style=social
[github-watch]: https://github.com/kentcdodds/kcd-scripts/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/kcd-scripts.svg?style=social
[github-star]: https://github.com/kentcdodds/kcd-scripts/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20kcd-scripts!%20https://github.com/kentcdodds/kcd-scripts%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/kcd-scripts.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
