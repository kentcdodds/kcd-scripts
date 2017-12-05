const { ifAnyDep } = require('../utils');

module.exports = {
  extends: [
    require.resolve('eslint-config-kentcdodds'),
    require.resolve('eslint-config-kentcdodds/jest'),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
    ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react'))
  ].filter(Boolean),
  rules: {
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
