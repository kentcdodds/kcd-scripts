const { ifAnyDep } = require('../utils');

module.exports = {
  extends: [
    require.resolve('@iopipe/eslint-config-iopipe'),
    require.resolve('@iopipe/eslint-config-iopipe/jest'),
    // jsx-a11y relies on the npm package array-includes
    // which has a weird peer dependency setup that was causing install issues
    // ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
    ifAnyDep('react', require.resolve('@iopipe/eslint-config-iopipe/react'))
  ].filter(Boolean),
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'prettier/prettier': [
      2,
      {
        singleQuote: true
      }
    ],
    // this is too real for some of our projects right now
    complexity: 0,
    // add our own regex
    'no-unused-vars': [
      2,
      {
        vars: 'local',
        args: 'after-used',
        varsIgnorePattern: '^(_|logger)'
      }
    ]
  }
};
