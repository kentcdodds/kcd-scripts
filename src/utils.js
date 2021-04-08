const fs = require('fs')
const path = require('path')
const cpy = require('cpy')
const spawn = require('cross-spawn')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const arrify = require('arrify')
const has = require('lodash.has')
const glob = require('glob')
const readPkgUp = require('read-pkg-up')
const which = require('which')
const {cosmiconfigSync} = require('cosmiconfig')

const {packageJson: pkg, path: pkgPath} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
const appDirectory = path.dirname(pkgPath)

function resolveKcdScripts() {
  if (
    pkg.name === 'kcd-scripts' ||
    // this happens on install of husky within kcd-scripts locally
    appDirectory.includes(path.join(__dirname, '..'))
  ) {
    return require.resolve('./').replace(process.cwd(), '.')
  }
  return resolveBin('kcd-scripts')
}

// eslint-disable-next-line complexity
function resolveBin(modName, {executable = modName, cwd = process.cwd()} = {}) {
  let pathFromWhich
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable))
    if (pathFromWhich && pathFromWhich.includes('.CMD')) return pathFromWhich
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`)
    const modPkgDir = path.dirname(modPkgPath)
    const {bin} = require(modPkgPath)
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)
    if (fullPathToBin === pathFromWhich) {
      return executable
    }
    return fullPathToBin.replace(cwd, '.')
  } catch (error) {
    if (pathFromWhich) {
      return executable
    }
    throw error
  }
}

const fromRoot = (...p) => path.join(appDirectory, ...p)
const hasFile = (...p) => fs.existsSync(fromRoot(...p))
const ifFile = (files, t, f) =>
  arrify(files).some(file => hasFile(file)) ? t : f

const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop))

const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))

const ifPkgSubProp = pkgProp => (props, t, f) =>
  hasPkgSubProp(pkgProp)(props) ? t : f

const hasScript = hasPkgSubProp('scripts')
const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasAnyDep = args => [hasDep, hasDevDep, hasPeerDep].some(fn => fn(args))

const ifPeerDep = ifPkgSubProp('peerDependencies')
const ifDep = ifPkgSubProp('dependencies')
const ifDevDep = ifPkgSubProp('devDependencies')
const ifAnyDep = (deps, t, f) => (hasAnyDep(arrify(deps)) ? t : f)
const ifScript = ifPkgSubProp('scripts')

const hasTypescript = hasAnyDep('typescript') && hasFile('tsconfig.json')
const ifTypescript = (t, f) => (hasTypescript ? t : f)

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name])
    } catch (err) {
      return process.env[name]
    }
  }
  return def
}

function envIsSet(name) {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== 'undefined'
  )
}

function getConcurrentlyArgs(scripts, {killOthers = true} = {}) {
  const colors = [
    'bgBlue',
    'bgGreen',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgRed',
    'bgBlack',
    'bgYellow',
  ]
  scripts = Object.entries(scripts).reduce((all, [name, script]) => {
    if (script) {
      all[name] = script
    }
    return all
  }, {})
  const prefixColors = Object.keys(scripts)
    .reduce(
      (pColors, _s, i) =>
        pColors.concat([`${colors[i % colors.length]}.bold.white`]),
      [],
    )
    .join(',')

  // prettier-ignore
  return [
    killOthers ? '--kill-others-on-fail' : null,
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    '--prefix-colors', prefixColors,
    ...Object.values(scripts).map(s => JSON.stringify(s)), // stringify escapes quotes ✨
  ].filter(Boolean)
}

function uniq(arr) {
  return Array.from(new Set(arr))
}

function writeExtraEntry(name, {cjs, esm}, clean = true) {
  if (clean) {
    rimraf.sync(fromRoot(name))
  }
  mkdirp.sync(fromRoot(name))

  const pkgJson = fromRoot(`${name}/package.json`)
  const entryDir = fromRoot(name)

  fs.writeFileSync(
    pkgJson,
    JSON.stringify(
      {
        main: path.relative(entryDir, cjs),
        'jsnext:main': path.relative(entryDir, esm),
        module: path.relative(entryDir, esm),
      },
      null,
      2,
    ),
  )
}

function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions)
  const result = explorerSync.search(pkgPath)

  return result !== null
}

async function generateTypeDefs(outputDir) {
  const result = spawn.sync(
    resolveBin('typescript', {executable: 'tsc'}),
    // prettier-ignore
    [
      '--declaration',
      '--emitDeclarationOnly',
      '--noEmit', 'false',
      '--outDir', outputDir,
    ],
    {stdio: 'inherit'},
  )
  if (result.status !== 0) return result

  await cpy('**/*.d.ts', '../dist', {cwd: fromRoot('src'), parents: true})
  return result
}

function getRollupInputs() {
  const buildInputGlob =
    process.env.BUILD_INPUT ||
    (hasTypescript ? 'src/index.{js,ts,tsx}' : 'src/index.js')
  const input = glob.sync(fromRoot(buildInputGlob))
  if (!input.length) {
    throw new Error(`Unable to find files with this glob: ${buildInputGlob}`)
  }
  return input
}

function getRollupOutput(format = process.env.BUILD_FORMAT) {
  const minify = parseEnv('BUILD_MINIFY', false)
  const filenameSuffix = process.env.BUILD_FILENAME_SUFFIX || ''
  const filename = [
    pkg.name,
    filenameSuffix,
    `.${format}`,
    minify ? '.min' : null,
    '.js',
  ]
    .filter(Boolean)
    .join('')

  const isPreact = parseEnv('BUILD_PREACT', false)
  const filenamePrefix =
    process.env.BUILD_FILENAME_PREFIX || (isPreact ? 'preact/' : '')
  const dirpath = path.join(...[filenamePrefix, 'dist'].filter(Boolean))
  return {dirpath, filename}
}

module.exports = {
  appDirectory,
  fromRoot,
  getConcurrentlyArgs,
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  hasScript,
  hasAnyDep,
  hasDep,
  ifAnyDep,
  ifDep,
  ifDevDep,
  ifFile,
  ifPeerDep,
  ifScript,
  hasTypescript,
  ifTypescript,
  parseEnv,
  pkg,
  resolveBin,
  resolveKcdScripts,
  uniq,
  writeExtraEntry,
  generateTypeDefs,
  getRollupInputs,
  getRollupOutput,
}
