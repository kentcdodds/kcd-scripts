const {applyOverrides, ifDevDep} = require('../utils')

const config = applyOverrides({
  type: 'eslint',
  config: {
    extends: [
      'kentcdodds',
      ifDevDep('jest', 'kentcdodds/jest'),
      ifDevDep('webpack', 'kentcdodds/webpack'),
      ifDevDep('react', 'kentcdodds/jsx-a11y'),
      ifDevDep('react', 'kentcdodds/react'),
      ifDevDep('prettier', 'kentcdodds/prettier'),
    ].filter(Boolean),
    rules: {
      // stuff I haven't gotten around to updating in my config
      'no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^ignored'},
      ],
      'func-style': 'off',
      'no-process-exit': 'off',

      // prettier does this for us
      ...ifDevDep(
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
        {}
      ),
    },
  },
})

module.exports = config
