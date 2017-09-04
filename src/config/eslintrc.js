const {ifAnyDep} = require('../utils')

module.exports = {
  extends: [
    'kentcdodds',
    ifAnyDep('jest', 'kentcdodds/jest'),
    ifAnyDep('webpack', 'kentcdodds/webpack'),
    ifAnyDep('react', 'kentcdodds/jsx-a11y'),
    ifAnyDep('react', 'kentcdodds/react'),
    'prettier',
    ifAnyDep('prettier', 'kentcdodds/prettier'),
  ].filter(Boolean),
  rules: Object.assign(
    {
      // stuff I haven't gotten around to updating in my config
      'no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^ignored'},
      ],
      'func-style': 'off',
      'no-process-exit': 'off',

      // prettier does this for us
    },
    ifAnyDep(
      'prettier',
      {
        'max-len': 'off',
        semi: 'off',
        quotes: 'off',
        'comma-dangle': 'off',
        'no-console': 'off',
        indent: 'off',
        'babel/object-curly-spacing': 'off',
      },
      {},
    ),
  ),
}
