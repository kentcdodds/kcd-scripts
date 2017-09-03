const spawn = require('cross-spawn')
const {ifScript} = require('../utils')

const scriptNames = (...scripts) =>
  scripts
    .map(s => ifScript(s, s))
    .filter(Boolean)
    .join(',')

const result = spawn.sync(
  require.resolve('concurrently'),
  // prettier-ignore
  [
    '--kill-others-on-fail',
    '--prefix', '[{name}]',
    '--names', scriptNames('build', 'lint', 'test'),
    '--prefix-colors', 'bgBlue.bold,bgGreen.bold,bgOrang.bold',
    ...[
      ifScript('build', 'npm run build --silent'),
      ifScript('lint', 'npm run lint --silent'),
      ifScript('test', 'npm run test --silent -- --coverage'),
    ].filter(Boolean),
  ],
  {stdio: 'inherit'}
)

process.exit(result)
