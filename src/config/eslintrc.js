const prettierConfig = require('./prettierrc');

module.exports = {
  extends: [require.resolve('eslint-config-codfish')].filter(Boolean),
  rules: {
    'prettier/prettier': ['error', prettierConfig],
  },
};
