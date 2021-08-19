const {resolveCodScripts, resolveBin} = require('../utils')

const codScripts = resolveCodScripts()
const doctoc = resolveBin('doctoc')

// differs from kcd because of my eslint setup. Want to format everything other
// than js first, then format + lint js/ts using eslint with prettier plugin
module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(json|yml|yaml|css|less|scss|md|gql|graphql|mdx|vue)': [
    `${codScripts} format --no-eslint`,
  ].filter(Boolean),
  '*.+(js|jsx|ts|tsx)': [
    `${codScripts} lint --fix`,
    `${codScripts} test --findRelatedTests`,
  ].filter(Boolean),
}
