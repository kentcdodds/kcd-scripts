const path = require('path')
const spawn = require('cross-spawn')
const {hasPkgProp, hasFile, resolveBin} = require('../utils')

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')

const args = process.argv.slice(2)

const useBuiltInConfig =
  !args.includes('--config') &&
  !hasFile('.lintstagedrc') &&
  !hasFile('lint-staged.config.js') &&
  !hasPkgProp('lint-staged')

const config = useBuiltInConfig
  ? ['--config', hereRelative('../config/lintstagedrc.js')]
  : []

const lintStagedResult = spawn.sync(
  resolveBin('lint-staged'),
  [...config, ...args],
  {stdio: 'inherit'},
)

if (lintStagedResult.status === 0) {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status)
} else {
  process.exit(lintStagedResult.status)
}
