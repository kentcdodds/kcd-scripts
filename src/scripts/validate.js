const spawn = require('cross-spawn')
const {ifScript, hasScript, parseEnv, resolveBin} = require('../utils')

// precommit runs linting and tests on the relevant files
// so those scripts don't need to be run if we're running
// this in the context of a precommit hook.
const ifScriptAndNotPreCommit = (scriptName, script) =>
  !parseEnv('SCRIPTS_PRECOMMIT', false) && hasScript(scriptName) ? script : null

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
      ifScriptAndNotPreCommit('lint', 'npm run lint --silent'),
      ifScriptAndNotPreCommit('test', 'npm run test --silent -- --coverage'),
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
