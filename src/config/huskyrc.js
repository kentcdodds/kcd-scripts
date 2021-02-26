const {resolveCodScripts} = require('../utils')

const codScripts = resolveCodScripts()

module.exports = {
  hooks: {
    'pre-commit': `"${codScripts}" pre-commit`,
    'commit-msg': `"${codScripts}" commitlint -E HUSKY_GIT_PARAMS`,
  },
}
