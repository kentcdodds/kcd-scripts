// const {ifAnyDep} = require('../utils')

module.exports = {
	extends: [
		require.resolve('eslint-config-tradeshift')
		// require.resolve('eslint-config-tradeshift/jest'),
		// ifAnyDep('react', require.resolve('eslint-config-kentcdodds/jsx-a11y')),
		// ifAnyDep('react', require.resolve('eslint-config-kentcdodds/react')),
	].filter(Boolean),
	plugins: ['jest'],
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
