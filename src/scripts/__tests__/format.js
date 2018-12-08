import cases from 'jest-in-case'
import {unquoteSerializer, winPathSerializer} from './helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)
expect.addSnapshotSerializer(winPathSerializer)

cases(
  'format',
  ({args}) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const originalExit = process.exit
    const originalArgv = process.argv
    const utils = require('../../utils')
    utils.resolveBin = (modName, {executable = modName} = {}) => executable
    process.exit = jest.fn()

    // tests
    process.argv = ['node', '../format', ...args]
    require('../format')
    expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)
    const [firstCall] = crossSpawnSyncMock.mock.calls
    const [script, calledArgs] = firstCall
    expect([script, ...calledArgs].join(' ')).toMatchSnapshot()

    // afterEach
    process.exit = originalExit
    process.argv = originalArgv
    jest.resetModules()
  },
  {
    'calls prettier CLI with args': {
      args: ['my-src/**/*.js'],
    },
    '--no-write prevents --write argument from being added': {
      args: ['--no-write'],
    },
    '--config arg can be used for a custom config': {
      args: ['--config', './my-config.js'],
    },
    '--ignore-path arg can be used for a custom ignore file': {
      args: ['--ignore-path', './.myignore'],
    },
  },
)
