const spawn = require('cross-spawn')
const {pkg, parseEnv} = require('../utils')

const autorelease =
  pkg.version === '0.0.0-semantically-released' &&
  parseEnv('TRAVIS', false) &&
  process.env.TRAVIS_BRANCH === 'master' &&
  !parseEnv('TRAVIS_PULL_REQUEST', false)

if (autorelease) {
  const result = spawn.sync('npx', ['semantic-release@17'], {
    stdio: 'inherit',
  })

  process.exit(result.status)
}
