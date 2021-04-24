const path = require('path')
const prettierConfig = require('./prettierrc')
const {hasLocalConfig} = require('../utils')

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')

const useBuiltinPrettierConfig = !hasLocalConfig('prettier')
const useBuiltinBabelConfig = !hasLocalConfig('babel')

module.exports = {
  extends: [require.resolve('eslint-config-codfish')].filter(Boolean),
  parserOptions: {
    babelOptions: useBuiltinBabelConfig
      ? {configFile: hereRelative('./babelrc.js')}
      : {},
  },
  rules: {
    // Explicitly set prettier rules to use our built in config if no
    // local prettier config is found.
    'prettier/prettier': useBuiltinPrettierConfig
      ? ['error', prettierConfig]
      : 'error',
  },
}
