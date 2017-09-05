const resolveBin = require('resolve-bin')
const spawn = require('cross-spawn')
const {ifScript} = require('../utils')

const args = process.argv.slice(2)

const scriptNames = (...scripts) =>
  scripts
    .map(s => ifScript(s, s))
    .filter(Boolean)
    .join(',')

const useDefaultScripts = args.length > 0

const scripts = useDefaultScripts
  ? args[0].split(',').map(npmScript => `npm run ${npmScript} -s`)
  : [
      ifScript('build', 'npm run build --silent'),
      ifScript('lint', 'npm run lint --silent'),
      ifScript('test', 'npm run test --silent -- --coverage'),
    ].filter(Boolean)
const names = useDefaultScripts
  ? args[0].split(',')
  : scriptNames('build', 'lint', 'test')

const colors = [
  'bgBlue.bold',
  'bgGreen.bold',
  'bgMagenta.bold',
  'black.bgWhite.bold',
  'white.bgBlack.bold',
  'bgRed.bold',
].join(',')

const result = spawn.sync(
  resolveBin.sync('concurrently'),
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
