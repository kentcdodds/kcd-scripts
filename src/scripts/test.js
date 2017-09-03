process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const jest = require('jest')

const argv = process.argv.slice(2)

if (!process.env.CI && !argv.includes('--coverage')) {
  argv.push('--watch')
}
argv.push('--config', JSON.stringify(require('../config/jest.config')))

jest.run(argv)
