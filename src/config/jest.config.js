const {ifDevDep, applyOverrides} = require('../utils')

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
]

const config = applyOverrides({
  type: 'jest',
  config: {
    testEnvironment: ifDevDep('webpack', 'jsdom', 'node'),
    collectCoverageFrom: ['src/**/*.js'],
    testMatch: ['**/__tests__/**/*.js'],
    testPathIgnorePatterns: ignores,
    coveragePathIgnorePatterns: ignores,
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
})

module.exports = config
