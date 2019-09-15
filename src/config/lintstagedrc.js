const { resolveCodScripts, resolveBin, isOptedOut } = require('../utils');

const codScripts = resolveCodScripts();
const doctoc = resolveBin('doctoc');

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
  '*.+(json|yml|yaml|css|less|scss|graphql)': [
    isOptedOut('autoformat', null, `${codScripts} format --no-eslint`),
    isOptedOut('autoformat', null, 'git add'),
  ].filter(Boolean),
  '*.md': [
    isOptedOut('autoformat', null, `${codScripts} format`),
    // TODO: add markdownlint
    isOptedOut('autoformat', null, 'git add'),
  ].filter(Boolean),
  '*.js': [
    isOptedOut('autoformat', null, `${codScripts} lint --fix`),
    `${codScripts} test --findRelatedTests`,
    isOptedOut('autoformat', null, 'git add'),
  ].filter(Boolean),
};
