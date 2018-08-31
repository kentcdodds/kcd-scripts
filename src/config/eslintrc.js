const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    // require.resolve('eslint-config-itp-base'), // not using because not yet updated to eslint5
    require.resolve('eslint-config-airbnb'),
    ifAnyDep('jest', 'plugin:jest/recommended'),
    ifAnyDep('flow-bin', 'plugin:flowtype/recommended'),
    ifAnyDep('react-native', 'plugin:react-native/all'),
    require.resolve('eslint-config-prettier'),
    ifAnyDep('flow-bin', 'eslint-config-prettier/flowtype'),
    require.resolve('eslint-config-prettier/react'),
  ].filter(Boolean),
  parser: ifAnyDep(
    ['babel-cli', 'babel-core', 'babel-eslint', 'babel-loader'],
    'babel-eslint',
  ),
  rules: {
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
      },
    ],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
  },
  globals: {
    fetch: false,
    alert: false,
    __DEV__: true,
  },
}
