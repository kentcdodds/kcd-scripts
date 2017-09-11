const path = require('path')
const resolve = require('resolve')
const {hasPkgProp, hasFile} = require('../../utils')

const useBuiltinConfig =
  !hasFile('.lintstagedrc') &&
  !hasFile('lint-staged.config.js') &&
  !hasPkgProp('lint-staged')

const lintStagedPath = require.resolve('lint-staged')
const cosmiconfigPath = resolve.sync('cosmiconfig', {
  basedir: path.dirname(lintStagedPath),
})

// lint-staged uses cosmiconfig to find its configuration
// and it has no other way to provide config
// (via a node API or command-line flag)
// So, we're doing this require cache magic to provide our own
// config so folks don't have to have that in their package.json
function fakeCosmiconfig(...args) {
  if (args[0] === 'lint-staged') {
    return Promise.resolve({config: require('../../config/lintstagedrc')})
  } else {
    return require(cosmiconfigPath)(...args)
  }
}

if (useBuiltinConfig) {
  require.cache[cosmiconfigPath] = {exports: fakeCosmiconfig}
}

require(lintStagedPath)
