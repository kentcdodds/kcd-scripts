const path = require('path')
const resolveBin = require('resolve-bin')
const spawn = require('cross-spawn')

const [ignoredExecutor, ignoredBin, ignoredScript, ...args] = process.argv

const here = p => path.join(__dirname, p)

const result = spawn.sync(
  resolveBin.sync('eslint'),
  // prettier-ignore
  [
    '--config', here('../config/eslintrc.js'),
    '--ignore-path', here('../config/eslintignore'),
    '--cache',
    '.',
  ].concat(args),
  {stdio: 'inherit'}
)

if (result.status === 0) {
  console.error(`All's good 👍`)
}

process.exit(result.status)
