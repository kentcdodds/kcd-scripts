const { resolveItpReactScripts, resolveBin, isOptedOut } = require('../utils');

const itpScripts = resolveItpReactScripts();
const doctoc = resolveBin('doctoc');

module.exports = {
  concurrent: false,
  linters: {
    'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
    '.all-contributorsrc': [
      `${itpScripts} contributors generate`,
      'git add README.md',
    ],
    '**/*.+(js|json|less|css|ts|tsx|md)': [
      isOptedOut('autoformat', null, `${itpScripts} format`),
      `${itpScripts} lint --fix`,
      `${itpScripts} test --findRelatedTests --passWithNoTests`,
      isOptedOut('autoformat', null, 'git add'),
    ].filter(Boolean),
  },
};
