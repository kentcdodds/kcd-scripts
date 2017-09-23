const spawn = require('cross-spawn')
const {
  parseEnv,
  resolveBin,
  ifScript,
  getConcurrentlyArgs,
} = require('../utils')

// precommit runs linting and tests on the relevant files
// so those scripts don't need to be run if we're running
// this in the context of a precommit hook.
const precommit = parseEnv('SCRIPTS_PRECOMMIT', false)

const validateScripts = process.argv[2]

const useDefaultScripts = typeof validateScripts !== 'string'

const scripts = useDefaultScripts
  ? {
      build: ifScript('build', 'npm run build --silent'),
      lint: precommit ? null : ifScript('lint', 'npm run lint --silent'),
      test: precommit
        ? null
        : ifScript('test', 'npm run test --silent -- --coverage'),
      flow: ifScript('flow', 'npm run flow --silent'),
    }
  : validateScripts.split(',').reduce((scriptsToRun, name) => {
      scriptsToRun[name] = `npm run ${name} --silent`
      return scriptsToRun
    }, {})

const result = spawn.sync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(scripts),
  {stdio: 'inherit'},
)

process.exit(result.status)
