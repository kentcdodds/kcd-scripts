const {ifAnyDep} = require('../utils')

const isTest = process.env.NODE_ENV === 'test'
const isPreact = process.env.LIBRARY === 'preact'
const isRollup = JSON.parse(process.env.ROLLUP_BUILD || 'false')
const isWebpack = JSON.parse(process.env.WEBPACK_BUILD || 'false')
const treeshake = isRollup || isWebpack

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      treeshake
        ? {modules: false}
        : {
            targets: {
              node: '4.5',
            },
          },
    ],
    ifAnyDep('react', require.resolve('babel-preset-react')),
  ].filter(Boolean),
  plugins: [
    isRollup ? require.resolve('babel-plugin-external-helpers') : null,
    // we're actually not using JSX at all, but I'm leaving this
    // in here just in case we ever do (this would be easy to miss).
    isPreact
      ? [require.resolve('babel-plugin-transform-react-jsx'), {pragma: 'h'}]
      : null,
    isPreact
      ? [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          {removeImport: true},
        ]
      : null,
    isTest || isRollup
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
  ].filter(Boolean),
}
