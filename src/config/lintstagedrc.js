const {resolveKcdScripts, resolveBin, isOptedOut} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    isOptedOut('autoformat', null, `${kcdScripts} format`),
    `${kcdScripts} lint`,
    `${kcdScripts} test --findRelatedTests`,
  ].filter(Boolean),
}
