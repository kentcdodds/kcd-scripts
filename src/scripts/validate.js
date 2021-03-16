const spawn = require('cross-spawn')
const {
  parseEnv,
  resolveBin,
  ifScript,
  getConcurrentlyArgs,
} = require('../utils')

// pre-commit runs linting and tests on the relevant files
// so those scripts don't need to be run if we're running
// this in the context of a pre-commit hook.
const preCommit = parseEnv('SCRIPTS_PRE_COMMIT', false)

const validateScripts = process.argv[2]

const useDefaultScripts = typeof validateScripts !== 'string'

const scripts = useDefaultScripts
  ? {
      build: ifScript('build', 'npm run build --silent'),
      lint: preCommit ? null : ifScript('lint', 'npm run lint --silent'),
      test: preCommit
        ? null
        : ifScript('test', 'npm run test --silent -- --coverage'),
      typecheck: ifScript('typecheck', 'npm run typecheck --silent'),
    }
  : validateScripts.split(',').reduce(
      (scriptsToRun, name) => ({
        ...scriptsToRun,
        [name]: `npm run ${name} --silent`,
      }),
      {},
    )

const scriptCount = Object.values(scripts).filter(Boolean).length

if (scriptCount > 0) {
  const result = spawn.sync(
    resolveBin('concurrently'),
    getConcurrentlyArgs(scripts),
    {stdio: 'inherit'},
  )

  process.exit(result.status)
} else {
  process.exit(0)
}
