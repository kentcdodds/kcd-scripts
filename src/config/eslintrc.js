const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    'eslint-config-kentcdodds',
    'eslint-config-kentcdodds/jest',
    ifAnyDep('react', 'eslint-config-kentcdodds/jsx-a11y'),
    ifAnyDep('react', 'eslint-config-kentcdodds/react'),
  ].filter(Boolean),
  rules: {},
}
