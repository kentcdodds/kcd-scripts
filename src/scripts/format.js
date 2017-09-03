const path = require('path')
const resolveBin = require('resolve-bin')
const spawn = require('cross-spawn')

const argv = process.argv.slice(2)

const here = p => path.join(__dirname, p)

const result = spawn.sync(
  resolveBin.sync('prettier'),
  // prettier-ignore
  [
    '--write',
    '--config', here('../config/prettierrc.js'),
    '--ignore-path', here('../config/eslintignore'),
  ].concat(argv),
  {stdio: 'inherit'}
)

process.exit(result)
