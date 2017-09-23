const spawn = require('cross-spawn')
const {resolveBin, getConcurrentlyArgs} = require('../utils')

const result = spawn.sync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(
    {
      codecov: `echo installing codecov && npx -p codecov -c 'echo running codecov && codecov'`,
      release: `echo installing semantic-release && npx -p semantic-release@8 -c 'echo running semantic-release && semantic-release pre && npm publish && semantic-release post'`,
    },
    {killOthers: false},
  ),
  {stdio: 'inherit'},
)

process.exit(result.status)
