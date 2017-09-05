const spawn = require('cross-spawn')
const {ifScript, resolveBin} = require('../utils')

const validateScripts = process.argv[3]

const scriptNames = (...scripts) =>
  scripts
    .map(s => ifScript(s, s))
    .filter(Boolean)
    .join(',')

const useDefaultScripts = typeof validateScripts !== 'string'

const scripts = useDefaultScripts
  ? [
      ifScript('build', 'npm run build --silent'),
      ifScript('lint', 'npm run lint --silent'),
      ifScript('test', 'npm run test --silent -- --coverage'),
    ].filter(Boolean)
  : validateScripts.split(',').map(npmScript => `npm run ${npmScript} -s`)
const names = useDefaultScripts
  ? scriptNames('build', 'lint', 'test')
  : validateScripts.split(',')

const colors = [
  'bgBlue.bold',
  'bgGreen.bold',
  'bgMagenta.bold',
  'black.bgWhite.bold',
  'white.bgBlack.bold',
  'bgRed.bold',
].join(',')

const result = spawn.sync(
  resolveBin('concurrently'),
  // prettier-ignore
  [
    '--kill-others-on-fail',
    '--prefix', '[{name}]',
    '--names', names,
    '--prefix-colors', colors,
    ...scripts,
  ],
  {stdio: 'inherit'},
)

process.exit(result.status)
