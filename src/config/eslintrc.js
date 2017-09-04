const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    'kentcdodds',
    'kentcdodds/jest',
    ifAnyDep('react', 'kentcdodds/jsx-a11y'),
    ifAnyDep('react', 'kentcdodds/react'),
    'kentcdodds/prettier',
    'prettier',
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
