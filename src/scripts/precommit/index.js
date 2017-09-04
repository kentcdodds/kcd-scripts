const spawn = require('cross-spawn')

const [executor, ...args] = process.argv

const lintStagedResult = spawn.sync(
  executor,
  [require.resolve('./lint-staged')].concat(args),
  {stdio: 'inherit'},
)

if (lintStagedResult.status !== 0) {
  process.exit(lintStagedResult.status)
}

const validateResult = spawn.sync(
  executor,
  [require.resolve('../../'), 'validate'].concat(args),
  {stdio: 'inherit'},
)

process.exit(validateResult.status)
