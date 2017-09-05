const fs = require('fs')
const spawn = require('cross-spawn')
const {fromRoot} = require('../../paths')

const [executor, ...args] = process.argv

const lintStagedResult = spawn.sync(
  executor,
  [require.resolve('./lint-staged')].concat(args),
  {stdio: 'inherit'},
)

if (lintStagedResult.status !== 0 || !isOptedIntoValidate()) {
  process.exit(lintStagedResult.status)
} else {
  const validateResult = spawn.sync(
    executor,
    [require.resolve('../../'), 'validate'].concat(args),
    {stdio: 'inherit'},
  )

  process.exit(validateResult.status)
}

function isOptedIntoValidate() {
  if (!fs.existsSync(fromRoot('.opt-in'))) {
    return false
  }
  const contents = fs.readFileSync(fromRoot('.opt-in'), 'utf-8')
  return contents.includes('pre-commit')
}
