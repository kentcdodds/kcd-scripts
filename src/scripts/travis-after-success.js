const spawn = require('cross-spawn')
const {
  resolveBin,
  getConcurrentlyArgs,
  hasFile,
  pkg,
  parseEnv,
} = require('../utils')

console.log('installing and running travis-deploy-once')
const deployOnceResults = spawn.sync('npx', ['travis-deploy-once@5'], {
  stdio: 'inherit',
})
if (deployOnceResults.status === 0) {
  runAfterSuccessScripts()
} else {
  console.log(
    'travis-deploy-once exited with a non-zero exit code',
    deployOnceResults.status,
  )
  process.exit(deployOnceResults.status)
}

// eslint-disable-next-line complexity
function runAfterSuccessScripts() {
  const autorelease =
    pkg.version === '0.0.0-semantically-released' &&
    parseEnv('TRAVIS', false) &&
    process.env.TRAVIS_BRANCH === 'master' &&
    !parseEnv('TRAVIS_PULL_REQUEST', false)

  const reportCoverage = hasFile('coverage') && !parseEnv('SKIP_CODECOV', false)

  if (!autorelease && !reportCoverage) {
    console.log(
      'No need to autorelease or report coverage. Skipping travis-after-success script...',
    )
  } else {
    const result = spawn.sync(
      resolveBin('concurrently'),
      getConcurrentlyArgs(
        {
          codecov: reportCoverage
            ? `echo installing codecov && npx -p codecov@3 -c 'echo running codecov && codecov'`
            : null,
          release: autorelease
            ? `echo installing semantic-release && npx -p semantic-release@15 -c 'echo running semantic-release && semantic-release'`
            : null,
        },
        {killOthers: false},
      ),
      {stdio: 'inherit'},
    )

    process.exit(result.status)
  }
}
