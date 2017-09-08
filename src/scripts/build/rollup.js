const path = require('path')
const spawn = require('cross-spawn')
const rimraf = require('rimraf')
const yargsParser = require('yargs-parser')
const {
  hasFile,
  resolveBin,
  fromRoot,
  getConcurrentlyArgs,
} = require('../../utils')

const crossEnv = resolveBin('cross-env')
const rollup = resolveBin('rollup')
const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--config') && !hasFile('rollup.config.js')
const config = useBuiltinConfig
  ? `--config ${here('../../config/rollup.config.js')}`
  : args.includes('--config') ? '' : '--config' // --config will pick up the rollup.config.js file

const environment = parsedArgs.environment
  ? `--environment ${parsedArgs.environment}`
  : ''
const watch = parsedArgs.watch ? '--watch' : ''

const defaultEnv = 'BUILD_ROLLUP=true'

const getCommand = env =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch]
    .filter(Boolean)
    .join(' ')

const scripts = args.includes('--p-react')
  ? getPReactScripts()
  : getConcurrentlyArgs({
      esm: getCommand('BUILD_FORMAT=esm'),
      cjs: getCommand('BUILD_FORMAT=cjs'),
      umd: getCommand('BUILD_FORMAT=umd'),
      'umd.min': getCommand('BUILD_FORMAT=umd BUILD_MINIFY=true'),
    })

rimraf.sync(fromRoot('dist'))

const result = spawn.sync(resolveBin('concurrently'), scripts, {
  stdio: 'inherit',
})

function getPReactScripts() {
  return getConcurrentlyArgs({
    'react.esm': getCommand('BUILD_FORMAT=esm'),
    'react.cjs': getCommand('BUILD_FORMAT=cjs'),
    'react.umd': getCommand('BUILD_FORMAT=umd'),
    'react.umd.min': getCommand('BUILD_FORMAT=umd BUILD_MINIFY=true'),
    'preact.esm': getCommand('BUILD_PREACT=true BUILD_FORMAT=esm'),
    'preact.cjs': getCommand('BUILD_PREACT=true BUILD_FORMAT=cjs'),
    'preact.umd': getCommand('BUILD_PREACT=true BUILD_FORMAT=umd'),
    'preact.umd.min': getCommand(
      'BUILD_PREACT=true BUILD_FORMAT=umd BUILD_MINIFY=true',
    ),
  })
}

process.exit(result.status)
