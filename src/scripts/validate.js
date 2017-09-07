const spawn = require('cross-spawn')
const {getConcurrentlyArgs, hasScript, resolveBin} = require('../utils')

const validateScripts = process.argv[2]

const useDefaultScripts = typeof validateScripts !== 'string'

const scripts = useDefaultScripts
  ? Object.entries({
      build: 'npm run build --silent',
      lint: 'npm run lint --silent',
      test: 'npm run test --silent -- --coverage',
    }).reduce((scriptsToRun, [name, script]) => {
      if (hasScript(name)) {
        scriptsToRun[name] = script
      }
      return scriptsToRun
    }, {})
  : validateScripts.split(',').reduce((scriptsToRun, name) => {
      scriptsToRun[name] = `npm run ${name} --silent`
      return scriptsToRun
    }, {})

const result = spawn.sync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(scripts),
  {stdio: 'inherit'},
)

process.exit(result.status)
