const spawn = require('cross-spawn')
const {resolveBin, getConcurrentlyArgs, hasFile, pkg} = require('../utils')

const autorelease = pkg.version === '0.0.0-semantically-released'

const result = spawn.sync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(
    {
      codecov: hasFile('coverage')
        ? `echo installing codecov && npx -p codecov -c 'echo running codecov && codecov'`
        : null,
      release: autorelease
        ? `echo installing semantic-release && npx -p semantic-release@8 -c 'echo running semantic-release && semantic-release pre && npm publish && semantic-release post'`
        : null,
    },
    {killOthers: false},
  ),
  {stdio: 'inherit'},
)

process.exit(result.status)
