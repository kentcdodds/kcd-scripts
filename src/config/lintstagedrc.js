const {resolveKcdScripts} = require('../utils')

const kcdScripts = resolveKcdScripts()

module.exports = {
  linters: {
    '**/*.+(js|json|less|css|ts)': [
      `${kcdScripts} format`,
      `${kcdScripts} lint`,
      `${kcdScripts} test --findRelatedTests`,
      'git add',
    ],
    '.all-contributorsrc': [
      `${kcdScripts} contributors generate`,
      'git add README.md',
    ],
  },
}
