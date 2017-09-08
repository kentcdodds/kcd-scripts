const {ifAnyDep, parseEnv} = require('../utils')

const isPreact = parseEnv('BUILD_PREACT', false)
const isRollup = parseEnv('BUILD_ROLLUP', false)
const isWebpack = parseEnv('BUILD_WEBPACK', false)
const treeshake = parseEnv('BUILD_TREESHAKE', isRollup || isWebpack)

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
    ifAnyDep(['react', 'preact'], require.resolve('babel-preset-react')),
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
    isRollup || isWebpack
      ? require.resolve('babel-plugin-transform-inline-environment-variables')
      : null,
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
  ].filter(Boolean),
}
