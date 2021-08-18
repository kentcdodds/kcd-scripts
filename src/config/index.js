module.exports = {
  babel: require('./babelrc'),
  commitlint: require('./commitlint.config'),
  eslint: require('./eslintrc'),
  jest: require('./jest.config'),
  lintStaged: require('./lintstagedrc'),
  prettier: require('./prettierrc'),
  getRollupConfig: () => require('./rollup.config'),
}
