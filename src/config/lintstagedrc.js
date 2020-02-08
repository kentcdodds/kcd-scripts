const { resolveCodScripts, resolveBin, isOptedOut } = require('../utils');

const codScripts = resolveCodScripts();
const doctoc = resolveBin('doctoc');

// differs from kcd because of my eslint setup. Want to format everything other
// than js first, then format + lint js using eslint with prettier plugin
module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    isOptedOut('autoformat', null, `${codScripts} format --no-eslint`),
  ].filter(Boolean),
  '*.js': [
    isOptedOut('autoformat', null, `${codScripts} lint --fix`),
    `${codScripts} test --findRelatedTests`,
  ].filter(Boolean),
};
