const spawn = require('cross-spawn')

const args = process.argv.slice(2)

const result = spawn.sync(require.resolve('all-contributors-cli/cli'), args, {
  stdio: 'inherit',
})

process.exit(result.status)
