/* istanbul ignore next */
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const {hasPkgProp, parseEnv, hasFile} = require('../utils')

const args = process.argv.slice(2)

const watch =
  !parseEnv('CI', false) &&
  !parseEnv('SCRIPTS_PRECOMMIT', false) &&
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

require('jest').run([...config, ...watch, ...args])
