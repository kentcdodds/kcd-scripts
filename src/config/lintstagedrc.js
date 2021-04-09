const {resolveKcdScripts, resolveBin} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|gql|graphql|mdx|vue)': [
    `${kcdScripts} format`,
    `${kcdScripts} lint`,
    `${kcdScripts} test --findRelatedTests`,
  ],
}
