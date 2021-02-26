const prettierConfig = require('./src/config/prettierrc')

module.exports = Object.assign({}, prettierConfig, {
  // to prevent additional conflicts with update kcd-scripts, making
  // backmerging a little easier.
  printWidth: 80,
  semi: false,
  bracketSpacing: false,
})
