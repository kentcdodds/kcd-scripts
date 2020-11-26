const spawn = require('cross-spawn')
const {hasAnyDep, resolveBin, hasFile} = require('../utils')

const args = process.argv.slice(2)

if (!hasAnyDep('typescript')) {
  throw new Error(
    'Cannot use the "typecheck" script in a project that does not have typescript listed as a dependency (or devDependency).',
  )
}

if (!hasFile('tsconfig.json')) {
  throw new Error(
    'Cannot use the "typecheck" script in a project that does not have a tsconfig.json file.',
  )
}

const result = spawn.sync(
  resolveBin('typescript', {executable: 'tsc'}),
  ['--build', ...args],
  {stdio: 'inherit'},
)

process.exit(result.status)
