const spawn = require('cross-spawn')
const {isOptedIn} = require('../../utils')

const [executor, ...args] = process.argv

const lintStagedResult = spawn.sync(
  executor,
  [require.resolve('./lint-staged')].concat(args),
  {stdio: 'inherit'},
)

if (lintStagedResult.status !== 0 || !isOptedIn('pre-commit')) {
  process.exit(lintStagedResult.status)
} else {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status)
}
