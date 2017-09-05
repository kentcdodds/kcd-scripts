const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    require.resolve('eslint-config-kentcdodds'),
    require.resolve('eslint-config-kentcdodds/jest'),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react')),
    require.resolve('eslint-config-kentcdodds/prettier'),
    require.resolve('eslint-config-prettier'),
  ].filter(Boolean),
  rules: {
    // stuff I haven't gotten around to updating in my config
    'no-unused-vars': [
      'error',
      {argsIgnorePattern: '^_', varsIgnorePattern: '^ignored'},
    ],
    'func-style': 'off',
    'no-process-exit': 'off',
    'comma-dangle': 'off',
  },
}
