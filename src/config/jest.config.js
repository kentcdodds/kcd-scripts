const path = require('path')
const {ifAnyDep, hasFile, hasPkgProp, fromRoot} = require('../utils')

const here = p => path.join(__dirname, p)

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel')

const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
]

const jestConfig = {
  roots: [fromRoot('src')],
  testEnvironment: ifAnyDep(
    ['webpack', 'rollup', 'react', 'preact'],
    'jsdom',
    'node',
  ),
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleDirectories: [
    'node_modules',
    fromRoot('src'),
    'shared',
    fromRoot('tests'),
  ],
  collectCoverageFrom: ['src/**/*.+(js|jsx|ts|tsx)'],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.js$'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
  snapshotSerializers: [
    require.resolve('jest-serializer-path'),
    require.resolve('jest-snapshot-serializer-raw/always'),
  ],
}

const setupFiles = [
  'tests/setup-env.js',
  'tests/setup-env.ts',
  'tests/setup-env.tsx',
]
for (const setupFile of setupFiles) {
  if (hasFile(setupFile)) {
    jestConfig.setupFilesAfterEnv = [fromRoot(setupFile)]
  }
}

if (useBuiltInBabelConfig) {
  jestConfig.transform = {'^.+\\.(js|jsx|ts|tsx)$': here('./babel-transform')}
}

module.exports = jestConfig
