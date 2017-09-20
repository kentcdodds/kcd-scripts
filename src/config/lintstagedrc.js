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
      // lint-staged passes arguments to the scripts.
      // to avoid passing these arguments, we do the echo thing
      `${kcdScripts} contributors generate`,
      'git add README.md',
    ],
  },
}
