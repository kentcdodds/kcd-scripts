const {resolveKcdScripts} = require('../utils')

const kcdScripts = resolveKcdScripts()

module.exports = {
  hooks: {
    'pre-commit': `"${kcdScripts}" pre-commit`,
  },
}
