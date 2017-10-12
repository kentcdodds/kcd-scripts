const {resolveKcdScripts, resolveBin, isOptedOut} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  concurrent: false,
  linters: {
    '**/*.+(js|json|less|css|ts)': [
      isOptedOut('autoformat', null, `${kcdScripts} format`),
      `${kcdScripts} lint`,
      `${kcdScripts} test --findRelatedTests`,
      isOptedOut('autoformat', null, 'git add'),
    ].filter(Boolean),
    '.all-contributorsrc': [
      `${kcdScripts} contributors generate`,
      'git add README.md',
    ],
    'README.md': [`${doctoc} --maxlevel 2 --notitle`, 'git add'],
  },
}
