const {resolveKcdScripts, resolveBin} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  concurrent: false,
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
    'README.md': [`${doctoc} --maxlevel 2 --notitle`, 'git add'],
  },
}
