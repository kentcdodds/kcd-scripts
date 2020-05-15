const {resolveKcdScripts, resolveBin, ifTypescript} = require('../utils')

const kcdScripts = resolveKcdScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    `${kcdScripts} format`,
    `${kcdScripts} lint`,
    `${kcdScripts} test --findRelatedTests`,
  ],
  '!(types)/**/*.(ts|tsx)': ifTypescript ? [`tsc --noEmit`] : undefined,
  'types/!(__tests__)/**/*.(ts|tsx)': ifTypescript
    ? [`tsc --noEmit`]
    : undefined,
}
