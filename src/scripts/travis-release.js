const spawn = require('cross-spawn')
const {pkg, parseEnv, hasScript} = require('../utils')

const autorelease =
  pkg.version === '0.0.0-semantically-released' &&
  parseEnv('TRAVIS', false) &&
  process.env.TRAVIS_BRANCH === 'master' &&
  !parseEnv('TRAVIS_PULL_REQUEST', false)

function main() {
  if (autorelease) {
    if (hasScript('build')) {
      const buildResult = spawn.sync('npm', ['run', 'build'], {
        stdio: 'inherit',
      })
      if (buildResult.status !== 0) {
        process.exit(buildResult.status)
        return
      }
    }

    const result = spawn.sync('npx', ['semantic-release@17'], {
      stdio: 'inherit',
    })

    process.exit(result.status)
  }
}

main()
