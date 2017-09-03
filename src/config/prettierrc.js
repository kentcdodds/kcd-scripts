const {applyOverrides} = require('../utils')

const config = applyOverrides({
  type: 'prettier',
  config: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    jsxBraketSameLine: false,
  },
})

module.exports = config
