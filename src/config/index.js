module.exports = {
  babel: require('./babelrc'),
  commitlint: require('./commitlint.config'),
  eslint: require('./eslintrc'),
  husky: require('./huskyrc'),
  jest: require('./jest.config'),
  lintStaged: require('./lintstagedrc'),
  prettier: require('./prettierrc'),
  getRollupConfig: () => require('./rollup.config'),
};
