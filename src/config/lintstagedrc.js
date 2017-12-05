const { resolveIOpipeScripts, resolveBin, isOptedOut } = require('../utils');

const iopipeScripts = resolveIOpipeScripts();
const doctoc = resolveBin('doctoc');

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
    '.all-contributorsrc': [
      `${iopipeScripts} contributors generate`,
      'git add README.md'
    ],
    '**/*.+(js|json|less|css|ts|md)': [
      isOptedOut('autoformat', null, `${iopipeScripts} format`),
      `${iopipeScripts} lint`,
      `${iopipeScripts} test --findRelatedTests`,
      isOptedOut('autoformat', null, 'git add')
    ].filter(Boolean)
  }
};
