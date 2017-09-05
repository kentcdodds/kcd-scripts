const fs = require('fs')
const path = require('path')
const readPkgUp = require('read-pkg-up')
const arrify = require('arrify')

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

const getPkg = () => readPkgUp.sync({cwd: process.cwd()}).pkg

const hasPkgProp = (pkgProp, props) =>
  arrify(props).some(prop => getPkg().hasOwnProperty(prop))
const ifPkgProp = (pkgProp, props, t, f) => (hasPkgProp(pkgProp, props) ? t : f)

const hasPeerDep = hasPkgProp.bind(null, 'peerDependencies')
const hasDep = hasPkgProp.bind(null, 'dependencies')
const hasDevDep = hasPkgProp.bind(null, 'devDependencies')
const hasAnyDep = (...args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args))

const ifPeerDep = ifPkgProp.bind(null, 'peerDependencies')
const ifDep = ifPkgProp.bind(null, 'dependencies')
const ifDevDep = ifPkgProp.bind(null, 'devDependencies')
const ifAnyDep = (deps, t, f) => (hasAnyDep(deps) ? t : f)

const ifScript = (script, t, f) =>
  (getPkg().scripts || {}).hasOwnProperty(script) ? t : f

function ifConfig(type, defaultConfig) {
  const configPath = path.resolve(path.join(appDirectory, '/kcd.config.js'))
  if (fs.existsSync(configPath)) {
    return require(configPath)[type] || defaultConfig
  } else {
    return {}
  }
}

module.exports = {
  ifDevDep,
  ifPeerDep,
  ifScript,
  ifDep,
  ifAnyDep,
  ifConfig,
  hasPkgProp,
  appDirectory,
  fromRoot,
  resolveBin,
}
