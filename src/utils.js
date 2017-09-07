const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const has = require('lodash.has')

function resolveBin(modName, {executable = modName} = {}) {
  const pkgPath = require.resolve(`${modName}/package.json`)
  const pkgDir = path.dirname(pkgPath)
  const {bin} = require(pkgPath)
  if (typeof bin === 'string') {
    return path.join(pkgDir, bin)
  }
  return path.join(pkgDir, bin[executable])
}

const appDirectory = fs.realpathSync(process.cwd())
const fromRoot = (...p) => path.join(appDirectory, ...p)
const hasFile = (...p) => fs.existsSync(fromRoot(...p))

const getPkg = () => require(fromRoot('package.json'))

const hasPkgProp = props => arrify(props).some(prop => has(getPkg(), prop))

const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))

const ifPkgSubProp = pkgProp => (props, t, f) =>
  hasPkgSubProp(pkgProp, props) ? t : f

const hasScript = hasPkgSubProp('script')
const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasAnyDep = (...args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args))

const ifPeerDep = ifPkgSubProp('peerDependencies')
const ifDep = ifPkgSubProp('dependencies')
const ifDevDep = ifPkgSubProp('devDependencies')
const ifAnyDep = (deps, t, f) => (hasAnyDep(deps) ? t : f)
const ifScript = ifPkgSubProp('scripts')

function parseEnv(name, def) {
  if (process.env.hasOwnProperty(name)) {
    return JSON.parse(process.env[name])
  }
  return def
}

function getConcurrentlyArgs(scripts) {
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
  const prefixColors = Object.keys(scripts)
    .reduce(
      (pColors, _s, i) =>
        pColors.concat([`${colors[i % colors.length]}.bold.reset`]),
      [],
    )
    .join(',')

  // prettier-ignore
  return [
    '--kill-others-on-fail',
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    '--prefix-colors', prefixColors,
    ...Object.values(scripts).map(s => JSON.stringify(s)), // stringify escapes quotes ✨
  ]
}

module.exports = {
  ifDevDep,
  ifPeerDep,
  ifScript,
  ifDep,
  ifAnyDep,
  hasPkgProp,
  appDirectory,
  fromRoot,
  hasScript,
  resolveBin,
  parseEnv,
  getPkg,
  hasFile,
  getConcurrentlyArgs,
}
