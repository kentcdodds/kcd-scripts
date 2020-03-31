const path = require('path');
const { ifAnyDep, hasFile, ifFile, hasPkgProp, fromRoot } = require('../utils');

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig =
  !hasFile('.babelrc') && !hasFile('.babelrc.js') && !hasPkgProp('babel');

const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
];

const hasSrcDir = hasFile('src');

const jestConfig = {
  roots: [fromRoot(hasSrcDir ? 'src' : '')],
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  collectCoverageFrom: ['src/**/*.+(js|jsx|ts|tsx)'],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)', '**/?(*.)+(spec|test).[jt]s?(x)'],
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
  setupFilesAfterEnv: [
    ifAnyDep('@testing-library/jest-dom', '@testing-library/jest-dom/extend-expect'),
    ifFile('jest.setup.js', fromRoot('jest.setup.js')),
    ifFile('setupTests.js', fromRoot('setupTests.js')),
    ifFile('tests/setup-env.js', fromRoot('tests/setup-env.js')),
  ].filter(Boolean),
};

if (useBuiltInBabelConfig) {
  jestConfig.transform = { '^.+\\.js$': here('./babel-transform') };
}

if (jestConfig.testEnvironment === 'jsdom') {
  jestConfig.setupFiles = [require.resolve('react-app-polyfill/jsdom')];
}

module.exports = jestConfig;
