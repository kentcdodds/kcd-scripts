const {resolveKcdScripts, resolveBin, isOptedOut} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
    '.all-contributorsrc': [
      `${kcdScripts} contributors generate`,
      'git add README.md',
    ],
    '**/*.+(js|json|less|css|ts|md)': [
      isOptedOut('autoformat', null, `${kcdScripts} format`),
      `${kcdScripts} lint`,
      `${kcdScripts} test --findRelatedTests --passWithNoTests`,
      isOptedOut('autoformat', null, 'git add'),
    ].filter(Boolean),
  },
}
