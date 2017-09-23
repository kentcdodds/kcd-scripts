import cases from 'jest-in-case'

// this removes the quotes around strings...
expect.addSnapshotSerializer({
  print: val => val,
  test: val => typeof val === 'string',
})

cases(
  'travis-after-success',
  ({version = '0.0.0-semantically-released', hasCoverageDir = true}) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const utilsMock = require('../../utils')
    const originalExit = process.exit
    process.exit = jest.fn()

    // tests
    crossSpawnSyncMock.mockClear()
    if (version) {
      utilsMock.pkg.version = version
    }
    if (!hasCoverageDir) {
      utilsMock.hasFile = () => false
    }
    require('../travis-after-success')
    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)
    const [firstCall] = crossSpawnSyncMock.mock.calls
    const [script, calledArgs] = firstCall
    expect(`${[script, ...calledArgs].join(' ')}`).toMatchSnapshot()

    // afterEach
    process.exit = originalExit
    jest.resetModules()
  },
  {
    'calls concurrently with both scripts': {},
    'does not do the autorelease script when the version is different': {
      version: '1.2.3',
    },
    'does not do the codecov script when there is no coverage directory': {
      hasCoverageDir: false,
    },
  },
)
