const {jest} = require('./src/config')

module.exports = {
  ...jest,
  coverageThreshold: null,
  snapshotSerializers: [
    ...jest.snapshotSerializers,
    'jest-snapshot-serializer-raw/always',
  ],
}
