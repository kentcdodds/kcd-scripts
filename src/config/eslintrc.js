const prettierConfig = require('./prettierrc');
const { hasLocalConfig } = require('../utils');

const args = process.argv.slice(2);

const useBuiltinConfig =
  !args.includes('--config') && !hasLocalConfig('prettier');
const ruleValue = useBuiltinConfig ? ['error', prettierConfig] : 'error';

module.exports = {
  extends: [require.resolve('eslint-config-codfish')].filter(Boolean),
  rules: {
    // Explicitly set prettier rules to use our built in config if no
    // local prettier config is found.
    'prettier/prettier': ruleValue,
  },
};
