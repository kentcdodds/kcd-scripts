const spawn = require('cross-spawn')
const resolveBin = require('resolve-bin')
const {ifScript} = require('../utils')

const scriptNames = (...scripts) =>
  scripts
    .map(s => ifScript(s, s))
    .filter(Boolean)
    .join(',')

const result = spawn.sync(
  resolveBin.sync('concurrently'),
  // prettier-ignore
  [
    '--kill-others-on-fail',
    '--prefix', '[{name}]',
    '--names', scriptNames('build', 'lint', 'test'),
    '--prefix-colors', 'bgBlue.bold,bgGreen.bold,bgMagenta.bold',
    ...[
      ifScript('build', 'npm run build --silent'),
      ifScript('lint', 'npm run lint --silent'),
      ifScript('test', 'npm run test --silent -- --coverage'),
    ].filter(Boolean),
  ],
  {stdio: 'inherit'},
)

process.exit(result.status)
