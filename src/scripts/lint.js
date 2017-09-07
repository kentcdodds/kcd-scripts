const path = require('path')
const spawn = require('cross-spawn')
const {hasPkgProp, resolveBin, hasFile} = require('../utils')

const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)

const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('.eslintrc') &&
  !hasPkgProp('eslintConfig')
const config = useBuiltinConfig
  ? ['--config', here('../config/eslintrc.js')]
  : []

const useBuiltinIgnore =
  !args.includes('--ignore-path') &&
  !hasFile('.eslintignore') &&
  !hasPkgProp('eslintIgnore')

const ignore = useBuiltinIgnore
  ? ['--ignore-path', here('../config/eslintignore')]
  : []

const cache = args.includes('--no-cache') ? [] : ['--cache']

const result = spawn.sync(
  resolveBin('eslint'),
  [...config, ...ignore, ...cache, '.'].concat(args),
  {stdio: 'inherit'},
)

process.exit(result.status)
