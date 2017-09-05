const path = require('path')
const {ifAnyDep} = require('../utils')

const here = p => path.join(__dirname, p)

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
]

module.exports = {
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/__tests__/**/*.js'],
  testPathIgnorePatterns: ignores,
  coveragePathIgnorePatterns: ignores,
  transform: {
    '^.+\\.js$': here('./babel-transform'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
