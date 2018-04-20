<div align="center">
<h1>uptrend-scripts</h1>

<p>CLI toolbox for common scripts for uptrend projects</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmcharts]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

Creating new uptrend npm libraries requires a lot of boilerplate
configuration, and is prone to errors. Configurations will often diverge or
never be updated.

## This solution

This is a CLI that abstracts away all configuration for my open source projects
for linting, testing, building, and more.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Installation](#installation)
* [Usage](#usage)
  * [Overriding Config](#overriding-config)
* [Inspiration](#inspiration)
* [Other Solutions](#other-solutions)
* [Contributors](#contributors)
* [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev uptrend-scripts
```

## Usage

This is a CLI and exposes a bin called `uptrend-scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some
of the things you can do with `uptrend-scripts`.

To use the `after-success` hooks and automatic [semantic release][semantic-release],
you need to set up your build env with `GH_TOKEN` and `NPM_TOKEN`.

If you want to automatically publish coverage reports to [codecov][codecov], add
a `CODECOV_TOKEN`.

<details>
<summary>Example `package.json`</summary>

```json
{
  "name": "amazing-library",
  "version": "0.0.0-semantically-released",
  "main": "dist/index.js",
  "files": ["dist"],
  "scripts": {
    "test": "uptrend-scripts test",
    "test:update": "uptrend-scripts test --updateSnapshot",
    "build": "uptrend-scripts build",
    "lint": "uptrend-scripts lint",
    "format": "uptrend-scripts format",
    "validate": "uptrend-scripts validate",
    "precommit": "uptrend-scripts precommit",
    "after-success": "uptrend-scripts travis-after-success"
  },
  "devDependencies": {
    "uptrend-scripts": "1.0.0"
  }
}
```

</details>

<details>
<summary>Example `.travis.yml`</summary>

```yaml
sudo: false
language: node_js
cache:
  directories:
    - node_modules
notifications:
  email: false
node_js:
  - '8'
script: npm run validate
after_success:
  - npm run after-success
branches:
  only:
    - master
```

</details>

### Overriding Config

Unlike `react-scripts`, `uptrend-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `uptrend-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`uptrend-scripts` will use that instead of it's own internal config. In addition,
`uptrend-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/uptrend-scripts/eslint.js"}
```

> Note: for now, you'll have to include an `.eslintignore` in your project until
> [this eslint issue is resolved](https://github.com/eslint/eslint/issues/9227).

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["uptrend-scripts/babel"]}
```

Or, for `jest`:

```javascript
const {jest: jestConfig} = require('uptrend-scripts/config')
module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```

> Note: `uptrend-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. I think this is actually a great way to do this.

## Inspiration

This is inspired by `react-scripts`.

## Other Solutions

`uptrend-scripts` is a fork of [kcd-scripts][kcd-scripts], adapted to Uptrend.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/126236?v=4" width="100px;"/><br /><sub><b>Brandon Orther</b></sub>](http://uptrend.tech)<br />[💻](https://github.com/uptrend-tech/uptrend-scripts/commits?author=orther "Code") [🚇](#infra-orther "Infrastructure (Hosting, Build-Tools, etc)") [📦](#platform-orther "Packaging/porting to new platform") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/uptrend-tech/uptrend-scripts.svg?style=flat-square
[build]: https://travis-ci.org/uptrend-tech/uptrend-scripts
[coverage-badge]: https://img.shields.io/codecov/c/github/uptrend-tech/uptrend-scripts.svg?style=flat-square
[coverage]: https://codecov.io/github/uptrend-tech/uptrend-scripts
[version-badge]: https://img.shields.io/npm/v/uptrend-scripts.svg?style=flat-square
[package]: https://www.npmjs.com/package/uptrend-scripts
[downloads-badge]: https://img.shields.io/npm/dm/uptrend-scripts.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/uptrend-scripts
[license-badge]: https://img.shields.io/npm/l/uptrend-scripts.svg?style=flat-square
[license]: https://github.com/uptrend-tech/uptrend-scripts/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/uptrend-tech/uptrend-scripts/blob/master/other/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/uptrend-tech/uptrend-scripts.svg?style=social
[github-watch]: https://github.com/uptrend-tech/uptrend-scripts/watchers
[github-star-badge]: https://img.shields.io/github/stars/uptrend-tech/uptrend-scripts.svg?style=social
[github-star]: https://github.com/uptrend-tech/uptrend-scripts/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20uptrend-scripts!%20https://github.com/uptrend-tech/uptrend-scripts%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/uptrend-tech/uptrend-scripts.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[kcd-scripts]: https://github.com/kentcdodds/kcd-scripts
[semantic-release]: https://github.com/semantic-release/semantic-release
[codecov]: https://codecov.io
