import cases from 'jest-in-case'
import {unquoteSerializer, winPathSerializer} from './helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)
expect.addSnapshotSerializer(winPathSerializer)

cases(
  'precommit',
  ({
    args = [],
    utils = require('../../utils'),
    hasPkgProp = () => false,
    hasFile = () => false,
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const originalArgv = process.argv
    const originalExit = process.exit
    Object.assign(utils, {
      hasPkgProp,
      hasFile,
      resolveBin: (modName, {executable = modName} = {}) => executable,
    })
    process.exit = jest.fn()

    process.argv = ['node', '../precommit', ...args]
    crossSpawnSyncMock.mockClear()

    try {
      // tests
      require('../precommit')
      expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)
      const [firstCall] = crossSpawnSyncMock.mock.calls
      const [script, calledArgs] = firstCall
      expect([script, ...calledArgs].join(' ')).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      // afterEach
      process.exit = originalExit
      process.argv = originalArgv
      jest.resetModules()
    }
  },
  {
    'calls lint-staged CLI with default args': {},
    'does not use built-in config with --config': {
      args: ['--config', './custom-config.js'],
    },
    'does not use built-in config with .lintstagedrc file': {
      hasFile: filename => filename === '.lintstagedrc',
    },
    'does not use built-in config with lint-staged.config.js file': {
      hasFile: filename => filename === 'lint-staged.config.js',
    },
    'does not use built-in config with lint-staged pkg prop': {
      hasPkgProp: prop => prop === 'lint-staged',
    },
    'forwards args': {
      args: ['--verbose'],
    },
  },
)
