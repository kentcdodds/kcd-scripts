#!/usr/bin/env node
const path = require('path')
const spawn = require('cross-spawn')

function attemptResolve(...args) {
  try {
    return require.resolve(...args)
  } catch (error) {
    return null
  }
}

const [executor, ignoredBin, script, ...args] = process.argv
const relativeScriptPath = path.join(__dirname, './scripts', script)
const scriptPath = attemptResolve(relativeScriptPath)

if (!scriptPath) {
  console.log(`Unknown script "${script}".`)
  console.log('Perhaps you need to update kcd-scripts?')
}

const result = spawn.sync(executor, [scriptPath, ...args], {
  stdio: 'inherit',
  env: Object.assign({}, process.env, {
    [`SCRIPTS_${script.toUpperCase()}`]: true,
  }),
})

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.',
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.',
    )
  }
  process.exit(1)
}
process.exit(result.status)
