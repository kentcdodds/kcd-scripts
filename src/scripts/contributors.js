const spawn = require('cross-spawn')
const {resolveBin} = require('../utils')

const args = process.argv.slice(2)

const result = spawn.sync(
  resolveBin('all-contributors-cli', {executable: 'all-contributors'}),
  args,
  {
    stdio: 'inherit',
  },
)

process.exit(result.status)
