const { ifAnyDep } = require('../utils');

module.exports = {
	extends: [
		require.resolve('eslint-config-tradeshift'),
		// require.resolve('eslint-config-tradeshift/jest'),
		ifAnyDep('react', 'plugin:react/recommended')
		// ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react')),
	].filter(Boolean),
	plugins: ['jest', ifAnyDep('react', 'react')].filter(Boolean),
	rules: {
		'jest/no-disabled-tests': 1,
		'jest/no-focused-tests': 2,
		'jest/no-identical-title': 2,
		'jest/valid-expect': 2
	},
	env: {
		'jest/globals': true
	}
};
