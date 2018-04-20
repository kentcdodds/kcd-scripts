const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    require.resolve('eslint-config-kentcdodds'),
    require.resolve('eslint-config-kentcdodds/jest'),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react')),
    'plugin:prettier/recommended',
  ].filter(Boolean),
  rules: {},
}
