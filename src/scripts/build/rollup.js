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

let formats = ['esm', 'cjs', 'umd', 'umd.min']

if (typeof parsedArgs.bundle === 'string') {
  formats = parsedArgs.bundle.split(',')
}

const defaultEnv = 'BUILD_ROLLUP=true'

const getCommand = env =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch]
    .filter(Boolean)
    .join(' ')

const scripts = args.includes('--p-react')
  ? getPReactScripts()
  : getConcurrentlyArgs(getCommands())

rimraf.sync(fromRoot('dist'))

const result = spawn.sync(resolveBin('concurrently'), scripts, {
  stdio: 'inherit',
})

function getPReactScripts() {
  const reactCommands = prefixKeys('react.', getCommands())
  const preactCommands = prefixKeys('preact.', getCommands('BUILD_PREACT=true'))
  return getConcurrentlyArgs(Object.assign(reactCommands, preactCommands))
}

function prefixKeys(prefix, object) {
  return Object.entries(object).reduce((cmds, [key, value]) => {
    cmds[`${prefix}${key}`] = value
    return cmds
  }, {})
}

function getCommands(env = '') {
  return formats.reduce((cmds, format) => {
    const [formatName, minify = false] = format.split('.')
    cmds[format] = getCommand(
      `BUILD_FORMAT=${formatName} BUILD_MINIFY=${Boolean(minify)} ${env}`,
    )
    return cmds
  }, {})
}

process.exit(result.status)
