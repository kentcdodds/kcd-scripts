const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const {fromRoot} = require('../utils')
const {hasPkgProp, resolveBin} = require('../utils')

const args = process.argv.slice(2)

const here = p => path.join(__dirname, p)

const useBuiltinConfig =
  !args.includes('--config') &&
  !fs.existsSync(fromRoot('.prettierrc')) &&
  !hasPkgProp('prettierrc')
const config = useBuiltinConfig
  ? ['--config', here('../config/prettierrc.js')]
  : []

const useBuiltinIgnore =
  !args.includes('--ignore-path') && !fs.existsSync(fromRoot('.prettierignore'))
const ignore = useBuiltinIgnore
  ? ['--ignore-path', here('../config/prettierignore')]
  : []

const write = args.includes('--no-write') ? [] : ['--write']

const result = spawn.sync(
  resolveBin('prettier'),
  [...config, ...ignore, ...write].concat(args),
  {stdio: 'inherit'},
)

process.exit(result.status)
