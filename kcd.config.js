const path = require('path')

module.exports = {
  eslint: {
    extends: [path.join(__dirname, './.eslintrc')],
  },
  jest: {
    coverageThreshold: null,
  },
}
