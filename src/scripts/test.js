/* istanbul ignore next */
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const fs = require('fs')
const jest = require('jest')
const {hasPkgProp} = require('../utils')
const {fromRoot} = require('../utils')

const args = process.argv.slice(2)

const watch =
  !process.env.CI &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const useBuiltinConfig =
  !args.includes('--config') &&
  !fs.existsSync(fromRoot('jest.config.js')) &&
  !hasPkgProp('jest')

const config = useBuiltinConfig
  ? ['--config', JSON.stringify(require('../config/jest.config'))]
  : []

jest.run([...config, ...watch, ...args])
