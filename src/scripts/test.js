/* istanbul ignore next */
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const jest = require('jest')
const {hasPkgProp, parseEnv, hasFile} = require('../utils')

const args = process.argv.slice(2)

const watch =
  !process.env.CI &&
  !parseEnv('SCRIPTS_PRECOMMIT', false) &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')

const config = useBuiltinConfig
  ? ['--config', JSON.stringify(require('../config/jest.config'))]
  : []

jest.run([...config, ...watch, ...args])
