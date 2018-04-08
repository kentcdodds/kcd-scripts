const path = require('path')
const spawn = require('cross-spawn')
const glob = require('glob')

const [executor, ignoredBin, script, ...args] = process.argv

if (script) {
  spawnScript()
} else {
  const scriptsPath = path.join(__dirname, 'scripts/')
  const scriptsAvailable = glob.sync(path.join(__dirname, 'scripts', '*'))
  // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .map(s =>
      s
        .replace(scriptsPath, '')
        .replace(/__tests__/, '')
        .replace(/\.js$/, ''),
    )
    .filter(Boolean)
    .join('\n  ')
    .trim()
  const fullMessage = `
Usage: ${ignoredBin} [script] [--flags]

Available Scripts:
  ${scriptsAvailableMessage}

Options:
  All options depend on the script. Docs will be improved eventually, but for most scripts you can assume that the args you pass will be forwarded to the respective tool that's being run under the hood.

May the force be with you.
  `.trim()
  console.log(`\n${fullMessage}\n`)
}

function getEnv() {
  // this is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/kcd-scripts/issues/4
  return Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key]
        return envCopy
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true,
      },
    )
}

function spawnScript() {
  const relativeScriptPath = path.join(__dirname, './scripts', script)
  const scriptPath = attemptResolve(relativeScriptPath)

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`)
  }
  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: 'inherit',
    env: getEnv(),
  })

  if (result.signal) {
    handleSignal(result)
  } else {
    process.exit(result.status)
  }
}

function handleSignal(result) {
  if (result.signal === 'SIGKILL') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.',
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.',
    )
  }
  process.exit(1)
}

function attemptResolve(...resolveArgs) {
  try {
    return require.resolve(...resolveArgs)
  } catch (error) {
    return null
  }
}
