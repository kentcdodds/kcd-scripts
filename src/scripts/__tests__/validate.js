import cases from 'jest-in-case'

cases(
  'validate',
  ({setup = () => () => {}}) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const originalExit = process.exit
    process.exit = jest.fn()
    process.env.SCRIPTS_PRE_COMMIT = 'false'
    const teardown = setup()

    try {
      // tests
      require('../validate')
      const [firstCall] = crossSpawnSyncMock.mock.calls
      const [script, calledArgs] = firstCall || ['', []]
      expect([script, ...calledArgs].join(' ')).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      teardown()
    }

    // afterEach
    process.exit = originalExit
    jest.resetModules()
  },
  {
    'calls concurrently with all scripts': {
      setup: withDefaultSetup(setupWithScripts()),
    },
    [`does not include "lint" if it doesn't have that script`]: {
      setup: withDefaultSetup(setupWithScripts(['test', 'build', 'typecheck'])),
    },
    [`does not include "test" if it doesn't have that script`]: {
      setup: withDefaultSetup(setupWithScripts(['lint', 'build', 'typecheck'])),
    },
    [`does not include "build" if it doesn't have that script`]: {
      setup: withDefaultSetup(setupWithScripts(['test', 'lint', 'typecheck'])),
    },
    [`does not include "typecheck" if it doesn't have that script`]: {
      setup: withDefaultSetup(setupWithScripts(['test', 'build', 'lint'])),
    },
    'allows you to specify your own npm scripts': {
      setup: setupWithArgs(['specialbuild,specialtest,speciallint']),
    },
    [`doesn't use test or lint if it's in pre-commit`]: {
      setup: withDefaultSetup(() => {
        const previousVal = process.env.SCRIPTS_PRE_COMMIT
        process.env.SCRIPTS_PRE_COMMIT = 'true'
        return function teardown() {
          process.env.SCRIPTS_PRE_COMMIT = previousVal
        }
      }),
    },
    'exits if there are no scripts to be run': {
      setup: withDefaultSetup(setupWithScripts([])),
    },
  },
)

function setupWithScripts(scripts = ['test', 'lint', 'build', 'typecheck']) {
  return function setup() {
    const utils = require('../../utils')
    const originalIfScript = utils.ifScript
    utils.ifScript = (script, t, f) => (scripts.includes(script) ? t : f)
    return function teardown() {
      utils.ifScript = originalIfScript
    }
  }
}

function setupWithArgs(args = []) {
  return function setup() {
    const utils = require('../../utils')
    const originalResolveBin = utils.resolveBin
    utils.resolveBin = (modName, {executable = modName} = {}) => executable
    const originalArgv = process.argv
    process.argv = ['node', '../format', ...args]
    return function teardown() {
      process.argv = originalArgv
      utils.resolveBin = originalResolveBin
    }
  }
}

function withDefaultSetup(setupFn) {
  return function defaultSetup() {
    const utils = require('../../utils')
    utils.resolveBin = (modName, {executable = modName} = {}) => executable
    const argsTeardown = setupWithArgs()()
    const teardownScripts = setupWithScripts()()
    const teardownFn = setupFn()
    return function defaultTeardown() {
      argsTeardown()
      teardownFn()
      teardownScripts()
    }
  }
}
