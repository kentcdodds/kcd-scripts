const {jest} = require('./src/config')

module.exports = {
  ...jest,
  coverageThreshold: null,
  testPathIgnorePatterns: [
    ...jest.testPathIgnorePatterns,
    './src/scripts/test.js',
  ],
}
