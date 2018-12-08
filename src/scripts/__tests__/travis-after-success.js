import cases from 'jest-in-case'
import {unquoteSerializer} from './helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)

cases(
  'travis-after-success',
  ({
    version = '0.0.0-semantically-released',
    hasCoverageDir = true,
    isOptedOutOfCoverage = false,
    env = {
      TRAVIS: 'true',
      TRAVIS_BRANCH: 'master',
      TRAVIS_PULL_REQUEST: 'false',
    },
    runsNothing = false,
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const utils = require('../../utils')
    utils.resolveBin = (modName, {executable = modName} = {}) => executable
    const originalEnvs = Object.keys(env).map(envKey => {
      const orig = process.env[envKey]
      process.env[envKey] = env[envKey]
      return orig
    })
    const originalLog = console.log
    const originalExit = process.exit
    process.exit = jest.fn()
    console.log = jest.fn()

    // tests
    if (version) {
      utils.pkg.version = version
    }
    utils.hasFile = () => hasCoverageDir
    process.env.SKIP_CODECOV = isOptedOutOfCoverage
    require('../travis-after-success')
    if (runsNothing) {
      expect(console.log.mock.calls).toMatchSnapshot()
    } else {
      expect(crossSpawnSyncMock).toHaveBeenCalledTimes(2)
      const [firstCall, secondCall] = crossSpawnSyncMock.mock.calls
      const [scriptOne, calledArgsOne] = firstCall
      expect([scriptOne, ...calledArgsOne].join(' ')).toMatchSnapshot()
      const [scriptTwo, calledArgsTwo] = secondCall
      expect([scriptTwo, ...calledArgsTwo].join(' ')).toMatchSnapshot()
    }

    // afterEach
    process.exit = originalExit
    console.log = originalLog
    Object.keys(originalEnvs).forEach(envKey => {
      process.env[envKey] = env[envKey]
    })
    jest.resetModules()
  },
  {
    'calls concurrently with both scripts when on travis': {},
    'does not do the autorelease script when the version is different': {
      version: '1.2.3',
    },
    'does not do the codecov script when there is no coverage directory': {
      hasCoverageDir: false,
    },
    'does not do the codecov script when opted out': {
      isOptedOutOfCoverage: true,
    },
    'does not do autorelease script when running on travis but in a pull request': {
      env: {
        TRAVIS: 'true',
        TRAVIS_BRANCH: 'master',
        TRAVIS_PULL_REQUEST: 'true',
      },
    },
    'does not run either script when no coverage dir and not the right version': {
      runsNothing: true,
      hasCoverageDir: false,
      version: '1.2.3',
    },
  },
)
