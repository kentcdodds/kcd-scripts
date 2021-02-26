import cases from 'jest-in-case'
import {unquoteSerializer} from './helpers/serializers'

jest.mock('jest', () => ({run: jest.fn()}))
jest.mock('../../config/jest.config', () => ({builtInConfig: true}))
let mockIsCI = false
jest.mock('is-ci', () => mockIsCI)

expect.addSnapshotSerializer(unquoteSerializer)

cases(
  'test',
  ({
    args = [],
    utils = require('../../utils'),
    pkgHasJestProp = false,
    hasJestConfigFile = false,
    setup = () => () => {},
    ci = false,
    preCommit = 'false',
  }) => {
    // beforeEach
    // eslint-disable-next-line jest/no-jest-import
    const {run: jestRunMock} = require('jest')
    const originalArgv = process.argv
    const prevCI = mockIsCI
    const prevPreCommit = process.env['SCRIPTS_PRE-COMMIT']
    mockIsCI = ci
    process.env['SCRIPTS_PRE-COMMIT'] = preCommit
    Object.assign(utils, {
      hasPkgProp: () => pkgHasJestProp,
      hasFile: () => hasJestConfigFile,
    })
    process.exit = jest.fn()
    const teardown = setup()

    process.argv = ['node', '../test', ...args]

    try {
      // tests
      require('../test')
      expect(jestRunMock).toHaveBeenCalledTimes(1)
      const [firstCall] = jestRunMock.mock.calls
      const [jestArgs] = firstCall
      expect(jestArgs.join(' ')).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      teardown()
      // afterEach
      process.argv = originalArgv
      mockIsCI = prevCI
      process.env['SCRIPTS_PRE-COMMIT'] = prevPreCommit
      jest.resetModules()
    }
  },
  {
    'calls jest.run with default args': {},
    'does not watch on CI': {
      ci: true,
    },
    'does not watch on SCRIPTS_PRE-COMMIT': {
      preCommit: 'true',
    },
    'does not watch with --no-watch': {
      args: ['--no-watch'],
    },
    'does not watch with --coverage': {
      args: ['--coverage'],
    },
    'does not watch --updateSnapshot': {
      args: ['--updateSnapshot'],
    },
    'uses custom config with --config': {
      args: ['--config', './my-config.js'],
    },
    'uses custom config with jest prop in pkg': {
      pkgHasJestProp: true,
    },
    'uses custom config with jest.config.js file': {
      hasJestConfigFile: true,
    },
    'forwards args': {
      args: ['--coverage', '--watch'],
    },
  },
)
