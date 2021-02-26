process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const isCI = require('is-ci')
const {hasPkgProp, parseEnv, hasFile} = require('../utils')

const args = process.argv.slice(2)

const watch =
  !isCI &&
  !parseEnv('SCRIPTS_PRE-COMMIT', false) &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const config =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')
    ? ['--config', JSON.stringify(require('../config/jest.config'))]
    : []

// eslint-disable-next-line jest/no-jest-import
require('jest').run([...config, ...watch, ...args])
