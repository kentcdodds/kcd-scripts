import path from 'path'
import cases from 'jest-in-case'

// this removes the quotes around strings...
const projectRoot = path.join(__dirname, '../../').replace(/\\/g, '/')

expect.addSnapshotSerializer({
  print(val) {
    return val.split(projectRoot).join('<PROJECT_ROOT>/')
  },
  test(val) {
    return typeof val === 'string'
  },
})

cases(
  'format',
  ({
    snapshotLog = false,
    throws = false,
    setup = () => () => {},
    signal = false,
    args = [],
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const originalExit = process.exit
    const originalArgv = process.argv
    const originalLog = console.log
    process.exit = jest.fn()
    console.log = jest.fn()
    const teardown = setup()

    try {
      // tests
      process.argv = ['node', '../', ...args]
      crossSpawnSyncMock.mockClear()
      if (signal) {
        crossSpawnSyncMock.mockReturnValueOnce({result: 1, signal})
      }
      require('../')
      if (snapshotLog) {
        expect(console.log.mock.calls).toMatchSnapshot()
      } else if (signal) {
        expect(process.exit).toHaveBeenCalledTimes(1)
        expect(process.exit).toHaveBeenCalledWith(1)
        expect(console.log.mock.calls).toMatchSnapshot()
      } else {
        expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)
        const [firstCall] = crossSpawnSyncMock.mock.calls
        const [script, calledArgs] = firstCall
        expect([script, ...calledArgs].join(' ')).toMatchSnapshot()
      }
    } catch (error) {
      if (throws) {
        expect(error.message).toMatchSnapshot()
      } else {
        throw error
      }
    } finally {
      teardown()
      // afterEach
      process.exit = originalExit
      process.argv = originalArgv
      console.log = originalLog
      jest.resetModules()
    }
  },
  {
    'calls node with the script path and args': {
      args: ['test', '--no-watch'],
    },
    'throws unknown script': {
      args: ['unknown-script'],
      throws: true,
    },
    'logs help with no args': {
      snapshotLog: true,
    },
    'logs for SIGKILL signal': {
      args: ['lint'],
      signal: 'SIGKILL',
    },
    'logs for SIGTERM signal': {
      args: ['build'],
      signal: 'SIGTERM',
    },
    'does not log for other signals': {
      args: ['test'],
      signal: 'SIGBREAK',
    },
  },
)

/* eslint complexity:0 */
