const {jest: jestConfig} = require('./src/config')

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null,
  coveragePathIgnorePatterns: jestConfig.coveragePathIgnorePatterns.concat(
    '/scripts/',
  ),
})
