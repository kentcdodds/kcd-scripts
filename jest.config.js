const {jest: jestConfig} = require('./src/config')

module.exports = Object.assign(jestConfig, {
  coverageThreshold: null,
})
