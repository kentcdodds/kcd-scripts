const {ifAnyDep} = require('../utils')

const isTest = process.env.NODE_ENV === 'test'
const isPreact = process.env.LIBRARY === 'preact'
const isRollup = JSON.parse(process.env.ROLLUP_BUILD || 'false')
const isWebpack = JSON.parse(process.env.WEBPACK_BUILD || 'false')
const treeshake = isRollup || isWebpack

module.exports = {
  presets: [
    [
      'env',
      treeshake
        ? {modules: false}
        : {
            targets: {
              node: '4.5',
            },
          },
    ],
    ifAnyDep('react'),
  ].filter(Boolean),
  plugins: [
    isRollup ? 'external-helpers' : null,
    // we're actually not using JSX at all, but I'm leaving this
    // in here just in case we ever do (this would be easy to miss).
    isPreact ? ['transform-react-jsx', {pragma: 'h'}] : null,
    isPreact
      ? ['transform-react-remove-prop-types', {removeImport: true}]
      : null,
    isTest || isRollup ? 'transform-inline-environment-variables' : null,
    'transform-class-properties',
    'transform-object-rest-spread',
  ].filter(Boolean),
}
