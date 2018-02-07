const {ifAnyDep, parseEnv} = require('../utils')

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test'
const isPreact = parseEnv('BUILD_PREACT', false)
const isRollup = parseEnv('BUILD_ROLLUP', false)
const isUMD = process.env.BUILD_FORMAT === 'umd'
const isWebpack = parseEnv('BUILD_WEBPACK', false)
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack)
const alias = parseEnv('BUILD_ALIAS', isPreact ? {react: 'preact'} : null)

const envTargets = isTest
  ? {node: 'current'}
  : isWebpack || isRollup ? {browsers: ['ie 10', 'ios 7']} : {node: '4.5'}
const envOptions = {modules: false, loose: true, targets: envTargets}

module.exports = {
  presets: [
    [require.resolve('babel-preset-env'), envOptions],
    ifAnyDep(['react', 'preact'], require.resolve('babel-preset-react')),
  ].filter(Boolean),
  plugins: [
    require.resolve('babel-macros'),
    isRollup ? require.resolve('babel-plugin-external-helpers') : null,
    // we're actually not using JSX at all, but I'm leaving this
    // in here just in case we ever do (this would be easy to miss).
    alias
      ? [
          require.resolve('babel-plugin-module-resolver'),
          {root: ['./src'], alias},
        ]
      : null,
    isPreact
      ? [require.resolve('babel-plugin-transform-react-jsx'), {pragma: 'h'}]
      : null,
    isPreact
      ? [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          {removeImport: true},
        ]
      : null,
    isUMD
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    // TODO: use loose mode when upgrading to babel@7
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-minify-dead-code-elimination'),
    treeshake
      ? null
      : require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
  ].filter(Boolean),
}
