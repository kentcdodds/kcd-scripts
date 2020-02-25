const chalk = require('chalk')
const spawn = require('cross-spawn')
const glob = require('glob')
const {pkg, parseEnv, hasScript} = require('../utils')

const autorelease =
  pkg.version === '0.0.0-semantically-released' &&
  parseEnv('TRAVIS', false) &&
  process.env.TRAVIS_BRANCH === 'master' &&
  !parseEnv('TRAVIS_PULL_REQUEST', false)

function main() {
  if (autorelease) {
    if (hasScript('build') && pkg.files) {
      let needToBuild = pkg.files.filter(
        fileGlob => glob.sync(fileGlob).length < 1,
      )
      if (needToBuild.length) {
        const buildResult = spawn.sync('npm', ['run', 'build'], {
          stdio: 'inherit',
        })
        if (buildResult.status !== 0) {
          process.exit(buildResult.status)
          return
        }
        needToBuild = pkg.files.filter(
          fileGlob => glob.sync(fileGlob).length < 1,
        )
        if (needToBuild.length) {
          const list = needToBuild.join(', ')
          throw new Error(
            chalk.red(
              `🚨  The following listings in package.json#files do not match any files even after the build: ${list}`,
            ),
          )
        }
      }
    }

    const result = spawn.sync('npx', ['semantic-release@17'], {
      stdio: 'inherit',
    })

    process.exit(result.status)
  }
}

main()
