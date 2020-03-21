module.exports = {
  babel: require('./babelrc'),
  eslint: require('./eslintrc'),
  husky: require('./huskyrc'),
  jest: require('./jest.config'),
  lintStaged: require('./lintstagedrc'),
  prettier: require('./prettierrc'),
  getRollupConfig: () => require('./rollup.config'),
}
